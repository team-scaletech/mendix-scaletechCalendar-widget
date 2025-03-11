export const generateLongId = () => {
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 1e5);
    return Number(`${timestamp}${randomPart}`);
};
