import React, { createElement } from "react";

interface EventType {
    id: number;
    title: string;
    startTime: string; // Format: YYYY-MM-DDTHH:mm (ISO 8601)
    endTime: string; // Format: YYYY-MM-DDTHH:mm
}

interface WeekViewProps {
    startDate: Date; // The starting Sunday of the week
    events: EventType[];
}

const WeekView: React.FC<WeekViewProps> = ({ startDate, events }) => {
    const days = Array.from(
        { length: 7 },
        (_, i) => new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i)
    );
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const monthYear = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(startDate);

    return (
        <div className="week-view">
            <h2 className="heading-text">{monthYear}</h2>

            {/* Grid Layout for Time & Events */}
            <div className="day-grid">
                {/* Time Column (Left Side) */}
                <div className="time-column">
                    <div className="time-slot" />
                    <div className="time-slot">All-day</div>
                    {hours.map(hour => (
                        <div key={hour} className="time-slot">
                            {hour === 0 ? "12am" : hour < 12 ? `${hour}am` : hour === 12 ? "12pm" : `${hour - 12}pm`}
                        </div>
                    ))}
                </div>

                {/* Events Column (7 Days) */}

                <div className="events-column week-events-column">
                    {days.map((day, dayIndex) => (
                        <div key={dayIndex} className="day-column">
                            {hours.map((hour, hourIndex) => {
                                // Find events matching this day and hour
                                const matchingEvents = events.filter(event => {
                                    const eventDate = new Date(event.startTime);
                                    return (
                                        eventDate.toDateString() === day.toDateString() && eventDate.getHours() === hour
                                    );
                                });

                                return (
                                    <div key={hourIndex} className="event-slot">
                                        {hourIndex === 0 ? (
                                            <div key={hourIndex} className="day-header week-header-text event-slot">
                                                {day.toLocaleDateString("en-US", {
                                                    weekday: "short",
                                                    month: "numeric",
                                                    day: "numeric"
                                                })}
                                            </div>
                                        ) : (
                                            <div>
                                                {matchingEvents.map(event => (
                                                    <div
                                                        key={event.id}
                                                        className="event"
                                                        style={{
                                                            top: `${hourIndex * 50}px`,
                                                            height: `${
                                                                ((new Date(event.endTime).getTime() -
                                                                    new Date(event.startTime).getTime()) /
                                                                    3600000) *
                                                                50
                                                            }px`
                                                        }}
                                                    >
                                                        {event.title}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WeekView;
