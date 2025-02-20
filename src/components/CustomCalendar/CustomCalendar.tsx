import { useState, createElement, SetStateAction } from "react";
import DayView from "./components/DayView";
import MonthView from "./components/MonthView";
import YearView from "./components/YearView";
import WeekView from "./components/WeekView";
import TimelineView from "./components/TimelineView";

type EventType = {
    id: number;
    title: string;
    date: string;
    time: string;
};

export interface ViewProps {
    date: Date;
    events: EventType[];
    onDrop: (event: React.DragEvent<HTMLDivElement>, newDate: string) => void;
    onDragStart: (event: React.DragEvent<HTMLDivElement>, id: number) => void;
}

const CalendarCustom = () => {
    const [view, setView] = useState("month");
    const [currentDate] = useState(new Date());
    const [events, setEvents] = useState([{ id: 1, title: "Meeting", date: "2025-02-20", time: "10:00 AM" }]);
    const views = ["day", "month", "week", "year", "timeline"];

    const changeView = (newView: SetStateAction<string>) => setView(newView);

    const onDragStart = (event: { dataTransfer: { setData: (arg0: string, arg1: any) => void } }, id: any) => {
        event.dataTransfer.setData("eventId", id);
    };

    const onDrop = (
        event: { preventDefault: () => void; dataTransfer: { getData: (arg0: string) => any } },
        newDate: any
    ) => {
        event.preventDefault();
        const eventId = event.dataTransfer.getData("eventId");
        setEvents(events.map(evt => (evt.id == eventId ? { ...evt, date: newDate } : evt)));
    };

    const renderView = () => {
        switch (view) {
            case "day":
                return <DayView date={currentDate} events={events as any} onDrop={onDrop} />;
            case "week":
                return <WeekView startDate={currentDate} events={events as any} />;
            case "month":
                return <MonthView date={currentDate} events={events} onDrop={onDrop} onDragStart={onDragStart} />;
            case "year":
                return <YearView date={currentDate} events={events} />;
            case "timeline":
                return <TimelineView events={events} onDragStart={onDragStart} />;
            default:
                return <MonthView date={currentDate} events={events} onDrop={onDrop} onDragStart={onDragStart} />;
        }
    };

    return (
        <div className="calendar-container">
            <header>
                <div>
                    {views.map(v => (
                        <button key={v} onClick={() => changeView(v)}>
                            {v}
                        </button>
                    ))}
                </div>
            </header>
            {renderView()}
        </div>
    );
};

export default CalendarCustom;
