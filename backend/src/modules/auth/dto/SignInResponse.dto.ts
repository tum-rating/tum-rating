import { ApiProperty } from '@nestjs/swagger';

import { UserResponseDto } from 'src/modules/user/dto/UserResponse.dto';

export class SignInResponseDto {
  @ApiProperty()
  user: UserResponseDto;

  @ApiProperty()
  token: string;
}
