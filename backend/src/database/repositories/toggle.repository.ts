import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import * as mongoose from 'mongoose';

import { Toggle } from 'src/database/documents/toggle';

import { BaseRepository } from './base.repository';


export class ToggleRepository extends BaseRepository<Toggle> {
    constructor(
        @InjectModel(Toggle.name)
        private readonly _toggleModel: Model<Toggle>,
    ) {
        super(_toggleModel);
    }
}