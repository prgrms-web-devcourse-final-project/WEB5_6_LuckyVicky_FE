'use client';

import { useCallback } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import DOMPurify from 'dompurify';

import Undo from '@/assets/icon/undo.svg';
import Redo from '@/assets/icon/redo.svg';
import LeftAlign from '@/assets/icon/left_align.svg';
import CenterAlign from '@/assets/icon/center_align.svg';
import RightAlign from '@/assets/icon/right_align.svg';
import BoldIcon from '@/assets/icon/bold.svg';
import ItalicIcon from '@/assets/icon/italic.svg';
import UnderlineIcon from '@/assets/icon/underline.svg';
import CircleList from '@/assets/icon/circle_list.svg';
import NumberList from '@/assets/icon/number_list.svg';
import Photo from '@/assets/icon/photo.svg';

export default function NoticeEditor({
  value,
  onChange,
  onUploadImage, // (file) => Promise<string>  // 업로드 후 URL 반환
  minHeight = 280,
  maxHeight,
}: {
  value?: string; // 초기 HTML
  onChange: (html: string) => void;
  onUploadImage: (file: File) => Promise<string>;
  minHeight?: number;
  maxHeight?: number;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder: '내용을 입력해 주세요.' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value ?? '',
    autofocus: false,
    shouldRerenderOnTransaction: false,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      // XSS 방어: 저장 전 정화
      const dirty = editor.getHTML();
      const clean = DOMPurify.sanitize(dirty, { USE_PROFILES: { html: true } });
      onChange(clean);
    },
  });

  const isAligned = (align: 'left' | 'center' | 'right') => {
    if (!editor) return false;
    return (
      editor.isActive('paragraph', { textAlign: align }) ||
      editor.isActive('heading', { textAlign: align })
    );
  };

  const insertImage = useCallback(
    async (file: File) => {
      if (!editor) return;
      const url = await onUploadImage(file); // presigned 업로드 등
      editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    },
    [editor, onUploadImage],
  );

  if (!editor) return null;

  return (
    <div className="rounded overflow-hidden border border-[var(--color-gray-200)]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-[var(--color-gray-200)] bg-[var(--color-gray-10)] px-2 py-1">
        <Btn on={() => editor.commands.undo()}>
          <Undo className="block h-4 w-4" />
        </Btn>
        <Btn on={() => editor.commands.redo()}>
          <Redo className="block h-4 w-4" />
        </Btn>

        <div className="flex items-center">
          <Btn
            on={() => editor.chain().focus().setTextAlign('left').run()}
            active={isAligned('left')}
          >
            <LeftAlign className="block h-4 w-4" />
          </Btn>
          <Btn
            on={() => editor.chain().focus().setTextAlign('center').run()}
            active={isAligned('center')}
          >
            <CenterAlign className="block h-4 w-4" />
          </Btn>
          <Btn
            on={() => editor.chain().focus().setTextAlign('right').run()}
            active={isAligned('right')}
          >
            <RightAlign className="block h-4 w-4" />
          </Btn>
        </div>

        <Btn
          on={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
        >
          <BoldIcon className="block h-4 w-4" />
        </Btn>
        <Btn
          on={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
        >
          <ItalicIcon className="block h-4 w-4" />
        </Btn>
        <Btn
          on={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
        >
          <UnderlineIcon className="block h-4 w-4" />
        </Btn>
        <Sep />
        <Btn
          on={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
        >
          <CircleList className="block h-4 w-4" />
        </Btn>
        <Btn
          on={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
        >
          <NumberList className="block h-4 w-4" />
        </Btn>
        <Sep />

        <input
          id="imgInput"
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) insertImage(f);
            e.currentTarget.value = '';
          }}
        />
        <label
          htmlFor="imgInput"
          className="cursor-pointer rounded px-2 py-1 text-sm hover:bg-[var(--color-gray-100)]"
        >
          <Photo className="block h-4 w-4" />
        </label>
      </div>

      {/* Editor body */}
      <EditorContent
        editor={editor}
        className="bg-white p-3 focus:outline-none [&_*]:leading-7"
        style={{
          minHeight,
          maxHeight,                
          overflowY: maxHeight ? 'auto' : undefined, // 최대 높이 있을 때만 스크롤
        }}
      />
    </div>
  );
}

function Btn({
  on,
  children,
  active,
}: {
  on: () => void;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={on}
      className={`rounded inline-flex items-center px-2 py-1 leading-none text-sm hover:bg-[var(--color-gray-100)] ${active ? 'bg-[var(--color-gray-100)] font-semibold' : ''}`}
    >
      {children}
    </button>
  );
}
function Sep() {
  return <span className="mx-1 h-5 w-px bg-[var(--color-gray-200)]" />;
}
