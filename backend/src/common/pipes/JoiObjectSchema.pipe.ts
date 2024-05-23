import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ObjectSchema, Schema } from 'joi';

@Injectable()
export class JoiObjectSchemaPipe implements PipeTransform {
    constructor(private schema: ObjectSchema | Schema) {}

    transform(value: any, metadata: ArgumentMetadata) {
        const { value: parsedValue, error } = this.schema.validate(value);
        if (error) {
            throw new BadRequestException({
                error: 'Bad request',
                message: error.message,
            });
        }
        return parsedValue;
    }
}
