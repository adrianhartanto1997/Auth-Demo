import {
  Log,
  User,
  VerificationToken,
  typeEmailVerification,
  typeForgetPassword,
  typeLogin,
  typeSession,
} from '@/models/entities'
import { SignInRequest, SignInRequestSchema } from '@/models/request/sign_in'
import { SignInResponse } from '@/models/response/sign_in'
import { SignUpRequest, SignUpRequestSchema } from '@/models/request/sign_up'
import { ProfileResponse } from '@/models/response/profile'
import {
  ForgetPasswordRequest,
  ResetPasswordRequest,
  ForgetPasswordRequestSchema,
  ResetPasswordRequestSchema,
} from '@/models/request/reset_password'
import { GetResetPasswordResponse } from '@/models/response/reset_password'
import {
  UpdateProfileRequest,
  UpdateProfileRequestSchema,
} from '@/models/request/update_profile'
import {
  ChangePasswordRequest,
  ChangePasswordRequestSchema,
} from '@/models/request/change_password'
import type { UserRepository } from '@/repositories/user_repository'
import type { VerificationTokenRepository } from '@/repositories/verification_token_repository'
import type { LogRepository } from '@/repositories/log_repository'
import type { EmailSender } from '@/lib/email_sender'
import { ErrorResponse, NewInternalServerErrorResponse } from '@/lib/response'
import { generateAccessToken, generateSessionToken } from '@/lib/token'
import { validateRequestSchema } from '@/lib/request_validation'
import { instanceToPlain } from 'class-transformer'
import { hashSync, compareSync } from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { Profile } from 'passport-google-oauth20'

class AuthService {
  private userRepository: UserRepository
  private verificationTokenRepository: VerificationTokenRepository
  private logRepository: LogRepository
  private emailSender: EmailSender

  constructor(
    userRepository: UserRepository,
    verificationTokenRepository: VerificationTokenRepository,
    logRepository: LogRepository,
    emailSender: EmailSender
  ) {
    this.userRepository = userRepository
    this.verificationTokenRepository = verificationTokenRepository
    this.logRepository = logRepository
    this.emailSender = emailSender
  }

  async signUp(
    request: SignUpRequest
  ): Promise<[ProfileResponse | null, ErrorResponse | null]> {
    try {
      const err = validateRequestSchema(SignUpRequestSchema, request)
      if (err) {
        return [null, err]
      }

      const existingUser = await this.userRepository.getByEmail(request.email)
      if (existingUser) {
        const errResp: ErrorResponse = {
          statusCode: 400,
          payload: { email: 'Email already exists' },
        }

        return [null, errResp]
      }

      const hashedPassword = hashSync(request.password, 10)
      let userModel: User = new User(
        request.email,
        request.name,
        hashedPassword
      )

      userModel = await this.userRepository.create(userModel)
      await this.sendEmailVerificationEmail(userModel)

      const response = instanceToPlain(userModel, {
        excludeExtraneousValues: true,
        groups: ['timestamps'],
      }) as ProfileResponse

      return [response, null]
    } catch (e: any) {
      const errResp = NewInternalServerErrorResponse(e)
      return [null, errResp]
    }
  }

  async signIn(
    request: SignInRequest
  ): Promise<[SignInResponse | null, ErrorResponse | null]> {
    try {
      const invalidCredentialError: ErrorResponse = {
        statusCode: 401,
        payload: 'Invalid credential',
      }

      const err = validateRequestSchema(SignInRequestSchema, request)
      if (err) {
        return [null, err]
      }

      const user = await this.userRepository.getByEmail(request.email)
      if (!user) {
        return [null, invalidCredentialError]
      }

      const passwordMatch = compareSync(request.password, user.password)
      if (!passwordMatch) {
        return [null, invalidCredentialError]
      }

      const signInResponse = await this.handleAccessAndSessionToken(user.id!)
      return [signInResponse, null]
    } catch (e: any) {
      const errResp = NewInternalServerErrorResponse(e)
      return [null, errResp]
    }
  }

  async oauthSignIn(
    profile: Profile
  ): Promise<[SignInResponse | null, ErrorResponse | null]> {
    const forbiddenError: ErrorResponse = {
      statusCode: 403,
      payload: { email: 'Forbidden' },
    }
    try {
      if (!profile._json.email) {
        return [null, forbiddenError]
      }

      let userID: number
      let user = await this.userRepository.getByEmail(profile._json.email!)
      if (!user) {
        const hashedPassword = hashSync(this.generateString(10), 10)
        const newUser: User = {
          email: profile._json.email!,
          name: profile._json.name!,
          hasVerifiedEmail: true,
          password: hashedPassword,
        }
        const createdUser = await this.userRepository.create(newUser)
        userID = createdUser.id!
      } else {
        userID = user.id!
      }

      const signInResponse = await this.handleAccessAndSessionToken(userID)
      return [signInResponse, null]
    } catch (e: any) {
      const errResp = NewInternalServerErrorResponse(e)
      return [null, errResp]
    }
  }

  async requestEmailVerification(
    userID: number
  ): Promise<ErrorResponse | null> {
    try {
      const [user, errResp] = await this.checkUser(userID)
      if (errResp) {
        return errResp
      }

      if (user?.hasVerifiedEmail) {
        const errResp = {
          statusCode: 403,
          payload: 'Email already verified',
        }
        return errResp
      }

      await this.sendEmailVerificationEmail(user!)

      return null
    } catch (e: any) {
      const errResp = NewInternalServerErrorResponse(e)
      return errResp
    }
  }

  async verifyEmail(
    userIDStr: string,
    token: string
  ): Promise<ErrorResponse | null> {
    let errResp: ErrorResponse
    try {
      const [verificationToken, errResp] = await this.checkVerificationToken(
        typeEmailVerification,
        userIDStr,
        token
      )
      if (errResp) {
        return errResp
      }

      const userModel = verificationToken?.user!
      userModel.hasVerifiedEmail = true
      await this.userRepository.update(userModel)

      const now = new Date(Date.now())
      this.verificationTokenRepository.markAsExpired(
        typeEmailVerification,
        userModel.id!,
        now
      )

      return null
    } catch (e: any) {
      errResp = NewInternalServerErrorResponse(e)
      return errResp
    }
  }

  async requestForgetPassword(
    request: ForgetPasswordRequest
  ): Promise<ErrorResponse | null> {
    try {
      let errResp: ErrorResponse
      const err = validateRequestSchema(ForgetPasswordRequestSchema, request)
      if (err) {
        return err
      }

      const user = await this.userRepository.getByEmail(request.email)
      if (!user) {
        errResp = {
          statusCode: 404,
          payload: 'User not found',
        }

        return errResp
      }

      await this.sendForgetPasswordRequestEmail(user)
      return null
    } catch (e: any) {
      const errResp = NewInternalServerErrorResponse(e)
      return errResp
    }
  }

  async getResetPassword(
    userIDStr: string,
    token: string
  ): Promise<[GetResetPasswordResponse | null, ErrorResponse | null]> {
    try {
      const [verificationToken, errResp] = await this.checkVerificationToken(
        typeForgetPassword,
        userIDStr,
        token
      )
      if (errResp) {
        return [null, errResp]
      }

      const response = instanceToPlain(verificationToken, {
        excludeExtraneousValues: true,
        groups: ['timestamps'],
      }) as GetResetPasswordResponse

      return [response, null]
    } catch (e: any) {
      const errResp = NewInternalServerErrorResponse(e)
      return [null, errResp]
    }
  }

  async resetPassword(
    userIDStr: string,
    token: string,
    request: ResetPasswordRequest
  ): Promise<ErrorResponse | null> {
    let errResp: ErrorResponse
    try {
      const err = validateRequestSchema(ResetPasswordRequestSchema, request)
      if (err) {
        return err
      }

      const [verificationToken, errResp] = await this.checkVerificationToken(
        typeForgetPassword,
        userIDStr,
        token
      )
      if (errResp) {
        return errResp
      }

      const hashedPassword = hashSync(request.password, 10)
      let user = verificationToken?.user!
      user.password = hashedPassword
      await this.userRepository.update(user)

      const now = new Date(Date.now())
      this.verificationTokenRepository.markAsExpired(
        typeForgetPassword,
        user.id!,
        now
      )

      return null
    } catch (e: any) {
      errResp = NewInternalServerErrorResponse(e)
      return errResp
    }
  }

  async getProfile(
    userID: number
  ): Promise<[ProfileResponse | null, ErrorResponse | null]> {
    try {
      const [user, errResp] = await this.checkUser(userID)
      if (errResp) {
        return [null, errResp]
      }

      const response = instanceToPlain(user, {
        excludeExtraneousValues: true,
        groups: ['timestamps'],
      }) as ProfileResponse

      return [response, null]
    } catch (e: any) {
      const errResp = NewInternalServerErrorResponse(e)
      return [null, errResp]
    }
  }

  async updateProfile(
    userID: number,
    request: UpdateProfileRequest
  ): Promise<[ProfileResponse | null, ErrorResponse | null]> {
    try {
      const err = validateRequestSchema(UpdateProfileRequestSchema, request)
      if (err) {
        return [null, err]
      }

      const [user, errResp] = await this.checkUser(userID)
      if (errResp) {
        return [null, errResp]
      }

      let userModel = user!
      userModel.name = request.name
      userModel = await this.userRepository.update(userModel)

      const response = instanceToPlain(user, {
        excludeExtraneousValues: true,
        groups: ['timestamps'],
      }) as ProfileResponse

      return [response, null]
    } catch (e: any) {
      const errResp = NewInternalServerErrorResponse(e)
      return [null, errResp]
    }
  }

  async changePassword(
    userID: number,
    request: ChangePasswordRequest
  ): Promise<ErrorResponse | null> {
    try {
      const err = validateRequestSchema(ChangePasswordRequestSchema, request)
      if (err) {
        return err
      }

      const [user, errResp] = await this.checkUser(userID)
      if (errResp) {
        return errResp
      }

      let userModel = user!
      const passwordMatch = compareSync(
        request.currentPassword,
        userModel.password
      )
      if (!passwordMatch) {
        return {
          statusCode: 401,
          payload: { currentPassword: 'Current password is wrong' },
        }
      }

      if (request.newPassword == request.currentPassword) {
        return {
          statusCode: 400,
          payload: { newPassword: 'New password shouldn\'t be the same with current password' },
        }
      }

      const hashedPassword = hashSync(request.newPassword, 10)
      userModel.password = hashedPassword
      await this.userRepository.update(userModel)

      return null
    } catch (e: any) {
      const errResp = NewInternalServerErrorResponse(e)
      return errResp
    }
  }

  private async sendEmailVerificationEmail(user: User) {
    const now = new Date()
    now.setDate(now.getDate() + 7)
    const token: VerificationToken = {
      type: typeEmailVerification,
      userID: user.id!,
      token: uuidv4(),
      expiredAt: now,
    }

    const tokenModel = await this.verificationTokenRepository.create(token)

    // Run async
    this.emailSender
      .sendEmailVerification(user, tokenModel.token)
      .catch((e) => console.log(e))
  }

  private async sendForgetPasswordRequestEmail(user: User) {
    const now = new Date()
    now.setDate(now.getDate() + 1)
    const token: VerificationToken = {
      type: typeForgetPassword,
      userID: user.id!,
      token: uuidv4(),
      expiredAt: now,
    }

    const tokenModel = await this.verificationTokenRepository.create(token)

    // Run async
    this.emailSender
      .sendForgetPassword(user, tokenModel.token)
      .catch((e) => console.log(e))
  }

  private async checkUser(
    userID: number
  ): Promise<[User | null, ErrorResponse | null]> {
    let errResp: ErrorResponse
    const user = await this.userRepository.getByID(userID)
    if (!user) {
      errResp = {
        statusCode: 401,
        payload: 'Invalid user',
      }
      return [null, errResp]
    }

    return [user, null]
  }

  private async checkVerificationToken(
    type: string,
    userIDStr: string,
    token: string
  ): Promise<[VerificationToken | null, ErrorResponse | null]> {
    let errResp: ErrorResponse
    const userID = Number(userIDStr)
    if (!userID) {
      const errResp: ErrorResponse = {
        statusCode: 404,
        payload: 'Token not found',
      }
      return [null, errResp]
    }

    const verificationToken = await this.verificationTokenRepository.get(
      type,
      userID,
      token
    )

    if (!verificationToken) {
      errResp = {
        statusCode: 404,
        payload: 'Token not found',
      }
      return [null, errResp]
    }

    const now = new Date(Date.now())
    if (now > verificationToken?.expiredAt!) {
      errResp = {
        statusCode: 410,
        payload: 'Token is expired',
      }
      return [null, errResp]
    }

    return [verificationToken, null]
  }

  private generateString(length: number) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ' '
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }

    return result
  }

  private async handleAccessAndSessionToken(userID: number): Promise<SignInResponse> {
    const accessToken = await generateAccessToken(userID)
    const sessionToken = await generateSessionToken(userID)

    this.insertLog(typeLogin, userID)
    this.insertLog(typeSession, userID)

    return {
      accessToken,
      sessionToken,
    }
  }

  async insertLog(type: string, userID: number) {
    const log: Log = {
      type,
      userID,
    }

    await this.logRepository.create(log)
  }
}

export default AuthService
