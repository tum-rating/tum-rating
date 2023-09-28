export declare enum Paths {
    home = "/",
    auth = "auth",
    activate = "activate",
    recovery = "recovery",
    courses = "courses",
    courseDetail = ":id"
}
type PathElement = {
    [key in Paths]: {
        parent: Paths | null;
    };
};
declare const PATH_ELEMENTS: PathElement;
declare const getPath: (pathToResolve: Paths) => string;
export { PATH_ELEMENTS, getPath };
