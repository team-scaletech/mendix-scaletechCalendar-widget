import { FC, ReactElement, createElement } from "react";
import { ScaletechCalendarPreviewProps } from "../typings/ScaletechCalendarProps";
import CalendarComponent from "./components/FullCalendar";

export const preview: FC<ScaletechCalendarPreviewProps> = (): ReactElement => {
    return <CalendarComponent />;
};

export function getPreviewCss(): string {
    return require("./ui/ScaletechCalendar.css");
}
