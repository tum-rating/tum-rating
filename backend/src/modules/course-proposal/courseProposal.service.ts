import { Injectable } from '@nestjs/common';

import { CourseProposalRepository } from 'src/database/repositories/courseProposal.repository';
import { CourseProposal } from 'src/database/documents/courseProposal';
import { CourseRepository } from 'src/database/repositories/course.repository';
import { Course } from 'src/database/documents/course';
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
        return this._courseProposalRepository.findOneById(id);
    }

    public async createCourseProposal(courseProposal: CourseProposal) {
        return this._courseProposalRepository.create(courseProposal as CourseProposal);
    }

    public async updateCourseProposal(id: string, courseProposal: Partial<CourseProposal>) {
        return this._courseProposalRepository.updateOneById(id, courseProposal);
    }

    public async acceptCourseProposalAddingItToCourses(id: string) {
        const courseProposal = await this.getCourseProposalsById(id);

        if (courseProposal === null) throw new NotFoundError('course proposal not found');

        const courseToCreate = {
            name: courseProposal.name,
            courseId: courseProposal.courseId,
            courseNumber: courseProposal.courseNumber,
            professor: courseProposal.professor,
            otherLecturers: courseProposal.otherLecturers,
            offeredInSemesters: courseProposal.offeredInSemesters,
        } as Course;

        return this._courseRepository.create(courseToCreate);
    }

    public async deleteCourseProposal(id: string) {
        return this._courseProposalRepository.deleteOneById(id);
    }
}
