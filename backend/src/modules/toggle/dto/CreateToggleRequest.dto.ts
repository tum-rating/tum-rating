import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class CreateToggleRequestDto {
    @ApiProperty()
    name: string

    @ApiProperty()
    description?: string;

    @ApiProperty()
    enabled: boolean;
}

export const CreateToggleRequestSchema = Joi.object<CreateToggleRequestDto>({
    name: Joi.string().required(),
    description: Joi.string(),
    enabled: Joi.boolean().required(),
});
