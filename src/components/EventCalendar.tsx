import { createElement, FC, useEffect, useMemo, useRef, useState } from "react";

import Calendar from "@event-calendar/core";
import TimeGrid from "@event-calendar/time-grid";
import DayGrid from "@event-calendar/day-grid";
import listPlugin from "@event-calendar/list";
import ResourceTimeline from "@event-calendar/resource-timeline";
import ResourceTimeGrid from "@event-calendar/resource-time-grid";
import Interaction from "@event-calendar/interaction";

import EventModal from "./Modal/EventModal";
import ResourcesModal from "./Modal/ResourcesModal";
import EventDetail from "./Modal/EventDetail";

import { EventVale, ResourceValue } from "src/ScaletechCalendar";
import { ActionValue, EditableValue } from "mendix";
import { Big } from "big.js";

import "@event-calendar/core/index.css";

interface EventCalendarProps {
    eventValue?: EventVale[];
    resourceValue?: ResourceValue[];
    saveEventAction?: ActionValue;
    createEventId?: EditableValue<Big>;
    createStartDate?: EditableValue<string>;
    createEndDate?: EditableValue<string>;
    createTitleData?: EditableValue<string>;
    createDescriptionData?: EditableValue<string>;
}

export interface CalendarEvent {
    id: string;
    resourceIds: number[];
    allDay: boolean;
    start: Date;
    end: Date;
    title: string;
    editable: boolean;
    startEditable: boolean;
    durationEditable: boolean;
    display: "auto" | "background" | "ghost" | "preview" | "pointer";
    backgroundColor: string;
    textColor: string;
    classNames: string[];
    styles: string[]; // Use classNames instead of styles
    extendedProps: {
        description: string;
    };
}

export interface ResourceProps {
    id: number;
    title: string;
    children?: ResourceProps[];
}

const EventCalendar: FC<EventCalendarProps> = props => {
    const {
        eventValue,
        resourceValue,
        createEventId,
        createStartDate,
        createEndDate,
        createDescriptionData,
        createTitleData,
        saveEventAction
    } = props;

    const calendarRef = useRef<HTMLDivElement>(null);
    const [calendarInstance, setCalendarInstance] = useState<Calendar | null>(null);
    const [resource, setResource] = useState<ResourceProps[]>([]);
    const events: CalendarEvent[] = useMemo(
        () =>
            eventValue?.map(event => ({
                id: event.id,
                resourceIds: [15481123719111905],
                allDay: false,
                start: new Date(event.startDate),
                end: new Date(event.endDate),
                title: event.titleData,
                editable: true,
                startEditable: true,
                durationEditable: true,
                display: "auto",
                backgroundColor: "#007bff",
                textColor: "#ffffff",
                classNames: ["meeting-event"],
                styles: ["meeting-event"],
                extendedProps: { description: event.descriptionData }
            })) || [],
        [eventValue]
    );

    const [eventObject, setEventObject] = useState<CalendarEvent>({
        id: "",
        resourceIds: [],
        allDay: false,
        start: new Date().toISOString().slice(0, 16) as any,
        end: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString().slice(0, 16) as any,
        title: "",
        editable: true,
        startEditable: true,
        durationEditable: true,
        display: "auto" as "auto" | "background" | "ghost" | "preview" | "pointer",
        backgroundColor: "#007bff",
        textColor: "#ffffff",
        classNames: [],
        styles: [],
        extendedProps: { description: "" }
    });
    const [isShowModal, setIsShowModal] = useState({
        detail: false,
        events: false,
        resource: false
    });
    useEffect(() => {
        if (resourceValue) {
            setResource(
                resourceValue.map(r => ({
                    id: Number(r.id), // Convert ID from string to number
                    title: r.title,
                    children: r.children?.map(child => ({
                        id: Number(child.id), // Convert child ID from string to number
                        title: child.title
                    }))
                }))
            );
        }
    }, [resourceValue]);
    useEffect(() => {
        if (calendarRef.current && !calendarInstance) {
            const newCalendar = new Calendar({
                target: calendarRef.current,
                props: {
                    plugins: [TimeGrid, DayGrid, listPlugin, ResourceTimeline, ResourceTimeGrid, Interaction], // Move plugins inside props
                    options: {
                        view: "dayGridMonth",
                        customButtons: {
                            myCustomButton: {
                                text: "Resource",
                                click: () => setIsShowModal({ ...isShowModal, resource: true })
                            }
                        },

                        headerToolbar: {
                            start: "prev,next today myCustomButton",
                            center: "title",
                            end: "dayGridMonth,timeGridWeek,timeGridDay,listWeek,resourceTimeGridWeek,resourceTimelineDay "
                        },
                        resources: resourceValue,
                        selectable: true,
                        nowIndicator: true,
                        editable: true,
                        events: events,
                        allDaySlot: true,

                        select: handleSelect,
                        dateClick: handleDateClick,
                        eventClick: handleEventClick,
                        views: {
                            timeGridWeek: { pointer: true },
                            resourceTimeGridWeek: { pointer: true },
                            resourceTimelineDay: {
                                pointer: true,
                                resources: resource
                            }
                        }
                    }
                }
            });

            setCalendarInstance(newCalendar);
        }

        return () => {
            if (calendarInstance) {
                calendarInstance.destroy();
                setCalendarInstance(null);
            }
        };
    }, []);
    useEffect(() => {
        if (calendarInstance) {
            const currentEvents = calendarInstance.getOption("events") || [];

            const mergedEvents = events.map(newEvent => {
                const existingEvent = currentEvents.find(e => e.id === newEvent.id);

                if (existingEvent) {
                    return { ...existingEvent, ...newEvent };
                } else {
                    return newEvent;
                }
            });
            calendarInstance.setOption("events", mergedEvents);
        }
    }, [events]);

    useEffect(() => {
        if (calendarInstance) {
            calendarInstance.setOption("resources", resource);
        }
    }, [resource]);

    const showModal = () => {
        setIsShowModal({
            detail: true,
            events: false,
            resource: false
        });
    };

    const hideModal = () => {
        setIsShowModal({
            detail: false,
            events: false,
            resource: false
        });
    };
    const formatDateToLocal = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // 01-12
        const day = String(date.getDate()).padStart(2, "0"); // 01-31
        const hours = String(date.getHours()).padStart(2, "0"); // 00-23
        const minutes = String(date.getMinutes()).padStart(2, "0"); // 00-59

        return `${year}-${month}-${day}T${hours}:${minutes}`; // `YYYY-MM-DDTHH:mm`
    };

    const handleDateClick = (arg: { date: Date }) => {
        setEventObject({
            id: "",
            resourceIds: [],
            allDay: false,
            start: formatDateToLocal(arg.date) as any,
            end: formatDateToLocal(new Date(arg.date.getTime() + 60 * 60 * 1000)) as any,
            title: "",
            editable: true,
            startEditable: true,
            durationEditable: true,
            display: "auto",
            backgroundColor: "#007bff",
            textColor: "#ffffff",
            classNames: [],
            styles: [],
            extendedProps: { description: "" }
        });
        setIsShowModal({ ...isShowModal, events: true });
    };
    const handleEventClick = (clickInfo: { event: any }) => {
        setEventObject({
            id: clickInfo.event.id,
            resourceIds: clickInfo.event.resourceIds || [],
            allDay: clickInfo.event.allDay || false,
            start: formatDateToLocal(clickInfo.event.start) as any,
            end: formatDateToLocal(
                clickInfo.event.end || new Date(clickInfo.event.start).getTime() + 60 * 60 * 1000
            ) as any,
            title: clickInfo.event.title,
            editable: clickInfo.event.editable ?? true,
            startEditable: clickInfo.event.startEditable ?? true,
            durationEditable: clickInfo.event.durationEditable ?? true,
            display: (clickInfo.event.display as "auto" | "background" | "ghost" | "preview" | "pointer") || "auto",
            backgroundColor: clickInfo.event.backgroundColor || "#007bff",
            textColor: clickInfo.event.textColor || "#ffffff",
            classNames: clickInfo.event.classNames || [],
            styles: [],
            extendedProps: clickInfo.event.extendedProps || { description: "" }
        });
        showModal();
    };

    const handleSubmit = () => {
        if (!eventObject) return;
        const { id, start, end, title, extendedProps } = eventObject;
        const generateLongId = () => {
            const timestamp = Date.now(); // 13 digits
            const randomPart = Math.floor(Math.random() * 1e5); // 5 digits to keep it safe
            return Number(`${timestamp}${randomPart}`);
        };

        const numericId = id && !isNaN(Number(id)) && Number(id) !== 0 ? id : generateLongId();

        const newValue = new Big(numericId);
        createEventId?.setValue(newValue);
        createStartDate?.setValue(start.toString());
        createEndDate?.setValue(end.toString());
        createTitleData?.setValue(title);
        createDescriptionData?.setValue(extendedProps.description);

        if (saveEventAction && saveEventAction.canExecute) {
            saveEventAction.execute();
        }

        hideModal();
    };

    const handleSelect = (selectionInfo: { start: any; end: any }) => {
        const adjustedEnd = new Date(selectionInfo.end);
        adjustedEnd.setMinutes(adjustedEnd.getMinutes() - 1);

        setEventObject({
            id: "",
            resourceIds: [],
            allDay: false,
            start: formatDateToLocal(selectionInfo.start) as any,
            end: formatDateToLocal(adjustedEnd) as any,
            title: "",
            editable: true,
            startEditable: true,
            durationEditable: true,
            display: "auto",
            backgroundColor: "#007bff",
            textColor: "#ffffff",
            classNames: [],
            styles: [],
            extendedProps: { description: "" }
        });
        setIsShowModal({ ...isShowModal, events: true });
    };
    // const handleEdit = () => {
    //     const { id } = eventObject;

    //     if (createEventId) {
    //         const numericId = id !== undefined ? Number(id) : eventValue?.length || 0; // Ensure a valid fallback
    //         if (!isNaN(numericId)) {
    //             createEventId.setValue(new Big(numericId)); // Convert only if valid
    //         }
    //     }
    // };

    return (
        <div className="container mx-auto p-5">
            <div ref={calendarRef}></div>
            {isShowModal.detail && (
                <EventDetail
                    hideModal={hideModal}
                    EditModalShow={() => setIsShowModal({ detail: false, events: true, resource: false })}
                    eventObject={eventObject}
                    resources={resource}
                />
            )}
            {isShowModal.events && (
                <EventModal
                    hideModal={hideModal}
                    handleSubmit={handleSubmit}
                    eventObject={eventObject}
                    setEventObject={setEventObject}
                    resources={resource}
                />
            )}
            {isShowModal.resource && (
                <ResourcesModal hideModal={hideModal} resources={resource} setResources={setResource} />
            )}
        </div>
    );
};

export default EventCalendar;
