import {Helmet} from 'react-helmet';

import tumRatingLogo from '@/assets/img/logo.png';
import {Course} from '@/courses/types.ts';

const CoursesTableHelmet = ({courses}: {courses: Course[]}) => {
    if (!courses || !courses.length) return null;

    const structuredData = {
        '@context': 'https://schema.org/',
        '@type': 'ItemList',
        itemListElement: courses
            .filter((x) => x !== null)
            .map((course, index) => {
                return {
                    '@type': 'ListItem',
                    position: index + 1,
                    item: {
                        '@id': `https://www.tum-rating.de/courses/${course.courseId}`,
                        name: course.name,
                        description: `${course.name} taught by ${course.professor}.`,
                        image: [tumRatingLogo],
                        url: `https://www.tum-rating.d/courses/${course.courseId}`,
                    },
                };
            }),
    };
    return (
        <div>
            <Helmet>
                <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
            </Helmet>
        </div>
    );
};

export {CoursesTableHelmet};
