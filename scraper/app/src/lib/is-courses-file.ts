export default (id: string) => {
    const coursesFiles = ["courses-production"]
    return coursesFiles.includes(id)
}