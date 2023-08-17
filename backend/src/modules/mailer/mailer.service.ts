import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import * as NodeMailer from 'nodemailer';

interface MailRecipient {
  email: string;
  name?: string;
}

@Injectable()
export class MailerService {
  private readonly _transporter: NodeMailer.Transporter;
  private readonly _sender: string;

  constructor(
    private readonly _configService: ConfigService,
    private readonly _logger: PinoLogger,
  ) {
    this._logger.setContext(MailerService.name);

    this._transporter = NodeMailer.createTransport({
      host: this._configService.getOrThrow('mailer.host'),
      port: this._configService.getOrThrow('mailer.port'),
    });

<<<<<<< HEAD
        this._sender = this._configService.getOrThrow('mailer.sender')
    }
=======
    this._sender = this._configService.getOrThrow('mailer.sender');
    console.log('mailer sender', this._sender);
  }
>>>>>>> 279dc92 (feat(frontend):activate,modals-manager,404page)

  public async send(to: MailRecipient[], subject: string, text: string) {
    this._logger.debug('Sending email to %o, subject %s', to, subject);

    await this._transporter.sendMail({
      from: this._sender,
      to: this._formatRecipients(to),
      subject,
      text,
    });

    this._logger.debug('Successfuly sent email to %o, subject %s', to, subject);
  }

  private _formatRecipients(recipients: MailRecipient[]) {
    return recipients
      .map(
        (recipient) =>
          `${recipient.name ? recipient.name.concat(' ') : ''}<${
            recipient.email
          }>`,
      )
      .join(',');
  }

  public async sendEmailActivationEmail(
    to: MailRecipient[],
    activationToken: string,
  ) {
    const activationLink = `${this._configService.getOrThrow(
      'webapp.url',
    )}/auth/activate?token=${activationToken}`;

    // TODO provide a nice template
    return this.send(
      to,
      'Activate you account',
      `Activate your account with link: ${activationLink}`,
    );
  }

  public async sendPasswordRecoveryEmail(
    to: MailRecipient[],
    recoveryToken: string,
  ) {
    const activationLink = `${this._configService.getOrThrow(
      'webapp.url',
    )}/auth/recovery?token=${recoveryToken}`;

    // TODO provide a nice template
    return this.send(
      to,
      'Password recovery',
      `Recover your password with link: ${activationLink}`,
    );
  }
}
