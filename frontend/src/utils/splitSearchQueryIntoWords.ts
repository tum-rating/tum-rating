const splitSearchQueryIntoWords = (value: string) => {
    const separators = [' ', ',', '.', '-'];
    const words = value.split(new RegExp(`[${separators.join('')}]`));
    return words.filter(Boolean);
}

export {splitSearchQueryIntoWords}