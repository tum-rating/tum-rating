import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JWTService } from 'src/utils/jwt/jwt.service';
import { USER_ID, USER_ROLE } from 'src/utils/headers/context.headers';
import { UserRole } from 'src/utils/jwt/jwt.interfaces';

export const validateJWTGuardStep = async (context: ExecutionContext, jwtService: JWTService) => {
    const request = context.switchToHttp().getRequest();

    const authHeader: string = request.headers?.authorization;

    if (!authHeader) throw new UnauthorizedException();

    const authHeaderSplit = authHeader.split('Bearer ');

    if (authHeaderSplit.length !== 2) throw new UnauthorizedException();

    const token = authHeaderSplit[1];

    const { isValid, payload } = await jwtService.verifyJWTAccess(token);

    if (!isValid) throw new UnauthorizedException();

    request.headers[USER_ID] = payload.sub;
    request.headers[USER_ROLE] = payload.userRole ?? UserRole.user;
};