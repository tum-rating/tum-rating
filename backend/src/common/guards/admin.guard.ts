import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { JWTService } from 'src/utils/jwt/jwt.service';
import { USER_ID, USER_ROLE } from 'src/utils/headers/context.headers';
import { UserRole } from 'src/utils/jwt/jwt.interfaces';
import { UserService } from 'src/modules/user/user.service';

import { validateBannedUsersGuardStep } from './utils/validateBannedUsers.guard.step';
import { validateJWTGuardStep } from './utils/validateJWT.guard.step';

@Injectable()
export class AdminGuard {
    constructor(
        protected readonly _jwtService: JWTService,
        protected readonly _userService: UserService,
        protected readonly _logger: PinoLogger,
    ) {
        this._logger.setContext(AdminGuard.name);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        await validateJWTGuardStep(context, this._jwtService);

        await validateBannedUsersGuardStep(context, this._userService, this._logger);

        const request = context.switchToHttp().getRequest();

        const userId = request.headers[USER_ID];
        const userRole = request.headers[USER_ROLE];

        if (userRole !== UserRole.admin) {
            this._logger.warn('Non-admin user tried to access service %s', userId);
            throw new ForbiddenException();
        }

        return true;
    }
}
