import { ApiProperty } from '@nestjs/swagger';

import { GetUserPublicResponseDto } from 'src/modules/user/dto/GetUserPublicResponse.dto';

export class SignInResponseDto {
    @ApiProperty()
    user: GetUserPublicResponseDto;

    @ApiProperty()
    token: string;
}
