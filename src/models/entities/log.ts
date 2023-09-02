import { Expose, Type } from 'class-transformer'
import { User } from './user'

export const typeLogin = 'LOGIN'
export const typeSession = 'SESSION'

@Expose()
class Log {
  @Expose() id?: number
  @Expose() type: string
  @Expose() userID: number

  @Expose()
  @Type(() => User)
  user?: User

  @Expose({ groups: ['timestamps'] }) createdAt?: Date
}

export { Log }
