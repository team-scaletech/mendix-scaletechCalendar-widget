import { FC, ReactElement, createElement, useEffect, useState } from "react";

import { ScaletechCalendarContainerProps } from "../typings/ScaletechCalendarProps";
import EventCalendar from "./components/EventCalendar";
// import { GUID } from "mendix";

import "./ui/ScaletechCalendar.css";
export interface EventVale {
    id: string;
    StartDate: string;
    EndDate: string;
    TitleData: string;
    DescriptionData: string;
    parentResource: string;
}
export interface ResourceValue {
    id: string;
    title: string;
    children?: ResourceValue[];
}
export const ScaletechCalendar: FC<ScaletechCalendarContainerProps> = (props): ReactElement => {
    const {
        eventData,
        StartDate,
        EndDate,
        TitleData,
        DescriptionData,
        childrenData,
        childrenTitle,
        parentDataAssociation,
        parentData,
        parentTitle
    } = props;
    const [eventValue, setEventValue] = useState<EventVale[]>([]);
    const [resourceValue, setResourceValue] = useState<ResourceValue[]>([]);
    console.warn(">>>>", resourceValue);

    useEffect(() => {
        if (eventData && eventData.items) {
            eventData.items.forEach((item: any) => {
                const event = {
                    id: item.id,
                    StartDate: StartDate.get(item).displayValue,
                    EndDate: EndDate.get(item).displayValue,
                    TitleData: TitleData.get(item).displayValue,
                    DescriptionData: DescriptionData.get(item).displayValue
                };
                setEventValue(prevEventValue => [...prevEventValue, event] as any);
            });
        }
    }, [eventData]);

    useEffect(() => {
        if (parentData?.items && childrenData?.items) {
            // Map parents with their IDs and Titles
            const parentMap = new Map<string, { id: string; title: string; children: any[] }>();

            parentData.items.forEach((parentItem: any) => {
                const parentId = parentItem.id;
                parentMap.set(parentId, {
                    id: parentId,
                    title: parentTitle.get(parentItem)?.displayValue ?? "No Title",
                    children: []
                });
            });

            // Assign children to their respective parents
            childrenData.items.forEach((childItem: any) => {
                const child = {
                    id: childItem.id,
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

    return <EventCalendar eventValue={eventValue} resourceValue={resourceValue} />;
};
