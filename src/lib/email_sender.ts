import { User } from '@/models/entities'
import { createTransport, Transporter } from 'nodemailer'

interface EmailSender {
  sendEmailVerification(recipient: User, token: string): Promise<boolean>
  sendForgetPassword(recipient: User, token: string): Promise<boolean>
}

class EmailSenderImpl {
  transporter: Transporter
  from: string

  constructor(host: string, port: number, user: string, password: string) {
    this.transporter = createTransport({
      host: host,
      port: port,
      auth: {
        user: user,
        pass: password,
      },
    })

    this.from = user
  }

  sendEmailVerification(recipient: User, token: string): Promise<boolean> {
    const url = `${process.env["APP_HOST"]}/email/verify/${recipient.id}/${token}`
    const htmlContent = `Hi ${recipient.name}, please verify your email by clicking <a href="${url}">this link</a>
    <br><br>
    If the link is broken, please copy the following link and paste it into the browser:<br>
    ${url}`

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(
        {
          from: this.from,
          to: recipient.email,
          subject: 'Auth Demo: Verify Email',
          html: htmlContent,
        },
        function (error, _info) {
          if (error) {
            reject(error)
          } else {
            resolve(true)
          }
        }
      )
    })
  }

  sendForgetPassword(recipient: User, token: string): Promise<boolean> {
    const url = `${process.env["APP_HOST"]}/password/reset/${recipient.id}/${token}`
    const htmlContent = `Hi ${recipient.name}, please reset your password by clicking <a href="${url}">this link</a>
    <br><br>
    If the link is broken, please copy the following link and paste it into the browser:<br>
    ${url}`

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(
        {
          from: this.from,
          to: recipient.email,
          subject: 'Auth Demo: Reset Password',
          html: htmlContent,
        },
        function (error, _info) {
          if (error) {
            reject(error)
          } else {
            resolve(true)
          }
        }
      )
    })
  }
}

export type { EmailSender }
export { EmailSenderImpl }
