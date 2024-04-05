import { ApiProperty } from '@nestjs/swagger';

import { GetUserAdminResponseDto } from './GetUserAdminResponse.dto';

export class GetUsersAdminResponseDto {
    @ApiProperty()
    users: GetUserAdminResponseDto[];
}