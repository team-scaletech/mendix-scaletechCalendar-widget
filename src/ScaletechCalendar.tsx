// import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap-icons/font/bootstrap-icons.css";

import { FC, ReactElement, createElement } from "react";

import { ScaletechCalendarContainerProps } from "../typings/ScaletechCalendarProps";
import CalendarCustom from "./components/CustomCalendar/CustomCalendar";

import "./ui/ScaletechCalendar.css";

export const ScaletechCalendar: FC<ScaletechCalendarContainerProps> = (): ReactElement => {
    return <CalendarCustom />;
};
