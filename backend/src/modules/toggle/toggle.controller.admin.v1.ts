import {Controller, Body, Headers, UseGuards, Get, Patch, Post, Delete, ConflictException, Param} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { AdminGuard } from 'src/common/guards/admin.guard';
import { JoiObjectSchemaPipe } from 'src/common/pipes/JoiObjectSchema.pipe';
import { USER_ID } from 'src/utils/headers/context.headers';

import { CreateToggleRequestDto, CreateToggleRequestSchema } from './dto/CreateToggleRequest.dto';
import { UpdateToggleRequestDto, UpdateToggleRequestSchema } from './dto/UpdateToggleRequest.dto';
import { GetToggleResponseDto } from './dto/GetToggleResponse.dto';
import { ToggleService } from './toggle.services';
import { DuplicateError } from 'src/utils/errors/errors';

@ApiTags('toggles')
@UseGuards(AdminGuard)
@Controller('/api/v1/toggles')
export class ToggleAdminControllerV1 {
    constructor(
        private readonly _toggleService: ToggleService,
        private readonly _logger: PinoLogger,
    ) {
        this._logger.setContext(ToggleAdminControllerV1.name);
    }

    @ApiBearerAuth()
    @Post()
    public async createToggle(
        @Headers(USER_ID) userId: string,
        @Body(new JoiObjectSchemaPipe(CreateToggleRequestSchema))
        body: CreateToggleRequestDto,
    ): Promise<GetToggleResponseDto> {
        this._logger.info(
            'Create toggle requested with name: %s from user: %s',
            body.name,
            userId,
        );

        try {
            const toggle = await this._toggleService.createToggle(body);

            this._logger.info('Successfully created toggle with name: %s', toggle.name);

            return new GetToggleResponseDto(toggle);
        } catch (error) {
            if (error instanceof DuplicateError) {
                if (error.isConflictingKey('name')) {
                    this._logger.info('Failed to create toggle with name: %s due to duplicate', body.name);
                    throw new ConflictException('Toggle with name already exists');
                }

                this._logger.warn('Failed to create toggle with body: %s, error: %s', body, error);
                throw new ConflictException('Toggle with name already exists');
            }

            this._logger.error('Failed to create toggle with body: %s, error: %s', body, error);
            throw error;
        }
    }

    @ApiBearerAuth()
    @Patch('/:id')
    public async updateToggle(
        @Headers(USER_ID) userId: string,
        @Param('id') id: string,
        @Body(new JoiObjectSchemaPipe(UpdateToggleRequestSchema))
        body: UpdateToggleRequestDto,
    ): Promise<GetToggleResponseDto> {
        console.log(1)
        console.log(id)
        this._logger.info(
            'Update toggle requested for id: %s from user: %s',
            id,
            userId,
        );

        const toggle = await this._toggleService.updateToggleById(id, body);

        this._logger.info('Successfully updated toggle with id: %s', toggle.id);

        return new GetToggleResponseDto(toggle);
    }

    @ApiBearerAuth()
    @Get('/:id')
    public async getToggle(
        @Headers(USER_ID) userId: string,
        @Param('id') id: string,
    ): Promise<GetToggleResponseDto> {
        this._logger.info(
            'Get toggle requested for id: %s from user: %s',
            id,
            userId,
        );

        const toggle = await this._toggleService.getToggleById(id);

        this._logger.info('Successfully retrieved toggle with id: %s', toggle.id);

        return new GetToggleResponseDto(toggle);
    }

    @ApiBearerAuth()
    @Delete('/:id')
    public async deleteToggle(
        @Headers(USER_ID) userId: string,
        @Param('id') id: string,
    ): Promise<void> {
        this._logger.info(
            'Delete toggle requested for id: %s from user: %s',
            id,
            userId,
        );

        await this._toggleService.deleteToggleById(id);

        this._logger.info('Successfully deleted toggle with id: %s', id);
    }
}
