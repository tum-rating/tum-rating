import { ApiProperty } from '@nestjs/swagger';

import { Toggle } from 'src/database/documents/toggle';

export class GetToggleResponseDto {
    constructor(toggle: WithId<Toggle>) {
        this.id = toggle.id;
        this.name = toggle.name;
        this.description = toggle.description;
        this.enabled = toggle.enabled;
    }

    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description?: string;

    @ApiProperty()
    enabled: boolean;
}

export class GetTogglesResponseDto {
    constructor(toggles: WithId<Toggle>[]) {
        this.toggles = toggles.map(toggle => new GetToggleResponseDto(toggle));
    }

    @ApiProperty({ type: [GetToggleResponseDto] })
    toggles: GetToggleResponseDto[];
}