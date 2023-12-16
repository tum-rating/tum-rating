import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { JWTService } from 'src/utils/jwt/jwt.service';
import { USER_ID } from 'src/utils/headers/context.headers';
import { UserRole } from 'src/utils/jwt/jwt.interfaces';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private readonly _jwtService: JWTService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const authHeader: string = request.headers.authorization;

        if (!authHeader) throw new UnauthorizedException();

        const token = authHeader.split('Bearer ')[1];

        const { isValid, payload } =
            await this._jwtService.verifyJWTAccess(token);

        if (!isValid) throw new UnauthorizedException();

        if (payload.userRole !== UserRole.admin) throw new ForbiddenException();

        request.headers[USER_ID] = payload.sub;

        return true;
    }
}
