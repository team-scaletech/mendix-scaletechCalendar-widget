/**
 * This file was generated from ScaletechCalendar.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, EditableValue, ListValue, ListAttributeValue, ListReferenceValue, ListReferenceSetValue } from "mendix";
import { Big } from "big.js";

export interface ScaletechCalendarContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    eventData: ListValue;
    eventId?: ListAttributeValue<Big>;
    startDate: ListAttributeValue<string>;
    endDate: ListAttributeValue<string>;
    titleData: ListAttributeValue<string>;
    descriptionData: ListAttributeValue<string>;
    parentResource: ListAttributeValue<string>;
    childrenResource: ListAttributeValue<string>;
    childrenData: ListValue;
    childrenResourceId: ListAttributeValue<Big>;
    childrenTitle: ListAttributeValue<string>;
    parentDataAssociation: ListReferenceValue | ListReferenceSetValue;
    parentData: ListValue;
    parentResourceId: ListAttributeValue<Big>;
    parentTitle: ListAttributeValue<string>;
    createEventId?: EditableValue<Big>;
    createStartDate?: EditableValue<string>;
    createEndDate?: EditableValue<string>;
    createTitleData?: EditableValue<string>;
    createDescriptionData?: EditableValue<string>;
    createParentId?: EditableValue<Big>;
    createParentName?: EditableValue<string>;
    createChildId?: EditableValue<Big>;
    createChildName?: EditableValue<string>;
    saveEventAction?: ActionValue;
    saveResourceAction?: ActionValue;
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
    eventId: string;
    startDate: string;
    endDate: string;
    titleData: string;
    descriptionData: string;
    parentResource: string;
    childrenResource: string;
    childrenData: {} | { caption: string } | { type: string } | null;
    childrenResourceId: string;
    childrenTitle: string;
    parentDataAssociation: string;
    parentData: {} | { caption: string } | { type: string } | null;
    parentResourceId: string;
    parentTitle: string;
    createEventId: string;
    createStartDate: string;
    createEndDate: string;
    createTitleData: string;
    createDescriptionData: string;
    createParentId: string;
    createParentName: string;
    createChildId: string;
    createChildName: string;
    saveEventAction: {} | null;
    saveResourceAction: {} | null;
}
