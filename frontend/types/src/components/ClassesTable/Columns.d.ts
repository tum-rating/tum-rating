import { Review } from "../../reviews/types";
export declare const columns: ({
    title: string;
    accessor: string;
    width: string;
    render?: undefined;
} | {
    title: string;
    accessor: string;
    render: (element: Review) => import("react/jsx-runtime").JSX.Element;
    width: string;
} | {
    title: string;
    accessor: string;
    width?: undefined;
    render?: undefined;
} | {
    title: string;
    accessor: string;
    render: (element: Review) => import("react/jsx-runtime").JSX.Element;
    width?: undefined;
})[];
