import { createElement, FC, useState } from "react";

interface ModalProps {
    isShowModal: boolean;
    hideModal: () => void;
    handleSubmit: () => void;
    date: string;
}

const Modal: FC<ModalProps> = props => {
    const { isShowModal, hideModal, handleSubmit } = props;
    const [eventData, setEventData] = useState({
        id: "",
        title: "",
        start: new Date().toISOString().slice(0, 16),
        end: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString().slice(0, 16),
        type: "work"
    });
    console.warn("sta", eventData.start);
    return (
        <div>
            {isShowModal && (
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
                                    value={eventData.start}
                                    onChange={e => setEventData({ ...eventData, start: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>End Time:</label>
                                <input
                                    type="datetime-local"
                                    value={eventData.end}
                                    onChange={e => setEventData({ ...eventData, end: e.target.value })}
                                />
                            </div>
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
                                value={eventData.type}
                                onChange={e => setEventData({ ...eventData, type: e.target.value })}
                            />
                        </div>
                        <div className="modal-buttons">
                            <button onClick={handleSubmit}>Save</button>
                            <button onClick={hideModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Modal;
