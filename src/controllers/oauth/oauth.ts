import Koa from 'koa'
import { OAuthService } from '~/services/oauth'

export class OAuthController {
  private readonly oauthService: OAuthService

  public constructor(oauthService: OAuthService) {
    this.oauthService = oauthService
  }

  public async githubLogin(ctx: Koa.Context): Promise<void> {
    const { code } = ctx.request.body
    const { token } = await this.oauthService.githubLogin(code || '')
    ctx.body = { token }
  }
}
