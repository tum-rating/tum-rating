import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(private readonly _logger: PinoLogger) {
        _logger.setContext('metrics');
    }

    use(req: Request, res: Response, next: NextFunction) {
        if (!req.headers['x-trace-id']) req.headers['x-trace-id'] = randomUUID();

        const start = Date.now();

        res.on('close', () => {
            if (req.url === '/health') return;

            this._logger.info(
                {duration: Date.now() - start, status: res.statusCode, method: req.method, url: req.url},
                'Request duration'
            );
        });

        next();
    }
}
