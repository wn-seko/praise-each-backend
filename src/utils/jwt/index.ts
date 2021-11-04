import jwt from 'jsonwebtoken'
import { User } from '~/domains/entities/user'
import { env } from '~/env'

export const getJWT = (user: User): string => {
  const token = jwt.sign(user.toJSON(), env.APPLICATION_SECRET, {
    expiresIn: '1h',
  })
  return token
}
