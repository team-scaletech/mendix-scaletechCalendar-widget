import { createElement, FC, useEffect, useState } from "react";
import {
    ChildResourceIcon,
    CloseIcon,
    DeleteIcon,
    EditIcon,
    EndTimeIcon,
    EventIcon,
    ParentResourceIcon,
    StartTimeIcon
} from "src/icon/icon";
import TextEditor from "./TextEditor";
import { EventDetailProps } from "src/utils/interface";

const EventDetail: FC<EventDetailProps> = props => {
    const { hideModal, EditModalShow, eventObject, resources } = props;
    const [selectedParent, setSelectedParent] = useState<string>("");
    const [selectedChild, setSelectedChild] = useState<string>("");

    // Auto-select Parent & Child if eventData.resourceIds is set
    useEffect(() => {
        if (eventObject.resourceIds) {
            const id = eventObject.resourceIds[0];
            if (!id) return;

            // Find the parent resource
            const parent = resources.find(res => res.id === Number(id));
            if (parent) {
                setSelectedParent(parent.title);
                setSelectedChild("");
            } else {
                // Find if the resource exists inside any parent's children
                const parentResource = resources.find(res => res.children?.some(child => child.id === Number(id)));
                if (parentResource) {
                    const childrenResource = parentResource.children?.find(child => child.id === Number(id));
                    setSelectedParent(parentResource.title);

                    if (childrenResource) {
                        setSelectedChild(childrenResource.title);
                    }
                }
            }
        }
    }, [eventObject.resourceIds, resources]);

    return (
        <div className="modal-overlay">
            <div className="custom-modal">
                <div className="modal-header-btn">
                    <div className="modal-btn" onClick={EditModalShow}>
                        <EditIcon width="20px" height="20px" />
                    </div>
                    <div className="modal-btn" onClick={hideModal}>
                        <DeleteIcon width="20px" height="20px" />
                    </div>
                    <div className="modal-btn" onClick={hideModal}>
                        <CloseIcon width="20px" height="20px" />
                    </div>
                </div>

                <div className="event-title-wrapper">
                    <div className="event-title">
                        <EventIcon height="22px" width="22px" style={{ marginTop: "8px" }} />
                        <div>
                            <h2>{eventObject.title}</h2>
                            <h6> {new Date(eventObject.start).toDateString()}</h6>
                        </div>
                    </div>
                </div>
                <div className="event-schedule-wrapper">
                    <div className="event-schedule">
                        <StartTimeIcon height="22px" width="22px" />
                        <p>{`${new Date(eventObject.start).getHours()}:${new Date(eventObject.start)
                            .getMinutes()
                            .toString()
                            .padStart(2, "0")}`}</p>
                    </div>
                    <div className="event-schedule">
                        <EndTimeIcon height="22px" width="22px" />
                        <p>{`${new Date(eventObject.end).getHours()}:${new Date(eventObject.end)
                            .getMinutes()
                            .toString()
                            .padStart(2, "0")}`}</p>
                    </div>

                    <div className="event-schedule">
                        <ParentResourceIcon height="22px" width="22px" />
                        <p>{selectedParent || "-"}</p>
                    </div>
                    <div className="event-schedule">
                        <ChildResourceIcon height="22px" width="22px" />
                        <p>{selectedChild || "-"}</p>
                    </div>
                </div>

                <div>
                    <TextEditor eventObject={eventObject} readOnly={true} />
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
