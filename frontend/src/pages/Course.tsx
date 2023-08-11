import {Anchor, Badge, Container, Group, Stack, Text} from "@mantine/core";
import {OverallScore} from "../components/OverallScore";
import {UserScore} from "../components/UserScore";
import {Comment} from "../components/Comment";
import {AddReview} from "../components/AddReview";


const tempData = {
    "courseId": 950669976,
    "courseNumber": {
        "dotIndex": 0,
        "databaseValue": "0000002679",
        "courseNumber": "0000002679"
    },
    "courseTitleTranslations": {
        "de": "Hochfrequenzschaltungen",
        "en": "High-Frequency Circuits"
    },
    "mainLecturers": [
        {
            "name": "Josef Knapp",
            "businessCardLink": "https://campus.tum.de/tumonline/ee/rest/brm.pm.bc/identities/B062A57A7990848D"
        }
    ],
    "otherLecturers": [
        {
            "name": "Uwe Siart",
            "businessCardLink": "https://campus.tum.de/tumonline/ee/rest/brm.pm.bc/identities/816C665E43B04109"
        },
        {
            "name": "Josef Knapp",
            "businessCardLink": "https://campus.tum.de/tumonline/ee/rest/brm.pm.bc/identities/B062A57A7990848D"
        }
    ]
}

const courseInterestComments: CommentHtmlProps[] = [
    {
        postedAt: "2023-08-10",
        body: "I found this course very interesting and engaging.",
        author: {
            name: "Alice",
            image: "alice.jpg",
        },
    },
    {
        postedAt: "2023-08-11",
        body: "The course content was quite boring, to be honest.",
        author: {
            name: "Bob",
            image: "bob.jpg",
        },
    },
    {
        postedAt: "2023-08-12",
        body: "This course was moderately interesting, with some engaging parts.",
        author: {
            name: "Charlie",
            image: "charlie.jpg",
        },
    },
    {
        postedAt: "2023-08-13",
        body: "I found the course material very intriguing and worth the time.",
        author: {
            name: "David",
            image: "david.jpg",
        },
    },
];



export const Course = (data) => {
    data = tempData
    return (
        <Stack pt="xl" >
            <Stack justify="flex-end">
                <Text size={45}>{data.courseTitleTranslations.en}
                    <Badge>{data.courseNumber.databaseValue}</Badge></Text>
                <Text>
                    Main Professor:
                    {data.mainLecturers.map((professor) => {
                        return (
                            <Anchor href={professor.businessCardLink} target="_blank">{professor.name}</Anchor>
                        )
                    })}
                </Text>
                <Text>
                    Other Professors:
                    {data.otherLecturers.map((professor) => {
                        return (
                            <Anchor href={professor.businessCardLink} target="_blank">{professor.name}</Anchor>
                        )
                    })}
                </Text>
            </Stack>
            <AddReview/>
            <Stack w={"100%"} p={0}>
                <OverallScore score={2} numberOfReviews={12} howInteresting={3} howEasy={4}/>
                {courseInterestComments.map((comment)=>{
                    return (
                        <Comment {...comment}/>
                    )
            })}
                {/*<UserScore score={2} numberOfReviews={12} howInteresting={3} howEasy={4}/>*/}
            </Stack>
        </Stack>

    );
};