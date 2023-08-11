// import { 
//     Controller,
//     Delete,
//     Get,
//     Headers,
//     Logger,
//     Patch, 
//     NotImplementedException,
//     UseGuards
// } from '@nestjs/common';

// import { UnauthorizedException } from '@nestjs/common';

// import { USER_ID } from 'src/utils/headers/context.headers';
// import { AuthGuard } from 'src/common/guards/auth.guard';

// import { UserService } from './user.service';

// @Controller('api/v1/user')
// export class UserControllerV1 {
//     constructor (
//         private readonly _userService: UserService,
//         private readonly _logger: Logger,
//     ) {
//         this._logger = new Logger(UserControllerV1.name);
//     }

//     @Get('/me')
//     @UseGuards(AuthGuard)
//     public async getMe(
//         @Headers(USER_ID) userId: string,
//     ) {
//         this._logger.log('Get me request received from user %s', userId);

//         const user = await this._userService.getUser(userId);

//         if(!user) {
//             this._logger.error('Get me request failed, not found user %s', userId);
//             throw new UnauthorizedException();
//         }

//         this._logger.log('Get me request completed from user %s', userId);

//         return {
//             id: user.id,
//             email: user.email,
//             username: user.username
//         };
//     }

//     @Patch('/me')
//     public async patchMe() {
//         throw new NotImplementedException();
//     }

//     @Get()
//     public async getUsers() {
//         throw new NotImplementedException();
//     }

//     @Get(':id')
//     public async getUser() {
//         throw new NotImplementedException();
//     }

//     @Delete(':id')
//     public async deleteUser()
//     {
//         throw new NotImplementedException();
//     }
// }