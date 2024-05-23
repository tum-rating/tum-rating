import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { USER_ID } from 'src/utils/headers/context.headers';
import { UserService } from 'src/modules/user/user.service';

export const validateBannedUsersGuardStep = async (
    context: ExecutionContext,
    userService: UserService,
    logger: PinoLogger,
) => {
    const request = context.switchToHttp().getRequest();

    const userId = request.headers[USER_ID];

    const isBanned = await userService.isBanned(userId);

    if (isBanned) {
        logger.warn('Banned user tried to access service: %s', userId);
        throw new ForbiddenException();
    }
};