import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailService {
  transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    const user = this.configService.get<string>('FORPSI_EMAIL_LOGIN');
    const pass = this.configService.get<string>('FORPSI_EMAIL_PASSWORD');

    if (!user || !pass) {
      throw new InternalServerErrorException('Missing email auth');
    }

    this.transporter = nodemailer.createTransport({
      host: 'smtp.forpsi.com',
      port: 465,
      secure: true,
      auth: {
        user,
        pass,
      },
    });
  }

  async sendEmail(data: Mail.Options) {
    await this.transporter.sendMail(data);
  }
}
