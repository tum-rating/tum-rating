import { Injectable } from '@nestjs/common';

import { CourseProposalRepository } from 'src/database/repositories/courseProposal.repository';
import { CourseProposal } from 'src/database/documents/courseProposal';
import { CourseRepository } from 'src/database/repositories/course.repository';
import { NotFoundError } from 'src/utils/errors/errors';

@Injectable()
export class CourseProposalService {
    constructor(
        private readonly _courseProposalRepository: CourseProposalRepository,
        private readonly _courseRepository: CourseRepository,
    ) {}

    public async getAllCourseProposals() {
        return this._courseProposalRepository.findAll();
    }

    public async getCourseProposalsById(id: string) {
        const courseProposal = await  this._courseProposalRepository.findOneById(id);

        if (!courseProposal) throw new NotFoundError(`Course proposal with id ${id} not found`);

        return courseProposal;
    }

    public getCourseTUMId(courseProposal: CourseProposal): string {
        const url = courseProposal.url;

        const urlSplit = url.match(/\/courses\/(\d+)/);

        if (urlSplit.length != 2) throw new Error('Invalid course proposal URL');

        return urlSplit[1];
    }

    public async createCourseProposal(courseProposal: Omit<CourseProposal, 'createdAt'>) {
        return this._courseProposalRepository.create(courseProposal);
    }

    public async updateCourseProposal(id: string, courseProposal: Partial<CourseProposal>) {
        return this._courseProposalRepository.updateOneById(id, courseProposal);
    }

    public async deleteCourseProposal(id: string) {
        return this._courseProposalRepository.deleteOneById(id);
    }
}
