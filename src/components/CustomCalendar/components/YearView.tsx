import React, { createElement } from "react";

interface EventType {
    id: number;
    title: string;
    date: string; // Format: YYYY-MM-DD
}

interface YearViewProps {
    date: Date;
    events: EventType[];
}

const YearView: React.FC<YearViewProps> = ({ date, events }) => {
    const months = Array.from({ length: 12 }, (_, i) => new Date(date.getFullYear(), i));

    return (
        <div className="year-view">
            {months.map((monthDate, index) => (
                <div key={index} className="month-container">
                    <h3>{monthDate.toLocaleString("default", { month: "long" })}</h3>
                    <MonthGrid monthDate={monthDate} events={events} />
                </div>
            ))}
        </div>
    );
};

const MonthGrid: React.FC<{ monthDate: Date; events: EventType[] }> = ({ monthDate, events }) => {
    const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).getDay();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <div className="month-grid">
            <div className="week-header">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div key={day} className="week-day">
                        {day}
                    </div>
                ))}
            </div>
            <div className="days-container">
                {Array.from({ length: firstDay }, (_, i) => (
                    <div key={`empty-${i}`} className="empty-day"></div>
                ))}
                {days.map(day => {
                    const fullDate = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(
                        2,
                        "0"
                    )}-${String(day).padStart(2, "0")}`;
                    const dayEvents = events.filter(evt => evt.date === fullDate);

                    return (
                        <div key={day} className="year-view-day">
                            {day}
                            {dayEvents.map(evt => (
                                <div key={evt.id} className="event">
                                    {evt.title}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default YearView;
