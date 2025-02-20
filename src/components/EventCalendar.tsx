import { createElement, useEffect, useRef, useState } from "react";

import Calendar from "@event-calendar/core";
import TimeGrid from "@event-calendar/time-grid";
import DayGrid from "@event-calendar/day-grid";
import listPlugin from "@event-calendar/list";
import ResourceTimeline from "@event-calendar/resource-timeline";
import ResourceTimeGrid from "@event-calendar/resource-time-grid";
import Interaction from "@event-calendar/interaction";
interface CalendarEvent {
    id: string;
    resourceIds: string[];
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

const EventCalendar = () => {
    const calendarRef = useRef<HTMLDivElement>(null);
    const [calendarInstance, setCalendarInstance] = useState<Calendar | null>(null);
    const [events] = useState<CalendarEvent[]>([
        {
            id: "1",
            resourceIds: ["room1"],
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
            resourceIds: ["room2"],
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
    const [isShowModal, setIsShowModal] = useState(false);
    console.warn("events", events);
    const showModal = () => {
        setIsShowModal(true);
    };

    const hideModal = () => {
        setIsShowModal(false);
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

        // let updatedEvents;
        if (eventData.id) {
            // updatedEvents = events.map(event => (event.id === eventData.id ? updatedEvent : event));
            if (calendarInstance) {
                calendarInstance.updateEvent(updatedEvent);
            }
        } else {
            // updatedEvents = [...events, updatedEvent];

            if (calendarInstance) {
                calendarInstance.addEvent(updatedEvent);
            }
        }

        // setEvents(updatedEvents);s

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
    const resources = [
        { id: "room1", title: "Conference Room A" },
        { id: "room2", title: "Conference Room B" },
        { id: "room3", title: "Training Room" }
    ];

    useEffect(() => {
        if (calendarRef.current && !calendarInstance) {
            const newCalendar = new Calendar({
                target: calendarRef.current,
                props: {
                    plugins: [TimeGrid, DayGrid, listPlugin, ResourceTimeline, ResourceTimeGrid, Interaction], // Move plugins inside props
                    options: {
                        view: "timeGridWeek",
                        headerToolbar: {
                            start: "prev,next today",
                            center: "title",
                            end: "dayGridMonth,timeGridWeek,timeGridDay,listWeek,resourceTimeGridDay,resourceTimelineDay "
                        },
                        resources: resources,
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

    return (
        <div className="container mx-auto p-5">
            <div ref={calendarRef}></div>
            {isShowModal && (
                <div className="modal-overlay">
                    <div className="custom-modal">
                        <div className="close-btn" onClick={hideModal}>
                            <svg viewBox="0 0 30 30" width="20px" height="20px">
                                <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z" />
                            </svg>
                        </div>
                        <h2>{eventData.id ? "Edit Event" : "Add Event"}</h2>
                        <div className="time-wrapper">
                            <div>
                                <label>Start Time:</label>
                                <input
                                    type="datetime-local"
                                    value={eventData.start as any}
                                    onChange={e => setEventData({ ...eventData, start: e.target.value as any })}
                                />
                            </div>
                            <div>
                                <label>End Time:</label>
                                <input
                                    type="datetime-local"
                                    value={eventData.end as any}
                                    onChange={e => setEventData({ ...eventData, end: e.target.value as any })}
                                />
                            </div>
                        </div>
                        <div>
                            <label>Title:</label>
                            <input
                                type="text"
                                value={eventData.title}
                                onChange={e => setEventData({ ...eventData, title: e.target.value })}
                            />
                            <label>Type:</label>
                            <input
                                type="text"
                                value={eventData.extendedProps.type}
                                onChange={e =>
                                    setEventData({
                                        ...eventData,
                                        extendedProps: { type: e.target.value, description: "" }
                                    })
                                }
                            />
                        </div>
                        <div className="modal-buttons">
                            <button onClick={handleSubmit}>Save</button>
                            <button onClick={hideModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventCalendar;
