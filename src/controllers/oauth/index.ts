import Router from '@koa/router'
import { OAuthController } from './oauth'
import { container } from '~/inversify/config'
import { TYPES } from '~/inversify/types'
import { OAuthService } from '~/services/oauth'

const oauthService = container.get<OAuthService>(TYPES.OAuthService)
const oauthController = new OAuthController(oauthService)

export const oauthRouter = new Router({ prefix: '/oauth' })

oauthRouter.post('/github', oauthController.githubLogin.bind(oauthController))
oauthRouter.post('/google', oauthController.googleLogin.bind(oauthController))
