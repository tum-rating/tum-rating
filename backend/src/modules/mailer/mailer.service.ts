import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import * as NodeMailer from 'nodemailer';
import * as fs from 'fs';
import { join } from 'path';
import { User } from 'src/database/documents/user';

interface MailRecipient {
    email: string;
    name?: string;
}

interface EmailTemplates {
    activation: string;
    passwordRecovery: string;
    emailAlreadyExists: string;
}

const emailTemplatesDir = '../../../assets/mail-templates';
const emailActivationTemplateFile = 'activation.html';
const emailRecoveryTemplateFile = 'recovery.html';
const emailEmailAlreadyExistsTemplateFile = 'email-already-exists.html';

@Injectable()
export class MailerService {
    private readonly _transporter: NodeMailer.Transporter;
    private readonly _sender: string;
    private readonly _templates: EmailTemplates;

    constructor(
        private readonly _configService: ConfigService,
        private readonly _logger: PinoLogger,
    ) {
        this._logger.setContext(MailerService.name);

        this._transporter = NodeMailer.createTransport({
            host: this._configService.getOrThrow('mailer.host'),
            port: this._configService.getOrThrow('mailer.port'),
        });

        this._sender = this._configService.getOrThrow('mailer.sender');
        this._templates = this._initTemplates();
    }

    public async send(to: MailRecipient[], subject: string, html: string, text?: string) {
        this._logger.debug('Sending email to %o, subject %s', to, subject);

        await this._transporter.sendMail({
            from: this._sender,
            to: this._formatRecipients(to),
            subject,
            html: html,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
            },
            text
        });

        this._logger.debug('Successfuly sent email to %o, subject %s', to, subject);
    }



    public async sendEmailActivationEmail(to: MailRecipient[], activationToken: string) {
        const activationLink = `${this._configService.getOrThrow('webapp.url')}/auth/activate?token=${activationToken}`;
        const username = to[0].name || 'User';

        const processedEmailTemplate = this._injectVariablesToTemplate(this._templates.activation, {
            Username: username,
            ActivationLink: activationLink
        });

        return this.send(to, 'Activate your account', processedEmailTemplate);
    }

    public async sendPasswordRecoveryEmail(to: MailRecipient[], recoveryToken: string) {
        const passwordResetLink = `${this._configService.getOrThrow('webapp.url')}/auth/recovery?token=${recoveryToken}`;
        const username = to[0].name || 'User';
        const email = to[0].email || 'Email';

        const processedEmailTemplate = this._injectVariablesToTemplate(this._templates.passwordRecovery, {
            Username: username,
            PasswordResetLink: passwordResetLink,
            Email: email
        });

        return this.send(to, 'Password recovery', processedEmailTemplate);
    }

    public async sendEmailMultiAccountsAlert(possibleDuplicates: (Pick<User, 'email'> & {id: string})[]) {
        const adminEmails = this._configService.getOrThrow<string[]>('mailer.adminEmails');
        const toFormatted = adminEmails.map(email => ({email}));

        const text = 'Possible duplicates:\n'
            + possibleDuplicates.map(duplicate => `${duplicate.id}, ${duplicate.email}`).join(';');

        await this.send(toFormatted, 'TUM-RATING ADMIN ALERT', null, text);
    }

    public async sendEmailAlreadyExists(to: MailRecipient[], username: string, email: string) {
        const processedEmailTemplate = this._injectVariablesToTemplate(this._templates.emailAlreadyExists, {
            Username: username,
            Email: email,
            RecoveryLink: `${this._configService.getOrThrow('webapp.url')}#modal=forgot-password`
        });

        return this.send(to, 'Email is already registered', processedEmailTemplate);
    }

    private _formatRecipients(recipients: MailRecipient[]) {
        return recipients.map((recipient) => `${recipient.name ? recipient.name.concat(' ') : ''}<${recipient.email}>`).join(',');
    }

    private _initTemplates(): EmailTemplates {
        const activationTemplateFilePath = join(__dirname, emailTemplatesDir, emailActivationTemplateFile);
        const activationEmailTemplate = fs.readFileSync(activationTemplateFilePath, 'utf8');

        const passwordRecoveryTemplateFilePath = join(__dirname, emailTemplatesDir, emailRecoveryTemplateFile);
        const passwordRecoveryEmailTemplate = fs.readFileSync(passwordRecoveryTemplateFilePath, 'utf8');

        const emailAlreadyExistsTemplateFilePath = join(__dirname, emailTemplatesDir, emailEmailAlreadyExistsTemplateFile);
        const emailAlreadyExistsEmailTemplate = fs.readFileSync(emailAlreadyExistsTemplateFilePath, 'utf8');

        return {
            activation: activationEmailTemplate,
            passwordRecovery: passwordRecoveryEmailTemplate,
            emailAlreadyExists: emailAlreadyExistsEmailTemplate
        };
    }

    private _injectVariablesToTemplate(template: string, variables: Record<string, string>): string {
        return Object.entries(variables).reduce((acc, [key, value]) => {
            return acc.replace(new RegExp(`\\[${key}\\]`, 'g'), value);
        }, template);
    }
}
