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

interface MailerConfig {
    host: string;
    port: number;
    auth?: {
        user: string;
        pass: string;
    };
}

const emailTemplatesDir = '../../../assets/mail-templates';
const emailCssStyles = "email-template.css";
const emailActivationTemplateFile = 'activation.html';
const emailRecoveryTemplateFile = 'recovery.html';
const emailEmailAlreadyExistsTemplateFile = 'email-already-exists.html';
const telegramLink = 'https://t.me/+hYAM4t27bJgzNjdk';

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

        const mailerConfig: MailerConfig = {
            host: this._configService.get('mailer.host'),
            port: this._configService.get('mailer.port'),
        };

        if (this._configService.get('app.env') !== 'development') {
            mailerConfig.auth = {
                user: this._configService.get('mailer.user'),
                pass: this._configService.get('mailer.pass'),
            };
        }

        this._transporter = NodeMailer.createTransport(mailerConfig);

        this._sender = this._configService.getOrThrow('mailer.sender');
        this._templates = this._initTemplates();
    }

    public async send(to: MailRecipient, subject: string, html: string, text?: string) {
        this._logger.debug('Sending email to %o, subject %s', to, subject);

        await this._transporter.sendMail({
            from: this._sender,
            to: this._formatRecipient(to),
            subject,
            html: html,
            text,
        });

        this._logger.debug('Successfuly sent email to %o, subject %s', to, subject);
    }

    public async sendMany(to: MailRecipient[], subject: string, html: string, text?: string) {
        this._logger.debug('Sending email to %o, subject %s', to, subject);

        for (const recipient of to) {
            await this.send(recipient, subject, html, text);
        }

        this._logger.debug('Successfuly sent email to %o, subject %s', to, subject);
    }

    private _getCommonVariables() {
        const styles = fs.readFileSync(join(__dirname, emailTemplatesDir, emailCssStyles), 'utf8');
        return {
            BaseUrl: this._configService.getOrThrow('webapp.url'),
            CurrentYear: new Date().getFullYear().toString(),
            Styles: styles,
            LogoUrl: "https://tum-rating.de/0YXZHm9A.png",
            SupportMail: this._configService.getOrThrow('mailer.sender'),
            TelegramLink: telegramLink,
        };
    }

    public async sendEmailActivationEmail(to: MailRecipient, activationToken: string) {
        const activationLink = `${this._configService.getOrThrow('webapp.url')}/auth/activate?token=${activationToken}`;
        const username = to.name || 'User';
        const email = to.email || 'Email';

        const processedEmailTemplate = this._injectVariablesToTemplate(this._templates.activation, {
            ...this._getCommonVariables(),
            Username: username,
            Email: email,
            ActivationLink: activationLink,
        });

        return this.send(to, 'Activate your account', processedEmailTemplate);
    }

    public async sendPasswordRecoveryEmail(to: MailRecipient, recoveryToken: string) {
        const passwordResetLink = `${this._configService.getOrThrow('webapp.url')}/auth/recovery?token=${recoveryToken}`;
        const username = to.name || 'User';
        const email = to.email || 'Email';

        const processedEmailTemplate = this._injectVariablesToTemplate(this._templates.passwordRecovery, {
            ...this._getCommonVariables(),
            Username: username,
            PasswordResetLink: passwordResetLink,
            Email: email,
        });

        return this.send(to, 'Password recovery', processedEmailTemplate);
    }

    public async sendEmailMultiAccountsAlert(possibleDuplicates: (Pick<User, 'email'> & { id: string })[]) {
        const adminEmails = this._configService.getOrThrow<string[]>('mailer.adminEmails');
        const toFormatted = adminEmails.map((email) => ({ email }));

        const text = 'Possible duplicates:\n' + possibleDuplicates.map((duplicate) => `${duplicate.id}, ${duplicate.email}`).join(';');

        await this.sendMany(toFormatted, 'TUM-RATING ADMIN ALERT', null, text);
    }

    public async sendEmailAlreadyExists(to: MailRecipient, username: string) {
        const processedEmailTemplate = this._injectVariablesToTemplate(this._templates.emailAlreadyExists, {
            ...this._getCommonVariables(),
            Username: username,
            Email: to.email,
            RecoveryLink: `${this._configService.getOrThrow('webapp.url')}#modal=forgot-password`,
        });

        return this.send(to, 'Email is already registered', processedEmailTemplate);
    }

    private _formatRecipient(recipient: MailRecipient) {
        return `${recipient.name ? recipient.name.concat(' ') : ''}<${recipient.email}>`;
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
            emailAlreadyExists: emailAlreadyExistsEmailTemplate,
        };
    }

    private _injectVariablesToTemplate(template: string, variables: Record<string, string>): string {
        return Object.entries(variables).reduce((acc, [key, value]) => {
            return acc.replace(new RegExp(`\\[${key}\\]`, 'g'), value);
        }, template);
    }
}
