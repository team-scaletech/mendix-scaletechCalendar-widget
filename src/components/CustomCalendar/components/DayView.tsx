import React, { createElement } from "react";

interface EventType {
    id: number;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
}

interface DayViewProps {
    date: Date;
    events: EventType[];
    onDrop: (event: React.DragEvent<HTMLDivElement>, newDate: string) => void;
}

const DayView: React.FC<DayViewProps> = ({ date, events, onDrop }) => {
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

    return (
        <div className="day-view">
            <h2>{date.toDateString()}</h2>
            <div className="day-grid">
                {/* Time Column */}
                <div className="time-column">
                    <div className="time-slot">all-day</div>
                    {hours.map((_hour, i) => (
                        <div key={i} className="time-slot">
                            {i === 0 ? "12am" : i < 12 ? `${i}am` : i === 12 ? "12pm" : `${i - 12}pm`}
                        </div>
                    ))}
                </div>

                {/* Events Column */}
                <div
                    className="events-column"
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => onDrop(e, date.toISOString().split("T")[0])}
                >
                    <div className="event-slot" />
                    {hours.map((hour, index) => {
                        const matchingEvents = events.filter(evt => evt.startTime?.startsWith(hour));

                        return (
                            <div key={index} className="event-slot">
                                {/* Two Equal 30-Minute Sections */}
                                <div className="half-slot top-half"></div>
                                <div className="half-slot bottom-half"></div>

                                {/* Events */}
                                {matchingEvents.map(evt => (
                                    <div
                                        key={evt.id}
                                        className="event"
                                        style={{
                                            top: `${getEventTop(evt.startTime)}px`, // Adjust top positioning
                                            height: calculateEventHeight(evt.startTime, evt.endTime)
                                        }}
                                        draggable
                                        onDragStart={e => e.dataTransfer.setData("eventId", String(evt.id))}
                                    >
                                        {evt.startTime} - {evt.endTime} <br />
                                        {evt.title}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// Helper function to determine event top position based on start time
const getEventTop = (startTime: string | undefined) => {
    if (!startTime) return 0;
    const minutes = parseInt(startTime.split(":")[1], 10);
    return minutes >= 30 ? 25 : 0; // If event starts at 30 min mark, shift down
};

// Helper function to calculate event height dynamically
const calculateEventHeight = (startTime: string | undefined, endTime: string | undefined) => {
    if (!startTime || !endTime) return "50px"; // Default height for 1-hour slot
    const [startHour, startMinutes] = startTime.split(":").map(Number);
    const [endHour, endMinutes] = endTime.split(":").map(Number);

    const startTotalMinutes = startHour * 60 + startMinutes;
    const endTotalMinutes = endHour * 60 + endMinutes;
    const durationMinutes = endTotalMinutes - startTotalMinutes;

    return `${(durationMinutes / 60) * 50}px`; // Each hour slot is 50px
};

export default DayView;
