"use client";

import { useEffect, useRef } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichEditor({ value, onChange, placeholder }: RichEditorProps) {
  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
      ],
    },
    placeholder: placeholder || "Tulis deskripsi...",
  });

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (quill) {
      if (isInitialMount.current && value) {
        quill.clipboard.dangerouslyPasteHTML(value);
        isInitialMount.current = false;
      }

      quill.on("text-change", () => {
        onChange(quill.root.innerHTML);
      });
    }
  }, [quill, value, onChange]);

  return (
    <div className="rich-editor-wrapper">
      <div ref={quillRef} />
      <style jsx global>{`
        .ql-container {
          font-family: inherit;
          font-size: 0.875rem;
        }
        .ql-editor {
          min-height: 120px;
          max-height: 240px;
          overflow-y: auto;
        }
        .ql-toolbar {
          border: 1px solid #e4e4e7;
          border-bottom: none;
          border-radius: 0.75rem 0.75rem 0 0;
          background: #fafafa;
        }
        .ql-container {
          border: 1px solid #e4e4e7;
          border-radius: 0 0 0.75rem 0.75rem;
        }
        .ql-editor.ql-blank::before {
          color: #a1a1aa;
          font-style: normal;
        }
      `}</style>
    </div>
  );
}
