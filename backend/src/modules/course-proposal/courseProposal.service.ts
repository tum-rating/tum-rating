import { Injectable } from '@nestjs/common';

import { CourseProposalRepository } from 'src/database/repositories/courseProposal.repository';
import { CourseProposal } from 'src/database/documents/courseProposal';
import { CourseRepository } from 'src/database/repositories/course.repository';

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
        return this._courseProposalRepository.findOneById(id);
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
