import { CustomContext } from '~/middlewares/context'
import { OAuthService } from '~/services/oauth'

export class OAuthController {
  private readonly oauthService: OAuthService

  public constructor(oauthService: OAuthService) {
    this.oauthService = oauthService
  }

  public async getLoginUrls(ctx: CustomContext): Promise<void> {
    const urls = await this.oauthService.getOAuthLinks('login')
    ctx.body = urls
  }

  public async getUpdateIconUrls(ctx: CustomContext): Promise<void> {
    const urls = await this.oauthService.getOAuthLinks('update_icon')
    ctx.body = urls
  }

  public async getLinkageUrls(ctx: CustomContext): Promise<void> {
    const urls = await this.oauthService.getOAuthLinks('linkage')
    ctx.body = urls
  }

  public async githubLogin(ctx: CustomContext): Promise<void> {
    const { code } = ctx.request.body
    const { token } = await this.oauthService.login('github', code || '')
    ctx.body = { token }
  }

  public async githubUpdateIcon(ctx: CustomContext): Promise<void> {
    const userId = ctx.authUserId
    const { code } = ctx.request.body
    const { token } = await this.oauthService.updateIcon(
      userId,
      'github',
      code || '',
    )
    ctx.body = { token }
  }

  public async githubLinkage(ctx: CustomContext): Promise<void> {
    const userId = ctx.authUserId
    const { code } = ctx.request.body
    const { token } = await this.oauthService.linkage(
      userId,
      'github',
      code || '',
    )
    ctx.body = { token }
  }

  public async googleLogin(ctx: CustomContext): Promise<void> {
    const { code } = ctx.request.body
    const { token } = await this.oauthService.login('google', code || '')
    ctx.body = { token }
  }

  public async googleUpdateIcon(ctx: CustomContext): Promise<void> {
    const userId = ctx.authUserId
    const { code } = ctx.request.body
    const { token } = await this.oauthService.updateIcon(
      userId,
      'google',
      code || '',
    )
    ctx.body = { token }
  }

  public async googleLinkage(ctx: CustomContext): Promise<void> {
    const userId = ctx.authUserId
    const { code } = ctx.request.body
    const { token } = await this.oauthService.linkage(
      userId,
      'google',
      code || '',
    )
    ctx.body = { token }
  }
}
