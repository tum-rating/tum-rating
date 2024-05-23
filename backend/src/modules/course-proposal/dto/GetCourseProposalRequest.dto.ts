import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { CourseProposal } from 'src/database/documents/courseProposal';

export class GetCourseProposalResponseDto {
    constructor(courseProposal: WithId<CourseProposal>) {
        this.id = courseProposal.id;
        this.url = courseProposal.url;
        this.userId = courseProposal.userId;
        this.createdAt = courseProposal.createdAt;
    }

    @ApiProperty()
    id: string;

    @ApiProperty()
    url: string;

    @ApiProperty()
    userId: ObjectId;

    @ApiProperty()
    createdAt: Date;
}