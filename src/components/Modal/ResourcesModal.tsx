import { createElement, FC, useState } from "react";
import { ResourceProps } from "../EventCalendar";

interface ResourcesModalProps {
    hideModal: () => void;
    resources: ResourceProps[];
    setResources: React.Dispatch<React.SetStateAction<ResourceProps[]>>;
}

const ResourcesModal: FC<ResourcesModalProps> = ({ hideModal, resources, setResources }) => {
    const [newResourceTitle, setNewResourceTitle] = useState("");
    const [parentResourceId, setParentResourceId] = useState<number | "new">("new");

    const handleAddResource = () => {
        if (!newResourceTitle.trim()) return;

        if (parentResourceId === "new") {
            // Create a new parent resource
            const newResource: ResourceProps = {
                id: Date.now(),
                title: newResourceTitle,
                children: []
            };
            setResources([...resources, newResource]);
        } else {
            // Add a new child to an existing resource
            setResources(
                resources.map(resource =>
                    resource.id === parentResourceId
                        ? {
                              ...resource,
                              children: [...(resource.children || []), { id: Date.now(), title: newResourceTitle }]
                          }
                        : resource
                )
            );
        }

        // Reset input
        setNewResourceTitle("");
        setParentResourceId("new");
        hideModal();
    };

    return (
        <div className="modal-overlay">
            <div className="custom-modal">
                <div className="close-btn" onClick={hideModal}>
                    <svg viewBox="0 0 30 30" width="20px" height="20px">
                        <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z" />
                    </svg>
                </div>
                <h3>Add New Resource</h3>
                <div>
                    <label>Resource Name:</label>
                    <input
                        type="text"
                        value={newResourceTitle}
                        onChange={e => setNewResourceTitle(e.target.value)}
                        placeholder="Enter resource name"
                    />
                </div>
                <div>
                    <label>Parent Resource:</label>
                    <select
                        value={parentResourceId}
                        onChange={e => setParentResourceId(e.target.value === "new" ? "new" : Number(e.target.value))}
                    >
                        <option value="new">Create as Parent Resource</option>
                        {resources.map(resource => (
                            <option key={resource.id} value={resource.id}>
                                {resource.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="modal-buttons">
                    <button onClick={handleAddResource}>Add Resource</button>
                    <button onClick={hideModal}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ResourcesModal;
