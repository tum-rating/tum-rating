import { ApiProperty } from '@nestjs/swagger';

import { GetUserPublicResponseDto } from 'src/modules/user/dto/GetUserPublicResponse.dto';

export class SignInResponseDto {
    constructor(user: GetUserPublicResponseDto, token: string) {
        this.user = user;
        this.token = token;
    }

    @ApiProperty()
    user: GetUserPublicResponseDto;

    @ApiProperty()
    token: string;
}
