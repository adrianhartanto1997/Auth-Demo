import { User } from '@/models/entities'
import { UsersView } from '@/models/entities'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import prismaClient from './prisma_client'

interface UserRepository {
  getByID(id: number): Promise<User | null>
  getByEmail(email: string): Promise<User | null>
  create(user: User): Promise<User>
  update(user: User): Promise<User>
}

class UserRepositoryImpl {
  async getByID(id: number): Promise<User | null> {
    const userData = await prismaClient.user.findFirst({
      where: {
        id: id,
      },
    })

    const userModel = plainToInstance(User, userData, {
      excludeExtraneousValues: true,
      groups: ['private', 'timestamps'],
    })

    return userModel
  }

  async getByEmail(email: string): Promise<User | null> {
    const userData = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    })

    const userModel = plainToInstance(User, userData, {
      excludeExtraneousValues: true,
      groups: ['private', 'timestamps'],
    })

    return userModel
  }

  async create(user: User): Promise<User> {
    const userData = instanceToPlain(user, {
      excludeExtraneousValues: true,
      groups: ['private'],
    })

    const createdUser = await prismaClient.user.create({
      data: { ...userData } as any,
    })

    user.id = createdUser.id
    user.createdAt = createdUser.createdAt
    user.updatedAt = createdUser.updatedAt

    return user
  }

  async update(user: User): Promise<User> {
    const userData = instanceToPlain(user, {
      excludeExtraneousValues: true,
      groups: ['private'],
    })

    const updatedUser = await prismaClient.user.update({
      where: {
        id: user.id
      },
      data: { ...userData } as any,
    })

    user.updatedAt = updatedUser.updatedAt

    return user
  }
}

export type { UserRepository }
export { UserRepositoryImpl }
