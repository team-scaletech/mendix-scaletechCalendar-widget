import { createElement, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";

const CalendarComponent = () => {
    const [events, setEvents] = useState([
        {
            id: "1",
            title: "Meeting",
            start: new Date(),
            end: new Date(new Date().getTime() + 60 * 60 * 1000),
            extendedProps: { type: "work" }
        },
        {
            id: "2",
            title: "Music Session",
            start: new Date(),
            end: new Date(new Date().getTime() + 90 * 60 * 1000),
            extendedProps: { type: "music" }
        }
    ]);

    const [eventData, setEventData] = useState({
        id: "",
        title: "",
        start: new Date().toISOString().slice(0, 16),
        end: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString().slice(0, 16),
        type: "work"
    });
    const [isShowModal, setIsShowModal] = useState(false);
    const [isCalendarReady, setIsCalendarReady] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setIsCalendarReady(true);
        }, 100);
    }, []);
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
            title: "",
            start: formatDateToLocal(arg.date),
            end: formatDateToLocal(new Date(arg.date.getTime() + 60 * 60 * 1000)), // 1 hour later
            type: "work"
        });

        showModal();
    };

    const handleEventClick = (clickInfo: { event: any }) => {
        setEventData({
            id: clickInfo.event.id,
            title: clickInfo.event.title,
            start: formatDateToLocal(clickInfo.event.start),
            end: formatDateToLocal(clickInfo.event.end || new Date(clickInfo.event.start).getTime() + 60 * 60 * 1000),
            type: clickInfo.event.extendedProps.type
        });
        showModal();
    };

    const handleSubmit = () => {
        const updatedEvent = {
            id: eventData.id || String(events.length + 1),
            title: eventData.title,
            start: new Date(eventData.start),
            end: new Date(eventData.end),
            extendedProps: { type: eventData.type }
        };

        if (eventData.id) {
            setEvents(events.map(event => (event.id === eventData.id ? updatedEvent : event)));
        } else {
            setEvents([...events, updatedEvent]);
        }

        hideModal();
    };

    const handleSelect = (selectionInfo: { start: any; end: any }) => {
        const adjustedEnd = new Date(selectionInfo.end);
        adjustedEnd.setMinutes(adjustedEnd.getMinutes() - 1);
        setEventData({
            id: "",
            title: "",
            start: formatDateToLocal(selectionInfo.start),
            end: formatDateToLocal(adjustedEnd),
            type: "work"
        });
        showModal();
    };

    return (
        <div className="container mx-auto p-5">
            {isCalendarReady && (
                <FullCalendar
                    plugins={[
                        dayGridPlugin,
                        timeGridPlugin,
                        multiMonthPlugin,
                        interactionPlugin,
                        listPlugin,
                        bootstrap5Plugin,
                        resourceTimelinePlugin
                    ]}
                    themeSystem="bootstrap5"
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay,multiMonthYear,listWeek,resourceTimeline"
                    }}
                    navLinks={true}
                    selectable={true}
                    selectMirror={true}
                    nowIndicator={true}
                    select={handleSelect}
                    editable={true}
                    events={events}
                    dayMaxEventRows={true}
                    views={{
                        timeGrid: {
                            dayMaxEventRows: 2 // adjust to 6 only for timeGridWeek/timeGridDay
                        },
                        resourceTimelineFourDays: {
                            type: "resourceTimeline",
                            duration: { days: 4 }
                        }
                    }}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                />
            )}
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
                                    value={eventData.start}
                                    onChange={e => setEventData({ ...eventData, start: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>End Time:</label>
                                <input
                                    type="datetime-local"
                                    value={eventData.end}
                                    onChange={e => setEventData({ ...eventData, end: e.target.value })}
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
                                value={eventData.type}
                                onChange={e => setEventData({ ...eventData, type: e.target.value })}
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

export default CalendarComponent;
