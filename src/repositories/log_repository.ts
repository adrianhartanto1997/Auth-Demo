import { Log } from '@/models/entities'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import prismaClient from './prisma_client'

interface LogRepository {
  create(log: Log): Promise<Log>
}

class LogRepositoryImpl {
  async create(log: Log): Promise<Log> {
    const data = instanceToPlain(log, {
      excludeExtraneousValues: true,
    })

    const createdData = await prismaClient.log.create({
      data: { ...data } as any,
    })

    log.id = createdData.id
    log.createdAt = createdData.createdAt

    return log
  }
}

export type { LogRepository }
export { LogRepositoryImpl }
