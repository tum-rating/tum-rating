import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

import { USER_ID, USER_ROLE } from 'src/utils/headers/context.headers';
import { UserService } from 'src/modules/user/user.service';
import { UserRole } from 'src/utils/jwt/jwt.interfaces';

export const validateBannedUsersGuardStep = async (
    context: ExecutionContext,
    userService: UserService,
    logger: Logger,
) => {
    const request = context.switchToHttp().getRequest();

    const userId = request.headers[USER_ID];

    const isBanned = await userService.isBanned(userId);

    if (isBanned) {
        logger.warn('Banned user tried to access service: %s', userId);
        throw new UnauthorizedException();
    }
};