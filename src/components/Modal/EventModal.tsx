import { createElement, FC, useEffect, useState } from "react";

import { CalendarEvent, ResourceProps } from "../EventCalendar";
import TextEditor from "./TextEditor";
import { CloseIcon } from "src/icon/icon";

interface ModalProps {
    hideModal: () => void;
    handleSubmit: () => void;
    eventData: CalendarEvent;
    setEventData: React.Dispatch<React.SetStateAction<CalendarEvent>>;
    resources: ResourceProps[];
}

const EventModal: FC<ModalProps> = props => {
    const { hideModal, handleSubmit, eventData, setEventData, resources } = props;

    const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
    const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

    // Auto-select Parent & Child if eventData.resourceIds is set
    useEffect(() => {
        if (eventData.resourceIds) {
            const id = eventData.resourceIds[0];
            if (!id) return;
            const parent = resources.find(res => res.id === Number(id));
            if (parent) {
                setSelectedParentId(parent.id);
                setSelectedChildId(null);
            } else {
                const parentResource = resources.find(res => res.children?.some(child => child.id === Number(id)));
                if (parentResource) {
                    setSelectedParentId(parentResource.id);
                    setSelectedChildId(id);
                }
            }
        }
    }, [eventData.resourceIds, resources]);

    const selectedParent = resources.find(res => res.id === selectedParentId);

    return (
        <div className="modal-overlay">
            <div className="custom-modal">
                <div className="close-btn" onClick={hideModal}>
                    <CloseIcon width="20px" height="20px" />
                </div>
                <h2>{eventData.id ? "Edit Event" : "Add Event"}</h2>
                <div className="time-wrapper">
                    <div>
                        <label>Start Time:</label>
                        <input
                            type="datetime-local"
                            value={eventData.start as any}
                            onChange={e => setEventData({ ...eventData, start: e.target.value as any })}
                        />
                    </div>
                    <div>
                        <label>End Time:</label>
                        <input
                            type="datetime-local"
                            value={eventData.end as any}
                            onChange={e => setEventData({ ...eventData, end: e.target.value as any })}
                        />
                    </div>
                    <div>
                        <label>Parent Resource:</label>
                        <select
                            value={selectedParentId ?? ""}
                            onChange={e => {
                                const parentId = parseInt(e.target.value);
                                setSelectedParentId(parentId);
                                setSelectedChildId(null);
                                setEventData({ ...eventData, resourceIds: [parentId] });
                            }}
                        >
                            <option value="">Select Parent Resource</option>
                            {resources.map(resource => (
                                <option key={resource.id} value={resource.id}>
                                    {resource.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    {selectedParent?.children && selectedParent.children.length > 0 && (
                        <div>
                            <label>Children Resource:</label>
                            <select
                                value={selectedChildId ?? ""}
                                onChange={e => {
                                    const childId = parseInt(e.target.value);
                                    setSelectedChildId(childId);
                                    setEventData({ ...eventData, resourceIds: [childId] });
                                }}
                            >
                                <option value="">Select Child Resource</option>
                                {selectedParent.children.map(child => (
                                    <option key={child.id} value={child.id}>
                                        {child.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={eventData.title}
                        onChange={e => setEventData({ ...eventData, title: e.target.value })}
                    />
                </div>
                <div>
                    <TextEditor eventData={eventData} setEventData={setEventData} />
                </div>
                <div className="modal-buttons">
                    <button onClick={handleSubmit}>Save</button>
                    <button onClick={hideModal}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EventModal;
