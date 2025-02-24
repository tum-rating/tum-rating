import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum ExamGrade {
    GRADE_HIGHEST = 1.0,
    GRADE_MINIMAL_PASSING = 4.0,
    GRADE_LOWEST = 5.0,
    // student registered but did not attend to the exam
    GRADE_NOT_ATTEMPTED = 6.0,
}

@Schema()
export class ExamStats {
    @Prop({ required: true, type: Number })
    peopleTotal: number;

    @Prop({ required: true, type: Number })
    attemptsTotal: number;

    @Prop({ required: true, type: Number })
    peopleAttemptsFailed: number;

    @Prop({ required: true, type: Number })
    attemptsFailedPercentage: number;

    @Prop({ required: true, type: Number })
    averageAttemptsTotal: number;

    @Prop({ required: true, type: Number })
    averageAttemptsPassed: number;

    @Prop({
        type: [
            {
                grade: { type: String, required: true },
                people: { type: Number, required: true },
            },
        ],
    })
    grades: { grade: ExamGrade; people: number }[];
}

export const ExamStatsSchema = SchemaFactory.createForClass(ExamStats);