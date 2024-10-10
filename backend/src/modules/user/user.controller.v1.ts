import { Body, Controller, ConflictException, Delete, Get, Headers, HttpCode, Patch, Post, NotFoundException, NotImplementedException, UnauthorizedException, UseGuards, Param, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiParam, ApiHeader } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { USER_ID } from 'src/utils/headers/context.headers';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { JoiObjectSchemaPipe } from 'src/common/pipes/JoiObjectSchema.pipe';
import { MongoIdPipe } from 'src/common/pipes/MongoId.pipe';
import { NotFoundError, DuplicateError } from 'src/utils/errors/errors';
import { User, UserRole } from 'src/database/documents/user';

import { UserService } from './user.service';
import { GetUserPublicResponseDto } from './dto/GetUserPublicResponse.dto';
import { GetUserAdminResponseDto } from './dto/GetUserAdminResponse.dto';
import { GetUsersAdminResponseDto } from './dto/GetUsersAdminResponse.dto';
import { PatchMeRequestDto, PatchMeRequestSchema } from './dto/PatchMeRequest.dto';

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
        type: GetUserPublicResponseDto,
    })
    @ApiParam({
        name: 'user-id',
        required: false,
        description: '(Leave empty. It will be extracted from JWT token)',
    })
    @UseGuards(AuthGuard)
    @Get('/me')
    public async getMe(@Headers(USER_ID) userId: string): Promise<GetUserPublicResponseDto> {
        this._logger.info('Get me request received from user %s', userId);
        let user: WithId<User>;

        try {
            user = await this._userService.getUser(userId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundException(error.message);
            }

            this._logger.error('Get me request failed for user %s', userId);
            throw error;
        }

        this._logger.info('Get me request completed from user %s', userId);

        return new GetUserPublicResponseDto(
            user.id,
            user.email,
            user.username,
            user.role
        );
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Patch('/me')
    public async patchMe(
        @Headers(USER_ID) userId: string,
        @Body(new JoiObjectSchemaPipe(PatchMeRequestSchema)) body: PatchMeRequestDto,
    ) {
        this._logger.info('Patch me request received from user %s', userId);

        try {
            await this._userService.updateUsername(userId, body.username);

            this._logger.info('Patch me request completed from user %s', userId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundException(error.message);
            }

            if (error instanceof DuplicateError) {
                if (error.isConflictingKey('username')) {
                    throw new ConflictException('Username already exists');
                }

                throw new ConflictException(error.message);
            }

            this._logger.error('Patch me request failed for user %s', userId);
            throw error;
        }
    }

    @ApiBearerAuth('admin')
    @ApiParam({
        name: 'user-id',
        required: false,
        description: '(Leave empty. It will be extracted from JWT token)',
    })
    @ApiResponse({
        status: 200,
        type: GetUserPublicResponseDto,
    })
    @UseGuards(AuthGuard)
    @Delete('/me')
    public async deleteUserMe(
        @Headers(USER_ID) userId: string
    ): Promise<GetUserPublicResponseDto> {
        this._logger.info('Delete user request me received for user %s', userId);

        try {
            const deletedUser = await this._userService.deleteUser(userId);

            this._logger.info('Delete user request me completed for user %s', userId);
            return new GetUserPublicResponseDto(
                deletedUser.id,
                deletedUser.email,
                deletedUser.username,
                deletedUser.role
            );
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundException(error.message);
            }

            this._logger.error('Delete user request me failed for user %s', userId);
            throw error;
        }
    }

    @ApiBearerAuth('admin')
    @ApiResponse({
        status: 200,
        type: GetUsersAdminResponseDto,
    })
    @UseGuards(AdminGuard)
    @Get()
    public async getUsers(): Promise<GetUsersAdminResponseDto> {
        this._logger.info('Get users request received');

        const users = await this._userService.getUsers();

        this._logger.info('Get users request completed');

        return {
            users
        };
    }

    @ApiBearerAuth('admin')
    @ApiResponse({
        status: 200,
        type: GetUserAdminResponseDto,
    })
    @UseGuards(AdminGuard)
    @Get(':id')
    public async getUser(
        @Param('id', new JoiObjectSchemaPipe(MongoIdPipe)) userId: string,
    ): Promise<GetUserAdminResponseDto> {
        this._logger.info('Get user request received for user %s', userId);

        let user: WithId<User>;

        try {
            user = await this._userService.getUser(userId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundException(error.message);
            }

            this._logger.error('Get me request failed for user %s', userId);
            throw error;
        } 

        this._logger.info('Get user request completed for user %s', userId);

        return new GetUserAdminResponseDto(user);
    }

    @ApiBearerAuth('admin')
    @ApiResponse({
        status: 200,
        type: GetUserAdminResponseDto,
    })
    @UseGuards(AdminGuard)
    @Delete(':id')
    public async deleteUser(
        @Param('id', new JoiObjectSchemaPipe(MongoIdPipe)) userId: string,
        @Headers(USER_ID) adminId: string
    ): Promise<GetUserAdminResponseDto> {
        this._logger.info('Delete user request received for user %s, by admin %s', userId, adminId);

        try {
            const deletedUser = await this._userService.deleteUser(userId);

            this._logger.info('Delete user request completed for user %s, by admin %s', userId, adminId);
            return new GetUserAdminResponseDto(deletedUser);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundException(error.message);
            }

            this._logger.error('Delete user request failed for user %s, by admin %s', userId, adminId);
            throw error;
        }
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
