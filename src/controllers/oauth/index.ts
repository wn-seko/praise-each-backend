import Router from '@koa/router'
import { OAuthController } from './oauth'
import { container } from '~/inversify/config'
import { TYPES } from '~/inversify/types'
import { OAuthService } from '~/services/oauth'

const oauthService = container.get<OAuthService>(TYPES.OAuthService)
const oauthController = new OAuthController(oauthService)

export const oauthRouter = new Router({ prefix: '/oauth' })

oauthRouter.get(
  '/links/login',
  oauthController.getLoginUrls.bind(oauthController),
)
oauthRouter.get(
  '/links/update_icon',
  oauthController.getUpdateIconUrls.bind(oauthController),
)
oauthRouter.get(
  '/links/linkage',
  oauthController.getLinkageUrls.bind(oauthController),
)
oauthRouter.post(
  '/github/login',
  oauthController.githubLogin.bind(oauthController),
)
oauthRouter.post(
  '/github/update_icon',
  oauthController.githubUpdateIcon.bind(oauthController),
)
oauthRouter.post(
  '/github/linkage',
  oauthController.githubLinkage.bind(oauthController),
)
oauthRouter.post(
  '/google/login',
  oauthController.googleLogin.bind(oauthController),
)
oauthRouter.post(
  '/google/update_icon',
  oauthController.googleUpdateIcon.bind(oauthController),
)
oauthRouter.post(
  '/google/linkage',
  oauthController.googleLinkage.bind(oauthController),
)
