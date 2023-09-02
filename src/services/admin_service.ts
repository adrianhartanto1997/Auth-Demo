import { ErrorResponse, NewInternalServerErrorResponse } from '@/lib/response'
import { UsersView, Statistic } from '@/models/entities'
import type { AdminRepository } from '@/repositories/admin_repository'
import { UserRepository } from '@/repositories/user_repository'

class AdminService {
  private userRepository: UserRepository
  private adminRepository: AdminRepository

  constructor(
    userRepository: UserRepository,
    adminRepository: AdminRepository
  ) {
    ;(this.userRepository = userRepository),
      (this.adminRepository = adminRepository)
  }

  async getUsersView(
    userID: number
  ): Promise<[UsersView[] | null, ErrorResponse | null]> {
    try {
      const err = await this.checkIfUserHasVerifiedEmail(userID)
      if (err) return [null, err]

      const data = await this.adminRepository.getUsersView()
      return [data, null]
    } catch (e: any) {
      const errResp = NewInternalServerErrorResponse(e)
      return [null, errResp]
    }
  }

  async getStatistic(
    userID: number
  ): Promise<[Statistic | null, ErrorResponse | null]> {
    try {
      const err = await this.checkIfUserHasVerifiedEmail(userID)
      if (err) return [null, err]

      const data = await this.adminRepository.getStatistic()
      return [data, null]
    } catch (e: any) {
      const errResp = NewInternalServerErrorResponse(e)
      return [null, errResp]
    }
  }

  private async checkIfUserHasVerifiedEmail(
    userID: number
  ): Promise<ErrorResponse | null> {
    const user = await this.userRepository.getByID(userID)
    if (!user) {
      return {
        statusCode: 401,
        payload: 'Unauthorized user',
      }
    }

    if (!user.hasVerifiedEmail) {
      return {
        statusCode: 403,
        payload: 'Permission denied',
      }
    }

    return null
  }
}

export default AdminService
