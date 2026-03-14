"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = "Escreva o conteúdo aqui..." }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "tiptap prose prose-gray max-w-none focus:outline-none min-h-[300px]",
      },
    },
  });

  // Sync external value changes
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  const ToolbarBtn = ({
    onClick,
    active,
    title,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      className={`p-1.5 rounded text-sm transition-colors ${
        active
          ? "bg-brand-blue text-white"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand-blue focus-within:border-transparent">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Negrito"
        >
          <strong>B</strong>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Itálico"
        >
          <em>I</em>
        </ToolbarBtn>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Título H2"
        >
          H2
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Título H3"
        >
          H3
        </ToolbarBtn>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Lista"
        >
          ≡
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Lista numerada"
        >
          1.
        </ToolbarBtn>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarBtn
          onClick={() => {
            const url = window.prompt("URL do link:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          active={editor.isActive("link")}
          title="Inserir link"
        >
          🔗
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => {
            const url = window.prompt("URL da imagem:");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
          active={false}
          title="Inserir imagem"
        >
          🖼
        </ToolbarBtn>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarBtn
          onClick={() => editor.chain().focus().undo().run()}
          active={false}
          title="Desfazer"
        >
          ↩
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().redo().run()}
          active={false}
          title="Refazer"
        >
          ↪
        </ToolbarBtn>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
