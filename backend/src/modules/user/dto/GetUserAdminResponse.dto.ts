import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/database/documents/user';

export class GetUserAdminResponseDto {
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
