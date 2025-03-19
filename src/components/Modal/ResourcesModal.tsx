import { createElement, FC, useState } from "react";
import { CloseIcon } from "src/icon/icon";
import { ResourcesModalProps } from "src/utils/interface";
import { generateLongId } from "../../utils/function";
import Big from "big.js";

const ResourcesModal: FC<ResourcesModalProps> = ({
    hideModal,
    resources,
    saveResourceAction,
    createParentId,
    createParentTitle,
    createChildId,
    createChildTitle
}) => {
    const [newResourceTitle, setNewResourceTitle] = useState("");
    const [parentResourceId, setParentResourceId] = useState<number | "new">("new");

    const handleAddResource = () => {
        if (!newResourceTitle.trim()) return;
        const numericId = new Big(generateLongId());

        if (parentResourceId === "new") {
            createParentId?.setValue(numericId);
            createParentTitle?.setValue(newResourceTitle);
        } else {
            createParentId?.setValue(new Big(parentResourceId));
            createChildId?.setValue(numericId);
            createChildTitle?.setValue(newResourceTitle);
        }
        if (saveResourceAction?.canExecute) {
            saveResourceAction.execute();
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
