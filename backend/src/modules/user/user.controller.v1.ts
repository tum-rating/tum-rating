import { Controller, Get, Patch, Delete, NotImplementedException} from '@nestjs/common';

import { UserService } from './user.service';

@Controller('api/v1/user')
export class UserControllerV1 {
    constructor (
        private readonly _userService: UserService,
    ) {
    }

    @Get('/me')
    public async getMe() { 
        throw new NotImplementedException();
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
    public async deleteUser()
    {
        throw new NotImplementedException();
    }
}