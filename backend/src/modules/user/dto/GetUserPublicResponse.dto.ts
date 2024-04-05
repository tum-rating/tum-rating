import { ApiProperty } from '@nestjs/swagger';

export class GetUserPublicResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    username: string;
}
