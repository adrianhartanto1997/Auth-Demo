import { Expose, Type } from 'class-transformer'
import { User } from './user'

export const typeEmailVerification = 'EMAIL-VERIFICATION'
export const typeForgetPassword = 'FORGET-PASSWORD'

@Expose()
class VerificationToken {
  @Expose() id?: number
  @Expose() type: string
  @Expose() userID: number

  @Expose()
  @Type(() => User)
  user?: User

  @Expose() token: string
  @Expose({ groups: ['timestamps'] }) createdAt?: Date
  @Expose({ groups: ['timestamps'] }) expiredAt?: Date

  constructor(userID: number, token: string, expiredAt: Date) {
    ;(this.userID = userID), (this.token = token)
    this.expiredAt = expiredAt
  }
}

export { VerificationToken }
