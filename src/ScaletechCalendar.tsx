import { FC, ReactElement, createElement } from "react";

import { ScaletechCalendarContainerProps } from "../typings/ScaletechCalendarProps";
import EventCalendar from "./components/EventCalendar";

import "./ui/ScaletechCalendar.css";

export const ScaletechCalendar: FC<ScaletechCalendarContainerProps> = (): ReactElement => {
    return <EventCalendar />;
};
