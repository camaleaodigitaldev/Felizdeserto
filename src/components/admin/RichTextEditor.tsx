"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { useEffect, useRef } from "react";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus,
  Link as LinkIcon, Image as ImageIcon,
  Undo2, Redo2, Highlighter,
  Subscript as SubscriptIcon, Superscript as SuperscriptIcon,
  Type, X,
} from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = "Escreva o conteúdo aqui..." }: Props) {
  const colorInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-brand-blue underline" } }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "tiptap prose prose-gray max-w-none focus:outline-none min-h-[420px] p-5 text-gray-800 leading-relaxed [&_[data-text-align=justify]]:text-justify [&_[data-text-align=center]]:text-center [&_[data-text-align=right]]:text-right",
      },
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  // ── Toolbar helpers ────────────────────────────────────────────────────
  const Btn = ({
    onClick, active = false, title, disabled = false, children,
  }: {
    onClick: () => void;
    active?: boolean;
    title: string;
    disabled?: boolean;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      disabled={disabled}
      className={`p-1.5 rounded transition-colors disabled:opacity-30 ${
        active
          ? "bg-brand-blue text-white shadow-sm"
          : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-5 bg-gray-300 mx-0.5" />;

  const handleSetLink = () => {
    const prev = editor.getAttributes("link").href ?? "";
    const url = window.prompt("URL do link:", prev);
    if (url === null) return;
    if (url === "") { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().setLink({ href: url }).run();
  };

  const handleSetImage = () => {
    const url = window.prompt("URL da imagem:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand-blue focus-within:border-transparent">

      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-2 border-b border-gray-200 bg-gray-50">

        {/* Headings */}
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })} title="Título H1">
          <Heading1 size={15} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })} title="Título H2">
          <Heading2 size={15} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })} title="Título H3">
          <Heading3 size={15} />
        </Btn>

        <Divider />

        {/* Inline formatting */}
        <Btn onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")} title="Negrito (Ctrl+B)">
          <Bold size={15} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")} title="Itálico (Ctrl+I)">
          <Italic size={15} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")} title="Sublinhado (Ctrl+U)">
          <UnderlineIcon size={15} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")} title="Tachado">
          <Strikethrough size={15} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleSubscript().run()}
          active={editor.isActive("subscript")} title="Subscrito">
          <SubscriptIcon size={15} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleSuperscript().run()}
          active={editor.isActive("superscript")} title="Sobrescrito">
          <SuperscriptIcon size={15} />
        </Btn>

        <Divider />

        {/* Text alignment */}
        <Btn onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })} title="Alinhar à esquerda">
          <AlignLeft size={15} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })} title="Centralizar">
          <AlignCenter size={15} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })} title="Alinhar à direita">
          <AlignRight size={15} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          active={editor.isActive({ textAlign: "justify" })} title="Justificar">
          <AlignJustify size={15} />
        </Btn>

        <Divider />

        {/* Lists & blocks */}
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")} title="Lista com marcadores">
          <List size={15} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")} title="Lista numerada">
          <ListOrdered size={15} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")} title="Citação">
          <Quote size={15} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()}
          active={false} title="Linha divisória">
          <Minus size={15} />
        </Btn>

        <Divider />

        {/* Color & highlight */}
        <div className="relative flex items-center" title="Cor do texto">
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); colorInputRef.current?.click(); }}
            className="p-1.5 rounded text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
            title="Cor do texto"
          >
            <Type size={15} />
            <span
              className="block h-0.5 w-3.5 rounded mt-0.5 mx-auto"
              style={{ backgroundColor: editor.getAttributes("textStyle").color ?? "#1e293b" }}
            />
          </button>
          <input
            ref={colorInputRef}
            type="color"
            className="sr-only"
            defaultValue="#1e293b"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          />
          {editor.isActive("textStyle", { color: /.*/ }) && (
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetColor().run(); }}
              className="p-0.5 rounded text-gray-400 hover:text-red-500"
              title="Remover cor"
            >
              <X size={10} />
            </button>
          )}
        </div>
        <Btn onClick={() => editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run()}
          active={editor.isActive("highlight")} title="Destaque (marcador)">
          <Highlighter size={15} />
        </Btn>

        <Divider />

        {/* Link & image */}
        <Btn onClick={handleSetLink} active={editor.isActive("link")} title="Inserir / editar link">
          <LinkIcon size={15} />
        </Btn>
        {editor.isActive("link") && (
          <Btn onClick={() => editor.chain().focus().unsetLink().run()} active={false} title="Remover link">
            <X size={13} />
          </Btn>
        )}
        <Btn onClick={handleSetImage} active={false} title="Inserir imagem por URL">
          <ImageIcon size={15} />
        </Btn>

        <Divider />

        {/* History */}
        <Btn onClick={() => editor.chain().focus().undo().run()}
          active={false} disabled={!editor.can().undo()} title="Desfazer (Ctrl+Z)">
          <Undo2 size={15} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()}
          active={false} disabled={!editor.can().redo()} title="Refazer (Ctrl+Y)">
          <Redo2 size={15} />
        </Btn>
      </div>

      {/* ── Editor area ─────────────────────────────────────────────────── */}
      <EditorContent editor={editor} />

      {/* ── Status bar ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 px-3 py-1.5 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">
        <span>
          {editor.storage.characterCount?.characters?.() ?? 0} caracteres
        </span>
        <span>
          {editor.storage.characterCount?.words?.() ?? 0} palavras
        </span>
      </div>
    </div>
  );
}
