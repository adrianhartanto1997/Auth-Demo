import { UsersView, Statistic } from '@/models/entities'
import { plainToInstance } from 'class-transformer'
import prismaClient from './prisma_client'

interface AdminRepository {
  getUsersView(): Promise<UsersView[]>
  getStatistic(): Promise<Statistic>
}

class AdminRepositoryImpl {
  async getUsersView(): Promise<UsersView[]> {
    const data = await prismaClient.usersView.findMany()
    const result = plainToInstance(UsersView, data, {
      excludeExtraneousValues: true,
    })

    return result
  }

  async getStatistic(): Promise<Statistic> {
    const now = new Date()

    const usersCount = await prismaClient.user.count()

    const todayActiveSessionQuery =
      await prismaClient.activeSessionView.aggregate({
        _count: {
          userID: true,
        },
        where: {
          sessionDate: {
            equals: now,
          },
        },
      })
    const todayActiveSessionCount = todayActiveSessionQuery._count.userID

    const nDays = 7
    const nDate = new Date(now.getTime() - nDays * 24 * 60 * 60 * 1000)
    const rollingActiveSessionQuery =
      await prismaClient.activeSessionView.groupBy({
        by: ['sessionDate'],
        _count: {
          userID: true,
        },
        where: {
          sessionDate: {
            gte: nDate,
          },
        },
      })

    const rollingActiveSessionAvg =
      Math.round(
        (rollingActiveSessionQuery.reduce((a, b) => a + b._count.userID, 0) /
          rollingActiveSessionQuery.length) *
          100
      ) / 100

    return {
      usersCount,
      todayActiveSessionCount,
      last7DaysActiveSessionAvg: rollingActiveSessionAvg
    }
  }
}

export type { AdminRepository }
export { AdminRepositoryImpl }
