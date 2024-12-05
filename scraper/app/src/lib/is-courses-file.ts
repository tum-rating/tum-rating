export default (id: string) => {
    const coursesFiles = ["courses-production"]
    return coursesFiles.some(file => id.includes(file));
}