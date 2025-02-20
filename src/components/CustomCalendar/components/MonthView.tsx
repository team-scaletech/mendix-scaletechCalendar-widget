import React, { createElement, useState } from "react";
import { ViewProps } from "../CustomCalendar";
import Modal from "./Modal";

const MonthView: React.FC<ViewProps> = ({ date, events }) => {
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const monthYear = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(date);
    const [isShowModal, SetIsShowModal] = useState(false);
    const [selectDate, setSelectDate] = useState("");

    const handleDayClick = (fullDate: string) => {
        const currentTime = new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false // Use 24-hour format
        });
        SetIsShowModal(true);
        console.warn("Selected Date & Time:", `${fullDate} ${currentTime}`);
        setSelectDate(`${fullDate} ${currentTime}`);
    };

    return (
        <div className="month-grid">
            <h2 className="heading-text">{monthYear}</h2>
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
                    const fullDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
                        day
                    ).padStart(2, "0")}`;
                    const dayEvents = events.filter(evt => evt.date === fullDate);

                    return (
                        <div key={day} className="day" onClick={() => handleDayClick(fullDate)}>
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
            <Modal
                isShowModal={isShowModal}
                hideModal={() => SetIsShowModal(false)}
                handleSubmit={() => console.warn("test")}
                date={selectDate}
            />
        </div>
    );
};

export default MonthView;
