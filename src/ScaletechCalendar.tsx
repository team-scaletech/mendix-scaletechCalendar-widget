// import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
import "@event-calendar/core/index.css";
import { FC, ReactElement, createElement } from "react";

import { ScaletechCalendarContainerProps } from "../typings/ScaletechCalendarProps";
import EventCalendar from "./components/EventCalendar";

import "./ui/ScaletechCalendar.css";

export const ScaletechCalendar: FC<ScaletechCalendarContainerProps> = (): ReactElement => {
    return <EventCalendar />;
};
