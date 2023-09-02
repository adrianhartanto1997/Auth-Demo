import { VerificationToken } from '@/models/entities'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import prismaClient from './prisma_client'

interface VerificationTokenRepository {
  get(
    type: string,
    userID: number,
    token: string
  ): Promise<VerificationToken | null>
  create(token: VerificationToken): Promise<VerificationToken>
  markAsExpired(type: string, userID: number, expiredAt: Date): Promise<void>
}

class VerificationTokenRepositoryImpl {
  async get(
    type: string,
    userID: number,
    token: string
  ): Promise<VerificationToken | null> {
    const data = await prismaClient.verificationToken.findFirst({
      where: { type, userID, token },
      include: {
        user: true,
      },
    })

    const model = plainToInstance(VerificationToken, data, {
      excludeExtraneousValues: true,
      groups: ['private', 'timestamps'],
    })

    return model
  }

  async create(token: VerificationToken): Promise<VerificationToken> {
    const tokenData = instanceToPlain(token, {
      excludeExtraneousValues: true,
    })

    const createdData = await prismaClient.verificationToken.create({
      data: { ...tokenData } as any,
    })

    token.id = createdData.id
    token.createdAt = createdData.createdAt
    token.expiredAt = createdData.expiredAt

    return token
  }

  async markAsExpired(
    type: string,
    userID: number,
    expiredAt: Date
  ): Promise<void> {
    await prismaClient.verificationToken.updateMany({
      where: {
        type,
        userID,
      },
      data: {
        expiredAt,
      },
    })
  }
}

export type { VerificationTokenRepository }
export { VerificationTokenRepositoryImpl }
