import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from 'src/database/documents/user';

export class GetUserPublicResponseDto {
    constructor(id: string, email: string, username: string, role: UserRole) {
        this.id = id;
        this.email = email;
        this.username = username;
        
        if(role === UserRole.admin)
            this.isAdmin = true;
    }

    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    isAdmin?: boolean;
}
