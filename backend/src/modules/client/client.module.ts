import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';


import { ClientService } from './client.service';

@Module({
    imports: [HttpModule],
    providers: [ClientService],
    exports: [ClientService],
})
export class ClientModule {}
