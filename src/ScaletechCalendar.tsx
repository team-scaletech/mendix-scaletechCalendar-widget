import { FC, ReactElement, createElement, useEffect, useState } from "react";

import { ScaletechCalendarContainerProps } from "../typings/ScaletechCalendarProps";
import EventCalendar from "./components/EventCalendar";
import { EventVale, ResourceProps } from "./utils/interface";

import { library } from "@fortawesome/fontawesome-svg-core";

// import your icons
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "./ui/ScaletechCalendar.css";

export const ScaletechCalendar: FC<ScaletechCalendarContainerProps> = (props): ReactElement => {
    const {
        eventData,
        eventId,
        startDate,
        endDate,
        titleData,
        descriptionData,
        eventColor,
        iconClass,
        eventChildrenResourceId,
        eventParentResourceId,
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
        createEventParentId,
        createEventChildrenId,
        createEventColor,
        createIconClass,
        createParentId,
        createParentName,
        createChildId,
        createChildName,
        saveResourceAction,
        eventDropAction,
        isDescription,
        class: customClass,
        style
    } = props;
    const [eventValue, setEventValue] = useState<EventVale[]>([]);
    const [resource, setResource] = useState<ResourceProps[]>([]);

    useEffect(() => {
        if (eventData && eventData.items) {
            const formattedEvents: EventVale[] = eventData.items.map((item: any) => ({
                id: eventId?.get(item).value?.toString() || "",
                startDate: startDate.get(item).value || "",
                endDate: endDate.get(item).value || "",
                titleData: titleData.get(item).value || "",
                descriptionData: descriptionData.get(item).value || "",
                eventParentId: eventParentResourceId.get(item).value?.toString() || "",
                eventChildrenId: eventChildrenResourceId.get(item).value?.toString() || "",
                eventColor: eventColor.get(item).value || "#007bff",
                iconClass: iconClass.get(item).value || ""
            }));
            setEventValue(formattedEvents);
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
            setResource(
                finalResourceValue.map(r => ({
                    id: Number(r.id), // Convert ID from string to number
                    title: r.title,
                    children: r.children?.map(child => ({
                        id: Number(child.id), // Convert child ID from string to number
                        title: child.title
                    }))
                }))
            );
        }
    }, [parentData, childrenData]);

    return (
        <EventCalendar
            eventValue={eventValue}
            resource={resource}
            saveEventAction={saveEventAction}
            createEventId={createEventId}
            createStartDate={createStartDate}
            createEndDate={createEndDate}
            createTitleData={createTitleData}
            createDescriptionData={createDescriptionData}
            createParentId={createParentId}
            createParentTitle={createParentName}
            createEventColor={createEventColor}
            createIconClass={createIconClass}
            createChildId={createChildId}
            createChildTitle={createChildName}
            saveResourceAction={saveResourceAction}
            createEventParentId={createEventParentId}
            createEventChildrenId={createEventChildrenId}
            eventDropAction={eventDropAction}
            isDescription={isDescription}
            className={customClass || ""}
            style={style}
        />
    );
};

library.add(fab, fas, far);
