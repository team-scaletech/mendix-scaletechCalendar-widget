import { FC, ReactElement, createElement } from "react";
import { ScaletechCalendarPreviewProps } from "../typings/ScaletechCalendarProps";
import EventCalendar from "./components/EventCalendar";

export const preview: FC<ScaletechCalendarPreviewProps> = (): ReactElement => {
    return <EventCalendar />;
};

export function getPreviewCss(): string {
    return require("./ui/ScaletechCalendar.css");
}
