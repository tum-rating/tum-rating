const getPointerCoordinates = (event: TouchEvent | MouseEvent): number => {
    if ((event as TouchEvent).touches) {
        const { clientX } = (event as TouchEvent).touches[0];
        return clientX;
    }
    const { clientX } = event as MouseEvent;
    return clientX;
};

export { getPointerCoordinates };
