import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/database/documents/user';
import { User } from 'src/database/documents/user';

export class GetUserAdminResponseDto {
    constructor(user: WithId<User>) {
        this.id = user.id;
        this.email = user.email;
        this.username = user.username;
        this.isEmailActivated = user.isEmailActivated;
        this.isBanned = user.isBanned;
        this.role = user.role;
    }

    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    isEmailActivated: boolean;

    @ApiProperty()
    isBanned: boolean;

    @ApiProperty()
    role: UserRole;
}
