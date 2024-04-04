import { ExecutionContext, Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

import { JWTService } from 'src/utils/jwt/jwt.service';
import { UserService } from 'src/modules/user/user.service';

import { validateBannedUsersGuardStep } from './utils/validateBannedUsers.guard.step';
import { validateJWTGuardStep } from './utils/validateJWT.guard.step';

@Injectable()
export class AuthGuard {
    constructor(
        protected readonly _jwtService: JWTService,
        protected readonly _userService: UserService,
        protected readonly _logger: Logger,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        await validateJWTGuardStep(context, this._jwtService);

        await validateBannedUsersGuardStep(context, this._userService, this._logger);

        return true;
    }
}
