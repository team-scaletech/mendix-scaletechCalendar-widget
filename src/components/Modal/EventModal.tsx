import { createElement, FC, SetStateAction, useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { CalendarEvent, ResourceProps } from "../EventCalendar";

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
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    console.warn("editorState", editorState);
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

    const onEditorStateChange = function (editorState: any) {
        setEditorState(editorState);
        const { blocks } = convertToRaw(editorState.getCurrentContent());
        console.warn("block", blocks);
        /*let text = blocks.reduce((acc, item) => {
          acc = acc + item.text;
          return acc;
        }, "");*/
        let text = editorState.getCurrentContent().getPlainText("\u0001");
        console.warn("text", text);
    };
    return (
        <div className="modal-overlay">
            <div className="custom-modal">
                <div className="close-btn" onClick={hideModal}>
                    <svg viewBox="0 0 30 30" width="20px" height="20px">
                        <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z" />
                    </svg>
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
                    <label>Type:</label>
                    <input
                        type="text"
                        value={eventData.extendedProps.type}
                        onChange={e =>
                            setEventData({
                                ...eventData,
                                extendedProps: { type: e.target.value, description: "" }
                            })
                        }
                    />
                </div>
                <div>
                    <Editor
                        editorState={editorState}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                        onEditorStateChange={onEditorStateChange}
                    />
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
