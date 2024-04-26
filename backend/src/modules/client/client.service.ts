import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { Course } from 'src/database/documents/course';

import { GetTUMCourse } from './dto/GetTUMCourseResponse.dto';
import { ClientParseCourseError } from './errors/errors';

@Injectable()
export class ClientService {
    constructor(
        private readonly _httpService: HttpService,
    ) {}

    public async getTUMCourse(tumCourseId: string): Promise<GetTUMCourse> {
        try {
            const response = await this._httpService.axiosRef.get('https://campus.tum.de/tumonline/ee/rest/slc.tm.cp/student/courses/' + tumCourseId);

            console.log(response.data)

            const course = this.parseTUMResponse(response.data);

            return new GetTUMCourse(200, course, null);
        }
        catch (error) {
            console.log(error);
            if (error instanceof AxiosError) {
                return new GetTUMCourse(error.status, null, error);
            }

            throw error;
        }
    }

    private parseTUMResponse(responseData: any): Partial<Course> {
        const resources = responseData?.resource;

        if (!resources) {
            throw new ClientParseCourseError('No resources found in response');
        }

        if (!Array.isArray(resources)) {
            throw new ClientParseCourseError('Resource is not an array');
        }

        if (resources.length < 1) {
            throw new ClientParseCourseError('Resource array is empty');
        }

        const course = resources[0];

        const courseId = course.content?.cpCourseDetailDto?.cpCourseDto?.id;
        const courseTitleTranslations = course.content?.cpCourseDetailDto?.cpCourseDto?.courseTitle?.translations?.translation?.reduce(
            (acc, translation) => {
                acc[translation.lang] = translation.value;
                return acc;
            }, {}
        );

        const courseNumber = course.content?.cpCourseDetailDto?.cpCourseDto?.courseNumber?.databaseValue;
        const semester = course.content?.cpCourseDetailDto?.cpCourseDto?.semesterDto?.shortName?.value;
        let mainLecturer: string;
        const otherLecturers = [];
    
        course.content?.cpCourseDetailDto?.cpCourseDto?.lectureships?.forEach((lecturer, index) => {
            const firstName = lecturer.identityLibDto?.firstName;
            const lastName = lecturer.identityLibDto?.lastName;
            const lecturerName = `${firstName} ${lastName}`;
            const lecturerInfo = {
                name: lecturerName,
                businessCardLink: lecturer.identityLibDto.businessCardLink
                    ? lecturer.identityLibDto.businessCardLink.href
                    : null,
            };
            if (index === 0) {
                mainLecturer = lecturerInfo.name;
            } else {
                otherLecturers.push(lecturerInfo);
            }
        });

        return {
            courseId: String(courseId),
            courseNumber: String(courseNumber), 
            name: courseTitleTranslations.en || courseTitleTranslations.de,
            professor: mainLecturer,
            otherLecturers: otherLecturers.length ? otherLecturers.map(x => x.name) : [],
            offeredInSemesters: [semester],
        };
    }
}
