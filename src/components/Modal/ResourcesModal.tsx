import { createElement, FC, useState } from "react";
import { ResourceProps } from "../EventCalendar";
import { CloseIcon } from "src/icon/icon";

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
                    <CloseIcon width="20px" height="20px" />
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
