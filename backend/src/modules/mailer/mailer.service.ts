import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import * as NodeMailer from 'nodemailer';
import * as fs from 'fs';
import {join} from 'path';

interface MailRecipient {
    email: string;
    name?: string,
}

const emailActivationTemplateFile = 'activation.html'
const emailRecoveryTemplateFile = 'recovery.html'

@Injectable()
export class MailerService {
    private readonly _transporter: NodeMailer.Transporter;
    private readonly _sender: string;

    constructor (
        private readonly _configService: ConfigService,
        private readonly _logger: PinoLogger,
    ) {
        this._logger.setContext(MailerService.name);

        this._transporter = NodeMailer.createTransport({
            host: this._configService.getOrThrow('mailer.host'),
            port: this._configService.getOrThrow('mailer.port'),
        });

        this._sender = this._configService.getOrThrow('mailer.sender')
    }

    public async send(to: MailRecipient[], subject: string, html: string) {
        this._logger.debug('Sending email to %o, subject %s', to, subject);

        await this._transporter.sendMail({
            from: this._sender,
            to: this._formatRecipients(to),
            subject,
            html: html,
            headers: {
                'Content-Type': 'text/html; charset=utf-8'
            }
        });

        this._logger.debug('Successfuly sent email to %o, subject %s',  to, subject);
    }

    private _formatRecipients(recipients: MailRecipient[]) {
        return recipients
            .map((recipient) => `${recipient.name ? recipient.name.concat(' ') : ''}<${recipient.email}>`)
            .join(',');
    }

    public async sendEmailActivationEmail(to: MailRecipient[], activationToken: string) {
        const activationLink = `${this._configService.getOrThrow('webapp.url')}/auth/activate?token=${activationToken}`;
        const username = to[0].name || 'User';

        const templateFilePath = join(process.cwd(), '../mails', emailActivationTemplateFile)
        const emailTemplate = fs.readFileSync(templateFilePath, 'utf8');

        const processedEmailTemplate = emailTemplate
          .replace(/\[Username\]/g, username)
          .replace(/\[ActivationLink\]/g, activationLink);

        return this.send(
          to,
          'Activate your account',
          processedEmailTemplate
        );
    }

    public async sendPasswordRecoveryEmail(to: MailRecipient[], recoveryToken: string) {
        const passwordResetLink = `${this._configService.getOrThrow('webapp.url')}/auth/recovery?token=${recoveryToken}`;
        const username = to[0].name || 'User';
        const email = to[0].email || 'Email';

        const templateFilePath = join(process.cwd(), '../mails', emailRecoveryTemplateFile)
        const emailTemplate = fs.readFileSync(templateFilePath, 'utf8');

        const processedEmailTemplate = emailTemplate
          .replace(/\[Username\]/g, username)
          .replace(/\[PasswordResetLink\]/g, passwordResetLink)
          .replace(/\[Email\]/g, email);

        return this.send(
            to,
            'Password recovery',
          processedEmailTemplate
        )
    }
}