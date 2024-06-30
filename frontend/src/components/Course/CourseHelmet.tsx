import { Helmet } from 'react-helmet';

import tumRatingLogo from '@/assets/img/logo.png';
import { DetailCourse } from '@/courses/types.ts';

const CourseHelmet = ({ course }: { course: DetailCourse }) => {
    if (!course) return null;
    const courseReviews = course.reviews.map((review) => {
        return {
            '@type': 'Review',
            author: {
                '@type': 'Person',
                name: review.userName,
            },
            reviewRating: {
                '@type': 'Rating',
                ratingValue: `${review.howInterestingRating}`,
                bestRating: '5',
            },
            datePublished: review.createdAt,
            reviewBody: review.comment,
        };
    });
    const structuredData = {
        '@context': 'https://schema.org/',
        '@id': 'https://www.example.com/advancedCpp',
        '@type': 'Course',
        name: course.name,
        description: `${course.name} taught by ${course.professor}.`,
        publisher: {
            '@type': 'Organization',
            name: 'tum-rating',
            url: `www.tum-rating.de/courses/${course.courseId}`,
        },
        provider: {
            '@type': 'Organization',
            name: 'tum-rating',
            url: 'www.tum-rating.de',
        },
        image: [tumRatingLogo],
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: `${course.howInterestingRatingAverage}`,
            ratingCount: `${course.votesNumber}`,
            reviewCount: `${course.reviews.length}`,
        },
        offers: [
            {
                '@type': 'Offer',
                category: 'Free',
            },
        ],
        about: [course.name],
        inLanguage: 'en',
        review: courseReviews,
        hasCourseInstance: [
            {
                instructor: [
                    {
                        '@type': 'Person',
                        name: course.professor,
                        description: 'Professor at TUM university',
                    },
                ],
            },
        ],
    };

    const ogData = {
        title: course.name,
        description: `${course.name} taught by ${course.professor}.`,
        url: `https://www.tum-rating.de/courses/${course.courseId}`,
        image: tumRatingLogo,
        type: 'website',
        siteName: 'tum-rating',
    };

    return (
        <div>
            <Helmet>
                <title>{`${course.name} - ${course.professor} | TUM-Rating`}</title>
                <meta name="description" content={`Ratings and reviews for ${course.name} by ${course.professor} at TUM.`} />
                <meta property="twitter:card" content="summary" />
                <meta property="twitter:site" content="@tum-rating" />
                <meta property="twitter:creator" content="@tum-rating" />
                <meta property="twitter:image" content={ogData.image} />
                <meta property="twitter:image:alt" content={course.name} />
                <meta property="twitter:title" content={course.name} />
                <meta property="twitter:description" content={`${course.name} taught by ${course.professor}.`} />
                <meta name="description" content={ogData.description} />
                <meta property="og:title" content={ogData.title} />
                <meta property="og:description" content={ogData.description} />
                <meta property="og:url" content={ogData.url} />
                <meta property="og:image" content={ogData.image} />
                <meta property="og:type" content={ogData.type} />
                <meta property="og:site_name" content={ogData.siteName} />
                <meta property="og:locale" content="en" />
                <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
            </Helmet>
        </div>
    );
};

export { CourseHelmet };
