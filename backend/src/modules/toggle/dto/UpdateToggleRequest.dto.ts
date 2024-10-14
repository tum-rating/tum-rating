import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateToggleRequestDto {
    @ApiProperty()
    name: string

    @ApiProperty()
    description?: string;

    @ApiProperty()
    enabled: boolean;
}

export const UpdateToggleRequestSchema = Joi.object<UpdateToggleRequestDto>({
    name: Joi.string().required(),
    description: Joi.string(),
    enabled: Joi.boolean().required(),
});
