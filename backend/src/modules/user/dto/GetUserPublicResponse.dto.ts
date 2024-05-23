import { ApiProperty } from '@nestjs/swagger';

export class GetUserPublicResponseDto {
    constructor(id: string, email: string, username: string, isAdmin?: boolean) {
        this.id = id;
        this.email = email;
        this.username = username;
        
        if(isAdmin)
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
