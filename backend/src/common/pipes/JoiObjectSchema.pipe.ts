import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiObjectSchemaPipe implements PipeTransform {
    constructor(private schema: ObjectSchema) {}

    transform(value: any, metadata: ArgumentMetadata) {
        const { value: parsedValue, error } = this.schema.validate(value);
        if (error) {
            console.log(value, error)
            throw new BadRequestException({
                error: 'Bad request',
                message: error.message
            });
        }
        return parsedValue;
    }
}
