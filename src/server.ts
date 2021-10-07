import cors from '@koa/cors'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import jwt from 'koa-jwt'
import { env } from '~/env'
import { authParser } from '~/middlewares/context'
import { handler } from '~/middlewares/handler'
import { routers } from '~/middlewares/routes'

const app = new Koa()

// CORS
app.use(cors({ origin: '*' }))

// error handling
app.use(handler())

// check jwt
app.use(
  jwt({ secret: env.APPLICATION_SECRET }).unless({ path: [/^\/oauth\//] }),
)

app.use(authParser())

// parser
app.use(bodyParser())

// routers
routers(app)

app.listen(3000)
