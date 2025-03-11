export const generateLongId = () => {
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 1e5);
    return Number(`${timestamp}${randomPart}`);
};

export const findParentAndChildId = (resource: any, eventId: any) => {
    for (const parent of resource) {
        // Check if the eventId matches the parent id
        if (parent.id === eventId) {
            return { parentId: parent.id };
        }

        // Check if the eventId matches any child id
        if (parent.children) {
            const child = parent.children.find((child: { id: any }) => child.id === eventId);
            if (child) {
                return { parentId: parent.id, childId: child.id };
            }
        }
    }

    // If not found, return null or an empty object
    return null;
};
