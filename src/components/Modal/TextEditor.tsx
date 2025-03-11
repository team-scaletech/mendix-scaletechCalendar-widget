import { createElement, FC, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CalendarEvent } from "../EventCalendar";

interface TextEditorProps {
    eventObject: CalendarEvent;
    setEventObject?: React.Dispatch<React.SetStateAction<CalendarEvent>>;
    readOnly?: boolean;
}

const TextEditor: FC<TextEditorProps> = ({ eventObject, setEventObject, readOnly = false }) => {
    const quillRef = useRef<ReactQuill>(null);
    const handleChange = (content: string) => {
        if (setEventObject) {
            setEventObject({
                ...eventObject,
                extendedProps: { description: content }
            });
        }
    };

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
            ["link", "image", "code-block"],
            ["clean"]
        ]
    };

    return (
        <div className="text-editor">
            <ReactQuill
                ref={quillRef}
                theme="snow"
                modules={modules}
                value={eventObject.extendedProps.description || ""}
                onChange={handleChange}
                readOnly={readOnly}
            />
        </div>
    );
};

export default TextEditor;
