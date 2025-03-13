import { ResourceProps } from "./interface";

export const generateLongId = () => {
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 1e5);
    return Number(`${timestamp}${randomPart}`);
};

export const findParentAndChildId = (resource: ResourceProps[], eventId: number) => {
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

const colorPalette = [
    "#b29dd9",
    "#779ecb",
    "#fe6b64",
    "#ffb347",
    "#9acd32",
    "#87cefa",
    "#e6e6fa",
    "#f4a460",
    "#dda0dd ",
    "#f08080"
];

export const generateColorById = (id: string): string => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colorPalette.length;
    return colorPalette[index];
};
