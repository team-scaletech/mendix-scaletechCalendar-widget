import { createElement, useEffect, useRef, useState } from "react";

import Calendar from "@event-calendar/core";
import TimeGrid from "@event-calendar/time-grid";
import DayGrid from "@event-calendar/day-grid";
import listPlugin from "@event-calendar/list";
import ResourceTimeline from "@event-calendar/resource-timeline";
import ResourceTimeGrid from "@event-calendar/resource-time-grid";
import Interaction from "@event-calendar/interaction";

import EventModal from "./Modal/EventModal";
import ResourcesModal from "./Modal/ResourcesModal";
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
        type: string;
        description: string;
    };
}

export interface ResourceProps {
    id: number;
    title: string;
    children?: ResourceProps[];
}

const EventCalendar = () => {
    const calendarRef = useRef<HTMLDivElement>(null);
    const [calendarInstance, setCalendarInstance] = useState<Calendar | null>(null);
    const [resource, setResource] = useState<ResourceProps[]>([
        {
            id: 1,
            title: "Resource A",
            children: [
                {
                    id: 11,
                    title: "Resource A1"
                },
                {
                    id: 12,
                    title: "Resource A2"
                }
            ]
        }
    ]);
    const [events] = useState<CalendarEvent[]>([
        {
            id: "1",
            resourceIds: [1],
            allDay: false,
            start: new Date(),
            end: new Date(new Date().getTime() + 60 * 60 * 1000),
            title: "Team Meeting",
            editable: true,
            startEditable: true,
            durationEditable: true,
            display: "auto",
            backgroundColor: "#007bff",
            textColor: "#ffffff",
            classNames: ["meeting-event"],
            styles: ["meeting-event"],
            extendedProps: { type: "work", description: "Weekly team meeting" }
        },
        {
            id: "2",
            resourceIds: [2],
            allDay: false,
            start: new Date(),
            end: new Date(new Date().getTime() + 90 * 60 * 1000),
            title: "Music Session",
            editable: true,
            startEditable: true,
            durationEditable: true,
            display: "auto",
            backgroundColor: "#28a745",
            textColor: "#ffffff",
            classNames: ["music-event"],
            styles: ["meeting-event"],
            extendedProps: { type: "music", description: "Piano practice session" }
        }
    ]);

    const [eventData, setEventData] = useState<CalendarEvent>({
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
        extendedProps: { type: "work", description: "" }
    });
    const [isShowModal, setIsShowModal] = useState({
        events: false,
        resource: false
    });

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
                            end: "dayGridMonth,timeGridWeek,timeGridDay,listWeek,resourceTimeGridDay,resourceTimelineDay "
                        },
                        resources: resource,
                        selectable: true,
                        nowIndicator: true,
                        editable: true,
                        events: events,
                        // navLinks: true,
                        // selectMirror: true,
                        // dayMaxEventRows: true,
                        select: handleSelect,
                        dateClick: handleDateClick,
                        eventClick: handleEventClick
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
    }, [events]);
    useEffect(() => {
        if (calendarInstance) {
            calendarInstance.setOption("resources", resource);
        }
    }, [resource]);

    const showModal = () => {
        setIsShowModal({
            events: true,
            resource: false
        });
    };

    const hideModal = () => {
        setIsShowModal({
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
        setEventData({
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
            extendedProps: { type: "work", description: "" }
        });
        showModal();
    };
    const handleEventClick = (clickInfo: { event: any }) => {
        setEventData({
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
            extendedProps: clickInfo.event.extendedProps || { type: "work", description: "" }
        });
        showModal();
    };

    const handleSubmit = () => {
        const updatedEvent = {
            id: eventData.id || String(events.length + 1),
            resourceIds: eventData.resourceIds,
            allDay: eventData.allDay,
            start: new Date(eventData.start),
            end: new Date(eventData.end),
            title: eventData.title,
            editable: eventData.editable,
            startEditable: eventData.startEditable,
            durationEditable: eventData.durationEditable,
            display: eventData.display,
            backgroundColor: eventData.backgroundColor,
            textColor: eventData.textColor,
            classNames: eventData.classNames,
            styles: [],
            extendedProps: { type: eventData.extendedProps.type, description: eventData.extendedProps.description }
        };

        if (eventData.id) {
            if (calendarInstance) {
                calendarInstance.updateEvent(updatedEvent);
            }
        } else {
            if (calendarInstance) {
                calendarInstance.addEvent(updatedEvent);
            }
        }

        hideModal();
    };

    const handleSelect = (selectionInfo: { start: any; end: any }) => {
        const adjustedEnd = new Date(selectionInfo.end);
        adjustedEnd.setMinutes(adjustedEnd.getMinutes() - 1);

        setEventData({
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
            extendedProps: { type: "work", description: "" }
        });
        showModal();
    };

    return (
        <div className="container mx-auto p-5">
            <div ref={calendarRef}></div>
            {isShowModal.events && (
                <EventModal
                    hideModal={hideModal}
                    handleSubmit={handleSubmit}
                    eventData={eventData}
                    setEventData={setEventData}
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
