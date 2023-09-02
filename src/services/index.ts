import { UserRepositoryImpl } from '@/repositories/user_repository'
import { VerificationTokenRepositoryImpl } from '@/repositories/verification_token_repository'
import { AdminRepositoryImpl } from '@/repositories/admin_repository'
import { LogRepositoryImpl } from '@/repositories/log_repository'
import { EmailSenderImpl } from '@/lib/email_sender'
import AuthService from './auth_service'
import AdminService from './admin_service'

const userRepository = new UserRepositoryImpl()
const verificationTokenRepository = new VerificationTokenRepositoryImpl()
const adminRepository = new AdminRepositoryImpl()
const logRepository = new LogRepositoryImpl()

const emailSender = new EmailSenderImpl(
  process.env.SMTP_HOST as any,
  process.env.SMTP_PORT as any,
  process.env.SMTP_USER as any,
  process.env.SMTP_PASSWORD as any
)

const authService = new AuthService(
  userRepository,
  verificationTokenRepository,
  logRepository,
  emailSender
)

const adminService = new AdminService(userRepository, adminRepository)

export { authService, adminService }
