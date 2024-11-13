import {FetchedComputedCourse} from "./fetchedData";

type FetchedComputedDataObjectKeys = keyof FetchedComputedCourse;

type DatasetOptions = Partial<Record<FetchedComputedDataObjectKeys, {
    enabled: boolean;
    ascending: boolean;
    label: string;
    type: "string" | "number"
}>>;

export type {DatasetOptions, FetchedComputedDataObjectKeys};