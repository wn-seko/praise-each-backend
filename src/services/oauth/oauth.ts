import jwt from 'jsonwebtoken'
import request from 'request'
import { User } from '~/domains/entities/user'
import { UserCredential } from '~/domains/entities/userCredential'
import { UserRepository } from '~/domains/repositories/user'
import { UserCredentialRepository } from '~/domains/repositories/userCredential'
import { env } from '~/env'
import { ApplicationError, errorCode } from '~/services/errors'

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

  private async findOrCreate(
    oauthId: string,
    oauthType: 'github' | 'google',
    name: string,
    icon: string,
  ): Promise<User> {
    const sanitizedName = name.replace(/\s/g, '_')
    const user = await this.userRepository.getByOAuth(oauthId, oauthType)

    if (user) {
      if (user.name !== sanitizedName || user.icon !== icon) {
        user.update({ name: sanitizedName, icon })
        await this.userRepository.update(user)
      }

      return user
    }

    const newUser = new User({ name: sanitizedName, icon })
    const newUserCredential = new UserCredential({
      userId: newUser.id,
      oauthId,
      oauthType,
    })

    const newUserResult = await this.userRepository.create(newUser)
    await this.userCredentialRepository.create(newUserCredential)

    return newUserResult
  }

  private getJWT(user: User): string {
    const token = jwt.sign(user.toJSON(), env.APPLICATION_SECRET, {
      expiresIn: '1h',
    })
    return token
  }

  private async post<T extends {}>(
    uri: string,
    data: Record<string, string> = {},
    headers: Record<string, string> = {},
  ): Promise<{ response: request.Response; body: T }> {
    return new Promise((resolve, reject) => {
      const defaultHeaders = {
        'Content-type': 'application/json',
        'User-Agent': 'node',
      }
      const options = {
        uri,
        headers: { ...defaultHeaders, ...headers },
        json: data,
      }

      request.post(options, (error, response, body) => {
        if (error) {
          return reject(error)
        }

        resolve({ response, body })
      })
    })
  }

  private async get<T extends {}>(
    uri: string,
    parameter: Record<string, string> = {},
    headers: Record<string, string> = {},
  ): Promise<{ response: request.Response; body: T }> {
    return new Promise((resolve, reject) => {
      const defaultHeaders = {
        'Content-type': 'application/json',
        'User-Agent': 'node',
      }
      const options = {
        uri,
        headers: { ...defaultHeaders, ...headers },
        parameter,
        json: true,
      }

      request.get(options, (error, response, body) => {
        if (error) {
          return reject(error)
        }

        resolve({ response, body })
      })
    })
  }

  public async getLoginUrls(): Promise<{ [name: string]: string }> {
    const urls: { [name: string]: string } = {}

    if (
      env.OAUTH_GITHUB_DOMAIN &&
      env.OAUTH_GITHUB_CLIENT_ID &&
      env.OAUTH_GITHUB_CLIENT_SECRET &&
      env.OAUTH_GITHUB_CALLBACK_URL
    ) {
      urls.github = `https://${env.OAUTH_GITHUB_DOMAIN}/login/oauth/authorize?client_id=${env.OAUTH_GITHUB_CLIENT_ID}&scope=public_user`
    }

    if (
      env.OAUTH_GOOGLE_CLIENT_ID &&
      env.OAUTH_GOOGLE_CLIENT_SECRET &&
      env.OAUTH_GOOGLE_CALLBACK_URL
    ) {
      urls.google = `https://accounts.google.com/o/oauth2/auth?&client_id=${env.OAUTH_GOOGLE_CLIENT_ID}&redirect_uri=${env.OAUTH_GOOGLE_CALLBACK_URL}&scope=https://www.googleapis.com/auth/userinfo.profile&response_type=code`
    }

    return urls
  }

  public async githubLogin(code: string): Promise<{ token: string }> {
    if (!code) {
      throw new ApplicationError(
        errorCode.AUTHENTICATION_ERROR,
        'Github login failure.',
      )
    }

    try {
      // Fetch Github Access Token
      const { body: accessTokenResult } = await this.post<{
        access_token: string
      }>(`https://${env.OAUTH_GITHUB_DOMAIN}/login/oauth/access_token`, {
        client_id: env.OAUTH_GITHUB_CLIENT_ID,
        client_secret: env.OAUTH_GITHUB_CLIENT_SECRET,
        code,
      })

      const { body: profile } = await this.get<GithubProfile>(
        'https://api.github.com/user',
        {},
        { Authorization: `Bearer ${accessTokenResult.access_token}` },
      )

      const user = await this.findOrCreate(
        profile.id,
        'github',
        profile.name || profile.login || 'Anonymous',
        profile.avatar_url || '',
      )

      const token = this.getJWT(user)

      return { token }
    } catch (error) {
      console.error(error)
      throw new ApplicationError(
        errorCode.AUTHENTICATION_ERROR,
        'Github login failure.',
        { code },
        error as Error,
      )
    }
  }

  public async googleLogin(code: string): Promise<{ token: string }> {
    if (!code) {
      throw new ApplicationError(
        errorCode.AUTHENTICATION_ERROR,
        'Google login failure.',
      )
    }

    try {
      // Fetch Google Access Token
      const { body: accessTokenResult } = await this.post<{
        access_token: string
      }>(`https://accounts.google.com/o/oauth2/token`, {
        client_id: env.OAUTH_GOOGLE_CLIENT_ID,
        client_secret: env.OAUTH_GOOGLE_CLIENT_SECRET,
        redirect_uri: env.OAUTH_GOOGLE_CALLBACK_URL,
        grant_type: 'authorization_code',
        code,
      })

      const { body: profile } = await this.get<GoogleProfile>(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessTokenResult.access_token}`,
        {},
      )

      if (profile.error) {
        throw new ApplicationError(
          errorCode.AUTHENTICATION_ERROR,
          'Google login failure.',
        )
      }

      const user = await this.findOrCreate(
        profile.id,
        'google',
        profile.name || 'Anonymous',
        profile.picture || '',
      )

      const token = this.getJWT(user)

      return { token }
    } catch (error) {
      console.error(error)
      throw new ApplicationError(
        errorCode.AUTHENTICATION_ERROR,
        'Google login failure.',
        { code },
        error as Error,
      )
    }
  }
}
