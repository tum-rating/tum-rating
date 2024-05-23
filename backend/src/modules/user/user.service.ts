import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { UserRepository } from 'src/database/repositories/user.repository';
import { User } from 'src/database/documents/user';
import { UserBanRepository } from 'src/database/repositories/userBan.repository';
import { NotFoundError } from 'src/utils/errors/errors';
import { UserBan } from 'src/database/documents/userBan';
import { DuplicateError } from 'src/utils/errors/errors';

import { CreateUserDto } from './dto/CreateUser.dto';

@Injectable()
export class UserService {
    constructor(
        private readonly _logger: PinoLogger,
        private readonly _userRepository: UserRepository,
        private readonly _userBanRepository: UserBanRepository,
    ) {
        this._logger.setContext(UserService.name);
    }

    public async createUser(user: CreateUserDto) {
        const userToCreate = {...user} as User;

        const emailUsernameSuffix = this.extractEmailUsernameDotSuffix(userToCreate.email);

        if (emailUsernameSuffix) {
            userToCreate.emailDotSuffix = emailUsernameSuffix;
        }

        return this._userRepository.create(userToCreate);
    }

    public async getUsers() {
        return this._userRepository.getAllAndOmit();
    }

    public async getUser(id: string) {
        const user = await this._userRepository.findOneById(id);

        if(!user)
            throw new NotFoundError(`User with id ${id} not found`);

        return user;
    }

    // tum email have 2 possible username formats:
    // 1. as12asd - some random id
    // 2. <user input>.<student surname> - user input can be whatever, .<student surname> is mandatory
    public extractEmailUsernameDotSuffix(email: string) {
        const emailUsername = email.split('@')[0];
        const dotSuffixSplit = emailUsername.split('.')

        if (dotSuffixSplit.length < 2) return null;

        return dotSuffixSplit[dotSuffixSplit.length - 1];
    }

    public async getUsersWithMatchingEmailSuffix(email: string) {
        const dotSuffix = this.extractEmailUsernameDotSuffix(email);

        if (!dotSuffix) return [];

        const restults = await this._userRepository.getByEmailUsernameDotSuffix(dotSuffix);

        return this._userRepository.getByEmailUsernameDotSuffix(dotSuffix);
    }

    public async getUserByEmail(email: string) {
        return this._userRepository.getByEmail(email);
    }

    public async updateUser(id: string, user: Partial<User>) {
        return this._userRepository.updateOneById(id, user);
    }

    public async deleteUser(id: string) {
        const deletedUser = await this._userRepository.deleteOneById(id);

        if(!deletedUser) throw new NotFoundError(`User with id ${id} not found`);

        return deletedUser;
    }

    public async activateEmail(id: string) {
        return this._userRepository.activateEmail(id);
    }

    public async updatePassword(id: string, newPasswordHash: string, newPasswordSalt: string) {
        return this._userRepository.updatePassword(id, newPasswordHash, newPasswordSalt);
    }

    public async toggleBan(userId: string, isBanned: boolean) {
        const user = await this._userRepository.findOneById(userId)

        if(!user) {
            throw new NotFoundError(`User with id ${userId} not found`);
        }

        if(isBanned) {
            try {
                await this._userBanRepository.create({ userId } as unknown as UserBan);
            } catch(error) {
                if (!(error instanceof DuplicateError && error.isConflictingKey('userId'))) {
                    throw error;
                }
            }
        } else {
            await this._userBanRepository.deleteByUserId(userId);
        }

        return this._userRepository.updateOneById(userId, { isBanned });
    }

    public async isBanned(id: string) {
        const bannedUser = await this._userBanRepository.findByUserId(id);

        return !!bannedUser;
    }
}
