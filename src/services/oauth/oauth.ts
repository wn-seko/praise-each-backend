import { User } from '~/domains/entities/user'
import { UserCredential } from '~/domains/entities/userCredential'
import { UserRepository } from '~/domains/repositories/user'
import { UserCredentialRepository } from '~/domains/repositories/userCredential'
import { env } from '~/env'
import { ApplicationError, errorCode } from '~/services/errors'
import { getJWT } from '~/utils/jwt'
import { get, post } from '~/utils/request'

type OAuthType = 'github' | 'google'

type OAuthState = 'login' | 'update_icon' | 'linkage'

interface AccessTokenResponse {
  access_token: string
}

interface GithubProfile {
  id: string
  name: string
  login: string
  avatar_url: string
}

interface GoogleProfile {
  id: string
  name: string
  picture: string
  error?: {
    code: number
    message: string
    status: string
  }
}

interface Profile {
  id: string
  name: string
  icon: string
}

interface TokenResponse {
  token: string
}

export class OAuthService {
  private readonly userRepository: UserRepository
  private readonly userCredentialRepository: UserCredentialRepository

  public constructor(
    userRepository: UserRepository,
    userCredentialRepository: UserCredentialRepository,
  ) {
    this.userRepository = userRepository
    this.userCredentialRepository = userCredentialRepository
  }

  private async checkExistsUser(userId: string): Promise<User> {
    const user = await this.userRepository.getById(userId)

    if (!user) {
      throw new ApplicationError(errorCode.NOT_FOUND, 'User is not found.', {
        id: userId,
      })
    }

    return user
  }

  private async findOrCreate(
    type: 'github' | 'google',
    profile: Profile,
  ): Promise<User> {
    const name = profile.name || 'Anonymous'
    const icon = profile.icon || ''
    const sanitizedName = name.replace(/\s/g, '_')
    const user = await this.userRepository.getByOAuth(profile.id, type)

    if (user) {
      return user
    }

    const newUser = new User({ name: sanitizedName, icon })
    const newUserCredential = new UserCredential({
      userId: newUser.id,
      oauthId: profile.id,
      oauthType: type,
    })

    const newUserResult = await this.userRepository.create(newUser)
    await this.userCredentialRepository.create(newUserCredential)

    return newUserResult
  }

  private createAuthenticationError(
    code?: string,
    error?: Error,
  ): ApplicationError {
    const parameter = code ? { code } : {}

    return new ApplicationError(
      errorCode.AUTHENTICATION_ERROR,
      'OAuth authentication failure.',
      parameter,
      error ? error : undefined,
    )
  }

  private async oauthGithub(code: string): Promise<Profile> {
    try {
      // Fetch Github Access Token
      const { body: accessTokenResult } = await post<AccessTokenResponse>(
        `https://${env.OAUTH_GITHUB_DOMAIN}/login/oauth/access_token`,
        {
          client_id: env.OAUTH_GITHUB_CLIENT_ID,
          client_secret: env.OAUTH_GITHUB_CLIENT_SECRET,
          code,
        },
      )

      const { body: profile } = await get<GithubProfile>(
        'https://api.github.com/user',
        {},
        { Authorization: `Bearer ${accessTokenResult.access_token}` },
      )

      return {
        id: profile.id,
        name: profile.login,
        icon: profile.avatar_url,
      }
    } catch (error) {
      console.error(error)
      throw this.createAuthenticationError(code, error as Error)
    }
  }

  private async oauthGoogle(code: string): Promise<Profile> {
    try {
      // Fetch Google Access Token
      const { body: accessTokenResult } = await post<AccessTokenResponse>(
        `https://accounts.google.com/o/oauth2/token`,
        {
          client_id: env.OAUTH_GOOGLE_CLIENT_ID,
          client_secret: env.OAUTH_GOOGLE_CLIENT_SECRET,
          redirect_uri: env.OAUTH_GOOGLE_CALLBACK_URL,
          grant_type: 'authorization_code',
          code,
        },
      )

      const { body: result } = await get<GoogleProfile>(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessTokenResult.access_token}`,
        {},
      )

      if (result.error) {
        throw new ApplicationError(
          errorCode.AUTHENTICATION_ERROR,
          'Google authentication failure.',
        )
      }

      return {
        id: result.id,
        name: result.name,
        icon: result.picture,
      }
    } catch (error) {
      console.error(error)
      throw this.createAuthenticationError(code, error as Error)
    }
  }

  private async fetchOAuthProfile(
    type: OAuthType,
    code: string,
  ): Promise<Profile> {
    switch (type) {
      case 'github':
        return this.oauthGithub(code)
      case 'google':
        return this.oauthGoogle(code)
    }
  }

  public async getOAuthLinks(
    state: OAuthState,
  ): Promise<{ [name: string]: string }> {
    const urls: { [name: string]: string } = {}

    if (
      env.OAUTH_GITHUB_DOMAIN &&
      env.OAUTH_GITHUB_CLIENT_ID &&
      env.OAUTH_GITHUB_CLIENT_SECRET &&
      env.OAUTH_GITHUB_CALLBACK_URL
    ) {
      urls.github = `https://${env.OAUTH_GITHUB_DOMAIN}/login/oauth/authorize?client_id=${env.OAUTH_GITHUB_CLIENT_ID}&scope=public_user&state=${state}`
    }

    if (
      env.OAUTH_GOOGLE_CLIENT_ID &&
      env.OAUTH_GOOGLE_CLIENT_SECRET &&
      env.OAUTH_GOOGLE_CALLBACK_URL
    ) {
      urls.google = `https://accounts.google.com/o/oauth2/auth?&client_id=${env.OAUTH_GOOGLE_CLIENT_ID}&redirect_uri=${env.OAUTH_GOOGLE_CALLBACK_URL}&scope=https://www.googleapis.com/auth/userinfo.profile&response_type=code&state=${state}`
    }

    return urls
  }

  public async login(type: OAuthType, code: string): Promise<TokenResponse> {
    if (!code) {
      throw this.createAuthenticationError()
    }

    const profile = await this.fetchOAuthProfile(type, code)
    const user = await this.findOrCreate(type, profile)
    const token = getJWT(user)

    return { token }
  }

  public async updateIcon(
    userId: string,
    type: OAuthType,
    code: string,
  ): Promise<TokenResponse> {
    if (!code) {
      throw this.createAuthenticationError()
    }

    const user = await this.checkExistsUser(userId)
    const profile = await this.fetchOAuthProfile(type, code)

    user.update({ icon: profile.icon })
    this.userRepository.update(user)

    const token = getJWT(user)

    return { token }
  }

  public async linkage(
    userId: string,
    type: OAuthType,
    code: string,
  ): Promise<TokenResponse> {
    if (!code) {
      throw this.createAuthenticationError()
    }

    const user = await this.checkExistsUser(userId)
    const profile = await this.fetchOAuthProfile(type, code)

    const userCredential = new UserCredential({
      userId,
      oauthId: profile.id,
      oauthType: type,
    })

    await this.userCredentialRepository.create(userCredential)

    const token = getJWT(user)

    return { token }
  }
}
