import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { UserRepository } from 'src/database/repositories/user.repository';
import { User } from 'src/database/documents/user';

@Injectable()
export class UserService {
    constructor (
        private readonly _logger: PinoLogger,
        private readonly _userRepository: UserRepository,
    ) {
        this._logger.setContext(UserService.name);
    }

    public async createUser(user: User) {

        return this._userRepository.create(user);
    }

    public async getUser(id: string) {
        const user = await this._userRepository.findOneById(id);
        // if(!user)
        //     throw {code: GenericErrorCodes.not_found};

        return user;
    }

    public async getUserByEmail(email: string) {
        return this._userRepository.getByEmail(email);
    }

    public async updateUser(id: string, user: Partial<User>) {
        return this._userRepository.updateOneById(id, user);
    }

    public async deleteUser(id: string) {
        return this._userRepository.deleteOneById(id);
    }
}