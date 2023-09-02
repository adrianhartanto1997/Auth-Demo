import { Expose } from 'class-transformer'

class UsersView {
  @Expose() id: number
  @Expose() email: string
  @Expose() name: string
  @Expose() hasVerifiedEmail: Boolean
  @Expose() signUpDate: Date
  @Expose() numLogin: number
  @Expose() lastSession: Date
}

export { UsersView }