import { Expose } from 'class-transformer'
class User {
  @Expose() id?: number
  @Expose() email: string
  @Expose() name: string
  @Expose({ groups: ['private'] }) password: string
  @Expose() hasVerifiedEmail: boolean
  @Expose({ groups: ['timestamps'] }) createdAt?: Date
  @Expose({ groups: ['timestamps'] }) updatedAt?: Date

  constructor(email: string, name: string, password: string) {
    this.email = email
    this.name = name
    this.password = password
    this.hasVerifiedEmail = false
  }
}

export { User }
