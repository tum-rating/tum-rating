import {
  Controller,
  Delete,
  Get,
  Headers,
  Logger,
  Patch,
  NotImplementedException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { USER_ID } from 'src/utils/headers/context.headers';
import { AuthGuard } from 'src/common/guards/auth.guard';

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
  @ApiBearerAuth()
  @ApiParam({
    name: 'user-id',
    required: false,
    description:
        '(Leave empty. It will be extracted from JWT token)',
  })
  @UseGuards(AuthGuard)
  @Get('/me')
  public async getMe(
    @Headers(USER_ID) userId: string,
  ): Promise<UserResponseDto> {
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
    throw new NotImplementedException();
  }

  @Get(':id')
  public async getUser() {
    throw new NotImplementedException();
  }

  @Delete(':id')
  public async deleteUser() {
    throw new NotImplementedException();
  }
}
