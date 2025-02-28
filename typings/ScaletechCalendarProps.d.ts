/**
 * This file was generated from ScaletechCalendar.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ListValue, ListAttributeValue, ListReferenceValue, ListReferenceSetValue } from "mendix";

export interface ScaletechCalendarContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    eventData: ListValue;
    StartDate: ListAttributeValue<Date | string>;
    EndDate: ListAttributeValue<Date | string>;
    TitleData: ListAttributeValue<string>;
    DescriptionData: ListAttributeValue<string>;
    childrenData: ListValue;
    childrenTitle: ListAttributeValue<string>;
    parentDataAssociation: ListReferenceValue | ListReferenceSetValue;
    parentData: ListValue;
    parentTitle: ListAttributeValue<string>;
}

export interface ScaletechCalendarPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode: "design" | "xray" | "structure";
    translate: (text: string) => string;
    eventData: {} | { caption: string } | { type: string } | null;
    StartDate: string;
    EndDate: string;
    TitleData: string;
    DescriptionData: string;
    childrenData: {} | { caption: string } | { type: string } | null;
    childrenTitle: string;
    parentDataAssociation: string;
    parentData: {} | { caption: string } | { type: string } | null;
    parentTitle: string;
}
