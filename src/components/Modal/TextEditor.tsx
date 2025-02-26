import { createElement, FC, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CalendarEvent } from "../EventCalendar";

interface TextEditorProps {
    eventData: CalendarEvent;
    setEventData?: React.Dispatch<React.SetStateAction<CalendarEvent>>;
    readOnly?: boolean;
}

const TextEditor: FC<TextEditorProps> = ({ eventData, setEventData, readOnly = false }) => {
    const quillRef = useRef(null);
    const handleChange = (e: string) => {
        if (setEventData) {
            setEventData({
                ...eventData,
                extendedProps: { description: e }
            });
        }
    };

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
            ["link", "image", "code-block"],
            ["clean"],
            [
                {
                    imageResize: {
                        modules: ["Resize", "DisplaySize", "Toolbar"]
                    }
                }
            ]
        ]
    };

    return (
        <div className="text-editor">
            <ReactQuill
                ref={quillRef}
                theme="snow"
                modules={modules}
                value={eventData.extendedProps.description}
                onChange={handleChange}
                readOnly={readOnly}
            />
        </div>
    );
};

export default TextEditor;
