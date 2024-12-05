export default (id: string) => {
    const coursesFiles = ["courses-production","courses-tum-campus","merged"]
    return coursesFiles.some(file => id.includes(file));
}