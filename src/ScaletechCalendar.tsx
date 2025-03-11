import { FC, ReactElement, createElement, useEffect, useState } from "react";

import { ScaletechCalendarContainerProps } from "../typings/ScaletechCalendarProps";
import EventCalendar from "./components/EventCalendar";
// import { GUID } from "mendix";

import "./ui/ScaletechCalendar.css";
export interface EventVale {
    id: string;
    startDate: string;
    endDate: string;
    titleData: string;
    descriptionData: string;
    parentTitle: string;
    childrenTitle: string;
}
export interface ResourceValue {
    id: string;
    title: string;
    children?: ResourceValue[];
}
export const ScaletechCalendar: FC<ScaletechCalendarContainerProps> = (props): ReactElement => {
    const {
        eventData,
        eventId,
        startDate,
        endDate,
        titleData,
        descriptionData,
        parentResource,
        childrenResource,
        childrenData,
        childrenTitle,
        childrenResourceId,
        parentDataAssociation,
        parentData,
        parentResourceId,
        parentTitle,
        saveEventAction,
        createEventId,
        createStartDate,
        createEndDate,
        createTitleData,
        createDescriptionData,
        createParentId,
        createParentName,
        createChildId,
        createChildName,
        saveResourceAction
    } = props;
    const [eventValue, setEventValue] = useState<EventVale[]>([]);
    const [resourceValue, setResourceValue] = useState<ResourceValue[]>([]);

    useEffect(() => {
        if (eventData && eventData.items) {
            const formattedEvents = eventData.items.map((item: any) => ({
                id: eventId?.get(item).value?.toString(),
                startDate: startDate.get(item).value,
                endDate: endDate.get(item).value,
                titleData: titleData.get(item).value,
                descriptionData: descriptionData.get(item).value,
                parentTitle: parentResource.get(item).value,
                childrenTitle: childrenResource.get(item).value
            }));
            setEventValue(formattedEvents as any);
        }
    }, [eventData]);

    useEffect(() => {
        if (parentData?.items && childrenData?.items) {
            // Map parents with their IDs and Titles
            const parentMap = new Map<string, { id: string; title: string; children: any[] }>();

            parentData.items.forEach((parentItem: any) => {
                const parentId = parentItem.id;
                parentMap.set(parentId, {
                    id: parentResourceId.get(parentItem).value?.toString() || "",
                    title: parentTitle.get(parentItem)?.displayValue ?? "No Title",
                    children: []
                });
            });

            // Assign children to their respective parents
            childrenData.items.forEach((childItem: any) => {
                const child = {
                    id: childrenResourceId.get(childItem).value?.toString(),
                    title: childrenTitle.get(childItem)?.displayValue ?? "No Title"
                };

                const parentValue = parentDataAssociation.get(childItem).value;

                if (Array.isArray(parentValue)) {
                    // If it's a Reference Set (1-to-Many)
                    parentValue.forEach((parent: any) => {
                        const parentId = parent.id;
                        if (parentMap.has(parentId)) {
                            parentMap.get(parentId)?.children.push(child);
                        }
                    });
                } else if (parentValue && typeof parentValue === "object") {
                    // If it's a single Reference (1-to-1)
                    const parentId = parentValue.id;
                    if (parentMap.has(parentId)) {
                        parentMap.get(parentId)?.children.push(child);
                    }
                }
            });

            const finalResourceValue = Array.from(parentMap.values());
            setResourceValue(finalResourceValue);
        }
    }, [parentData, childrenData]);

    return (
        <EventCalendar
            eventValue={eventValue}
            resourceValue={resourceValue}
            saveEventAction={saveEventAction}
            createEventId={createEventId}
            createStartDate={createStartDate}
            createEndDate={createEndDate}
            createTitleData={createTitleData}
            createDescriptionData={createDescriptionData}
            createParentId={createParentId}
            createParentTitle={createParentName}
            createChildId={createChildId}
            createChildTitle={createChildName}
            saveResourceAction={saveResourceAction}
        />
    );
};
