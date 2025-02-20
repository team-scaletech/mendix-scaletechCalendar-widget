import React, { createElement } from "react";
type EventType = {
    id: number;
    title: string;
    date: string;
    time: string;
};

interface TimelineProps {
    events: EventType[];
    onDragStart: (event: React.DragEvent<HTMLDivElement>, id: number) => void;
}
const TimelineView: React.FC<TimelineProps> = ({ events, onDragStart }) => {
    return (
        <div className="timeline-view">
            {events.map(evt => (
                <div key={evt.id} className="event" draggable onDragStart={e => onDragStart(e, evt.id)}>
                    {evt.title} - {evt.date} ({evt.time})
                </div>
            ))}
        </div>
    );
};

export default TimelineView;
