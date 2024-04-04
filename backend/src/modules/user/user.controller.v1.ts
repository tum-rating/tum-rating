import { Controller, Delete, Get, Headers, HttpCode, Patch, Post, NotFoundException, NotImplementedException, UnauthorizedException, UseGuards, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { USER_ID } from 'src/utils/headers/context.headers';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { JoiObjectSchemaPipe } from 'src/common/pipes/JoiObjectSchema.pipe';
import { MongoIdPipe } from 'src/common/pipes/MongoId.pipe';
import { NotFoundError, DuplicateError } from 'src/utils/errors/errors';

import { UserService } from './user.service';
import { UserResponseDto } from './dto/UserResponse.dto';

@ApiTags('users')
@Controller('api/v1/users')
export class UserControllerV1 {
    constructor(
        private readonly _userService: UserService,
        private readonly _logger: PinoLogger,
    ) {
        this._logger.setContext(UserControllerV1.name);
    }

    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        type: UserResponseDto,
    })
    @ApiParam({
        name: 'user-id',
        required: false,
        description: '(Leave empty. It will be extracted from JWT token)',
    })
    @UseGuards(AuthGuard)
    @Get('/me')
    public async getMe(@Headers(USER_ID) userId: string): Promise<UserResponseDto> {
        this._logger.info('Get me request received from user %s', userId);

        const user = await this._userService.getUser(userId);

        if (!user) {
            this._logger.error('Get me request failed, not found user %s', userId);
            throw new UnauthorizedException();
        }

        this._logger.info('Get me request completed from user %s', userId);

        return {
            id: user.id,
            email: user.email,
            username: user.username,
        };
    }

    @Patch('/me')
    public async patchMe() {
        throw new NotImplementedException();
    }

    @Get()
    public async getUsers() {
        
    }

    @Get(':id')
    public async getUser() {
        throw new NotImplementedException();
    }

    @Delete(':id')
    public async deleteUser() {
        throw new NotImplementedException();
    }

    @ApiBearerAuth('admin')
    @ApiResponse({
        status: 204,
    })
    @UseGuards(AdminGuard)
    @HttpCode(204)
    @Post(':id/ban')
    public async banUser(
        @Param('id', new JoiObjectSchemaPipe(MongoIdPipe)) userId: string,
        @Headers(USER_ID) adminId: string
    ) {
        this._logger.info('Ban user request received for user %s', userId);

        if (userId === adminId) {
            this._logger.error('Ban user request failed, user %s tried to ban himself', userId);
            throw new UnauthorizedException();
        }

        try {
            await this._userService.toggleBan(userId, true);

            this._logger.info('Ban user request completed for user %s', userId);
        } catch (error) {
            if(error instanceof NotFoundError) {
                throw new NotFoundException(error.message);
            }

            this._logger.error('Ban user request failed for user %s', userId);
            throw error;
        }
    }

    @ApiBearerAuth('admin')
    @ApiResponse({
        status: 204,
    })
    @UseGuards(AdminGuard)
    @HttpCode(204)
    @Delete(':id/ban')
    public async unbanUser(
        @Param('id', new JoiObjectSchemaPipe(MongoIdPipe)) userId: string,
        @Headers(USER_ID) adminId: string
    ) {
        this._logger.info('Unban user request received for user %s', userId);

        if (userId === adminId) {
            this._logger.error('Unban user request failed, user %s tried to unban himself', userId);
            throw new UnauthorizedException();
        }

        try {
            await this._userService.toggleBan(userId, false);
            
            this._logger.info('Unban user request completed for user %s', userId);
        } catch (error) {
            if(error instanceof NotFoundError) {
                throw new NotFoundException(error.message);
            }

            this._logger.error('Unban user request failed for user %s', userId);
            throw error;
        }
    }
}
