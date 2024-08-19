import {Course} from "@/courses/types.ts";
import {splitSearchQueryIntoWords} from "@/utils/splitSearchQueryIntoWords.ts";

const sortCoursesByMatchingFactor = (data: Course[], value: string) => {
    const dataLength = data.length;
    const dataWithMatchingFactor = [];
    const words = splitSearchQueryIntoWords(value.toLowerCase());
    const exactMatchBonus = 10000;

    for (let i = 0; i < dataLength; i++) {
        const item = data[i];
        const name = item.name.toLowerCase();
        const professor = item.professor.toLowerCase();
        let matchingFactor = 0;
        let isExactMatch = false;

        if (name.includes(value.toLowerCase()) || professor.includes(value.toLowerCase())) {
            matchingFactor += exactMatchBonus;
            isExactMatch = true;
        }

        words.forEach((word) => {
            const nameIndex = name.indexOf(word);
            const professorIndex = professor.indexOf(word);

            if (nameIndex !== -1) {
                matchingFactor += 100 - (nameIndex * 100) / name.length;
            }

            if (professorIndex !== -1) {
                matchingFactor += 100 - (professorIndex * 100) / professor.length;
            }
        });

        dataWithMatchingFactor.push({
            ...item,
            matchingFactor,
            isExactMatch,
        });
    }

    return dataWithMatchingFactor.sort((a, b) => {
        if (a.isExactMatch && !b.isExactMatch) return -1;
        if (!a.isExactMatch && b.isExactMatch) return 1;
        return b.matchingFactor - a.matchingFactor;
    });
};

export {sortCoursesByMatchingFactor}