export const parseStringToArray = (string: string | undefined, separator = ','): string[] => {
    if (!string)
        return [];

    return string.split(separator).map(item => item.trim());
}