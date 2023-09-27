import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { PinoLogger } from 'nestjs-pino';


@Controller('health')
export class HealthController {  
constructor (
    private readonly _logger: PinoLogger,
    private readonly _health: HealthCheckService,
) {
    this._logger.setContext(HealthController.name);
}

    @Get()
    @HealthCheck()
    public async health() {
       return this._health.check([]);
    }
}