import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { ToggleRepository } from 'src/database/repositories/toggle.repository';
import { NotFoundError } from 'src/utils/errors/errors';

import { CreateToggleRequestDto } from './dto/CreateToggleRequest.dto';
import { UpdateToggleRequestDto } from './dto/UpdateToggleRequest.dto';

@Injectable()
export class ToggleService {
    constructor(
        private readonly _toggleRepository: ToggleRepository,
        private readonly _logger: PinoLogger,
    ) {}

    public async getToggles() {
        return this._toggleRepository.findAll();
    }

    public async getToggleById(id: string) {
        const toggle = await this._toggleRepository.findOneById(id);

        if (!toggle) {
            throw new NotFoundError(`Toggle with id ${id} not found`);
        }

        return toggle;
    }

    public async createToggle(toggle: CreateToggleRequestDto) {
        return this._toggleRepository.create(toggle);
    }

    public async updateToggleById(id: string, toggle: UpdateToggleRequestDto) {
        const updatedToggle = await this._toggleRepository.updateOneById(id, toggle);

        if (!updatedToggle) {
            throw new NotFoundError(`Toggle with id ${id} not found`);
        }

        return updatedToggle;
    }

    public async deleteToggleById(id: string) {
        const toggle = await this._toggleRepository.deleteOneById(id);

        if (!toggle) {
            throw new NotFoundError(`Toggle with id ${id} not found`);
        }

        return toggle;
    }
}
