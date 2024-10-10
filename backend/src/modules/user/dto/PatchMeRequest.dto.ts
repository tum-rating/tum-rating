import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class PatchMeRequestDto {
    @ApiProperty()
    username: string;
}

export const PatchMeRequestSchema = Joi.object<PatchMeRequestDto>({
    username: Joi.string().required(),
});
