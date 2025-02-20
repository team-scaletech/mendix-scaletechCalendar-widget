import { FC, ReactElement, createElement } from "react";
import { ScaletechCalendarPreviewProps } from "../typings/ScaletechCalendarProps";
import CalendarCustom from "./components/CustomCalendar/CustomCalendar";

export const preview: FC<ScaletechCalendarPreviewProps> = (): ReactElement => {
    return <CalendarCustom />;
};

export function getPreviewCss(): string {
    return require("./ui/ScaletechCalendar.css");
}
