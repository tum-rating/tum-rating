import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

enum ExamGrade {
    GRADE_1_0 = 1.0,
    GRADE_1_3 = 1.3,
    GRADE_1_7 = 1.7,
    GRADE_2_0 = 2.0,
    GRADE_2_3 = 2.3,
    GRADE_2_7 = 2.7,
    GRADE_3_0 = 3.0,
    GRADE_3_3 = 3.3,
    GRADE_3_7 = 3.7,
    GRADE_4_0 = 4.0,
    GRADE_4_3 = 4.3,
    GRADE_4_7 = 4.7,
    GRADE_5_0 = 5.0,
    GRADE_6_0 = 6.0,
}

@Schema()
export class ExamStats {
    @Prop({ required: true, type: Number })
    peopleTotal: number;

    @Prop({ required: true, type: Number })
    peopleFailed: number;

    @Prop({ required: true, type: Number })
    attemptsTotal: number;

    @Prop({ required: true, type: Number })
    attemptsFailedPercent: number;

    @Prop({ required: true, type: Number })
    averageTotal: number;

    @Prop({ required: true, type: Number })
    averagePassed: number;

    @Prop({
        type: [
            {
                grade: { type: String, enum: ExamGrade, required: true },
                people: { type: Number, required: true },
            },
        ],
    })
    grades: { grade: ExamGrade; people: number }[];
}

export const ExamStatsSchema = SchemaFactory.createForClass(ExamStats);