import { Module, Logger } from '@nestjs/common';
import { MailerService } from './mailer.service';

@Module({
    imports: [],
    providers: [MailerService, Logger],
    exports: [MailerService],
})
export class MailerModule {}
