import cors from '@koa/cors'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { handler } from '~/handler'
import { routers } from '~/routes'

const app = new Koa()

// CORS
app.use(cors({ origin: '*' }))

// error handling
app.use(handler())

// parser
app.use(bodyParser())

// routers
routers(app)

app.listen(3000)
