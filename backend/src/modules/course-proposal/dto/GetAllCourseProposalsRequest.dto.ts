import { GetCourseProposalResponseDto } from './GetCourseProposalRequest.dto';

import { ApiProperty } from '@nestjs/swagger';
import { CourseProposal } from 'src/database/documents/courseProposal';

export class GetAllCourseProposalsResponseDto {
    constructor(courseProposals: WithId<CourseProposal>[]) {
        this.courseProposals = courseProposals.map(courseProposal => new GetCourseProposalResponseDto(courseProposal));
    }

    @ApiProperty()
    courseProposals: GetCourseProposalResponseDto[];
}