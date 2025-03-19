import { CSSProperties, ReactNode } from "react";
import { ActionValue, EditableValue } from "mendix";

export interface EventVale {
    id: string;
    startDate: string;
    endDate: string;
    titleData: string;
    descriptionData: string;
    eventParentId: string;
    eventChildrenId: string;
    eventColor: string;
    iconClass: string;
}
export interface ResourceValue {
    id: string;
    title: string;
    children?: ResourceValue[];
}

export interface EventCalendarProps {
    eventValue?: EventVale[];
    resource?: ResourceProps[];
    saveEventAction?: ActionValue;
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
    createParentTitle?: EditableValue<string>;
    createChildId?: EditableValue<Big>;
    createChildTitle?: EditableValue<string>;
    saveResourceAction?: ActionValue;
    eventDropAction?: ActionValue;
    isDescription?: boolean;
    className?: string;
    style?: CSSProperties;
}

export interface CalendarEvent {
    id: string;
    resourceIds: number[];
    allDay: boolean;
    start: Date;
    end: Date;
    title: string;
    editable: boolean;
    startEditable: boolean;
    durationEditable: boolean;
    display: "auto" | "background" | "ghost" | "preview" | "pointer";
    backgroundColor: string;
    textColor: string;
    classNames: string[];
    styles: string[]; // Use classNames instead of styles
    extendedProps: {
        description: string;
        iconClass: string;
    };
}

export interface ResourceProps {
    id: number;
    title: string;
    children?: ResourceProps[];
}

export interface TextEditorProps {
    eventObject: CalendarEvent;
    setEventObject?: React.Dispatch<React.SetStateAction<CalendarEvent>>;
    readOnly?: boolean;
}

export interface ResourcesModalProps {
    hideModal: () => void;
    resources: ResourceProps[];
    createParentId?: EditableValue<Big>;
    createParentTitle?: EditableValue<string>;
    createChildId?: EditableValue<Big>;
    createChildTitle?: EditableValue<string>;
    saveResourceAction?: ActionValue;
}

export interface ModalProps {
    hideModal: () => void;
    handleSubmit: () => void;
    eventObject: CalendarEvent;
    setEventObject: React.Dispatch<React.SetStateAction<CalendarEvent>>;
    resources: ResourceProps[];
}

export interface EventDetailProps {
    hideModal: () => void;
    EditModalShow: () => void;
    eventObject: CalendarEvent;
    resources: ResourceProps[];
}

export interface TooltipProps {
    direction: string;
    content: string;
    children: ReactNode;
    delay?: number;
}
