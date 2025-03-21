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
    eventParentResourceId: ListAttributeValue<Big>;
    eventChildrenResourceId: ListAttributeValue<Big>;
    eventColor: ListAttributeValue<string>;
    iconClass: ListAttributeValue<string>;
    childrenData: ListValue;
    childrenResourceId: ListAttributeValue<Big>;
    childrenTitle: ListAttributeValue<string>;
    parentDataAssociation: ListReferenceValue | ListReferenceSetValue;
    parentData: ListValue;
    parentResourceId: ListAttributeValue<Big>;
    parentTitle: ListAttributeValue<string>;
    isDescription: boolean;
    createEventId?: EditableValue<Big>;
    createStartDate?: EditableValue<string>;
    createEndDate?: EditableValue<string>;
    createTitleData?: EditableValue<string>;
    createDescriptionData?: EditableValue<string>;
    createEventParentId?: EditableValue<Big>;
    createEventChildrenId?: EditableValue<Big>;
    createEventColor?: EditableValue<string>;
    createIconClass?: EditableValue<string>;
    createParentId?: EditableValue<Big>;
    createParentName?: EditableValue<string>;
    createChildId?: EditableValue<Big>;
    createChildName?: EditableValue<string>;
    eventDropAction?: ActionValue;
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
    eventParentResourceId: string;
    eventChildrenResourceId: string;
    eventColor: string;
    iconClass: string;
    childrenData: {} | { caption: string } | { type: string } | null;
    childrenResourceId: string;
    childrenTitle: string;
    parentDataAssociation: string;
    parentData: {} | { caption: string } | { type: string } | null;
    parentResourceId: string;
    parentTitle: string;
    isDescription: boolean;
    createEventId: string;
    createStartDate: string;
    createEndDate: string;
    createTitleData: string;
    createDescriptionData: string;
    createEventParentId: string;
    createEventChildrenId: string;
    createEventColor: string;
    createIconClass: string;
    createParentId: string;
    createParentName: string;
    createChildId: string;
    createChildName: string;
    eventDropAction: {} | null;
    saveEventAction: {} | null;
    saveResourceAction: {} | null;
}
