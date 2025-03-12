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

import { findParentAndChildId, generateLongId } from "../utils/function";
import { CalendarEvent, EventCalendarProps } from "src/utils/interface";
import { Big } from "big.js";

import "@event-calendar/core/index.css";

const EventCalendar: FC<EventCalendarProps> = props => {
    const {
        eventValue,
        resource = [],
        createEventId,
        createStartDate,
        createEndDate,
        createDescriptionData,
        createEventParentId,
        createEventChildrenId,
        createTitleData,
        saveEventAction,
        createParentId,
        createParentTitle,
        createChildId,
        createChildTitle,
        saveResourceAction,
        eventDropAction
    } = props;
    const calendarRef = useRef<HTMLDivElement>(null);
    const [calendarInstance, setCalendarInstance] = useState<Calendar | null>(null);
    const events: CalendarEvent[] = useMemo(() => {
        return (
            eventValue?.map(event => {
                const parentId = Number(event.eventParentId);
                const childId = Number(event.eventChildrenId);
                const resourceId = isNaN(childId) ? parentId : childId;

                return {
                    id: event.id,
                    resourceIds: [resourceId],
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
                };
            }) || []
        );
    }, [eventValue]);
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
    const [isDrop, setIsDrop] = useState(false);

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
                        selectable: true,
                        nowIndicator: true,
                        editable: true,
                        events: events,
                        resources: resource,
                        allDaySlot: true,

                        select: handleSelect,
                        dateClick: handleDateClick,
                        eventClick: handleEventClick,
                        eventDrop: handleEventDrop,
                        views: {
                            timeGridWeek: {
                                pointer: true
                            },
                            resourceTimeGridWeek: {
                                pointer: true
                            },
                            resourceTimelineDay: {
                                pointer: true
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
    }, [resource, calendarInstance]);
    useEffect(() => {
        if (isDrop) {
            EventDragAndDrop();
        }
    }, [isDrop]);

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

    const handleEventDrop = (dropInfo: { event: any }) => {
        const {
            id,
            start,
            end,
            allDay,
            title,
            extendedProps,
            resourceIds,
            editable,
            startEditable,
            durationEditable,
            display,
            backgroundColor,
            textColor,
            classNames
        } = dropInfo.event;
        setEventObject({
            id: id,
            resourceIds: resourceIds || [],
            allDay: allDay || false,
            start: formatDateToLocal(start) as any,
            end: formatDateToLocal(end || new Date(start).getTime() + 60 * 60 * 1000) as any,
            title: title,
            editable: editable ?? true,
            startEditable: startEditable ?? true,
            durationEditable: durationEditable ?? true,
            display: (display as "auto" | "background" | "ghost" | "preview" | "pointer") || "auto",
            backgroundColor: backgroundColor || "#007bff",
            textColor: textColor || "#ffffff",
            classNames: classNames || [],
            styles: [],
            extendedProps: extendedProps || { description: "" }
        });
        setIsDrop(true);
    };
    const EventDragAndDrop = () => {
        if (!eventObject) return;
        const { id, start, end, title, extendedProps, resourceIds } = eventObject;
        const resourceId = findParentAndChildId(resource, resourceIds[0]);
        const numericId = id && !isNaN(Number(id)) && Number(id) !== 0 ? id : generateLongId();

        const newValue = new Big(numericId);
        createEventId?.setValue(newValue);
        createStartDate?.setValue(start.toString());
        createEndDate?.setValue(end.toString());
        createTitleData?.setValue(title);
        createDescriptionData?.setValue(extendedProps.description);
        if (resourceId) {
            if (resourceId.childId) {
                createEventChildrenId?.setValue(new Big(resourceId.childId));
                createEventParentId?.setValue(new Big(resourceId.parentId));
            } else {
                createEventParentId?.setValue(new Big(resourceId.parentId));
            }
        }
        // Execute the event drop action
        if (eventDropAction && eventDropAction.canExecute) {
            eventDropAction.execute();
        }
        setIsDrop(false);
    };

    const handleSubmit = () => {
        if (!eventObject) return;
        const { id, start, end, title, extendedProps, resourceIds } = eventObject;
        const resourceId = findParentAndChildId(resource, resourceIds[0]);
        const numericId = id && !isNaN(Number(id)) && Number(id) !== 0 ? id : generateLongId();

        const newValue = new Big(numericId);
        createEventId?.setValue(newValue);
        createStartDate?.setValue(start.toString());
        createEndDate?.setValue(end.toString());
        createTitleData?.setValue(title);
        createDescriptionData?.setValue(extendedProps.description);
        if (resourceId) {
            if (resourceId.childId) {
                createEventChildrenId?.setValue(new Big(resourceId.childId));
                createEventParentId?.setValue(new Big(resourceId.parentId));
            } else {
                createEventParentId?.setValue(new Big(resourceId.parentId));
            }
        }

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
                <ResourcesModal
                    hideModal={hideModal}
                    resources={resource}
                    createParentId={createParentId}
                    createParentTitle={createParentTitle}
                    createChildId={createChildId}
                    createChildTitle={createChildTitle}
                    saveResourceAction={saveResourceAction}
                />
            )}
        </div>
    );
};

export default EventCalendar;
