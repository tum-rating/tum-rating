const preprocessComment = (comment: string) => {
    return comment.replace(/\n{3,}/g, '\n\n');
};

export {preprocessComment};
