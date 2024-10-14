import { Controller, UseGuards, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { AdminGuard } from 'src/common/guards/admin.guard';

import { GetToggleResponseDto } from './dto/GetToggleResponse.dto';
import { ToggleService } from './toggle.services';

@ApiTags('toggles')
@UseGuards(AdminGuard)
@Controller('/api/v1/toggles')
export class ToggleControllerV1 {
    constructor(
        private readonly _toggleService: ToggleService,
        private readonly _logger: PinoLogger,
    ) {
        this._logger.setContext(ToggleControllerV1.name);
    }

    @ApiBearerAuth()
    @Get()
    public async getToggles(): Promise<GetToggleResponseDto[]> {
        this._logger.info('Get toggles requested');

        const toggles = await this._toggleService.getToggles();

        this._logger.info('Successfully retrieved %d toggles', toggles.length);

        return toggles.map((toggle) => new GetToggleResponseDto(toggle));
    }
}
