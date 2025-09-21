'use client';

import React, { useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '../ui/button';
import { 
  Bold, 
  Italic, 
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Save
} from 'lucide-react';

interface RichTextEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  onSave?: (content: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  showToolbar?: boolean;
  autoSave?: boolean;
  autoSaveDelay?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content = '',
  onChange,
  onSave,
  placeholder = 'Start writing your content...',
  className = '',
  readOnly = false,
  showToolbar = true,
  autoSave = true,
  autoSaveDelay = 2000
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 hover:text-blue-700 underline',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable: !readOnly,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !editor || !onSave) return;

    const timer = setTimeout(() => {
      const html = editor.getHTML();
      if (html !== content) {
        onSave(html);
      }
    }, autoSaveDelay);

    return () => clearTimeout(timer);
  }, [editor?.getHTML(), autoSave, autoSaveDelay, onSave, content]);

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);


  const handleSave = useCallback(() => {
    if (editor && onSave) {
      const html = editor.getHTML();
      onSave(html);
    }
  }, [editor, onSave]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-gray-500">Loading editor...</div>
      </div>
    );
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    children, 
    title 
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`h-8 w-8 p-0 ${isActive ? 'bg-blue-100 text-blue-700' : ''}`}
    >
      {children}
    </Button>
  );

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {showToolbar && (
        <div className="border-b border-gray-200 bg-gray-50 p-2">
          <div className="flex flex-wrap gap-1">
            {/* Text Formatting */}
            <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive('strike')}
                title="Strikethrough"
              >
                <Strikethrough className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                isActive={editor.isActive('code')}
                title="Inline Code"
              >
                <Code className="h-4 w-4" />
              </ToolbarButton>
            </div>

            {/* Headings */}
            <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
                title="Heading 1"
              >
                <Heading1 className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                title="Heading 2"
              >
                <Heading2 className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor.isActive('heading', { level: 3 })}
                title="Heading 3"
              >
                <Heading3 className="h-4 w-4" />
              </ToolbarButton>
            </div>

            {/* Lists */}
            <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
                title="Quote"
              >
                <Quote className="h-4 w-4" />
              </ToolbarButton>
            </div>

            {/* Media & Links */}
            <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
              <ToolbarButton
                onClick={addLink}
                isActive={editor.isActive('link')}
                title="Add Link"
              >
                <LinkIcon className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={addImage}
                title="Add Image"
              >
                <ImageIcon className="h-4 w-4" />
              </ToolbarButton>
            </div>

            {/* Code */}
            <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                isActive={editor.isActive('codeBlock')}
                title="Code Block"
              >
                <Code className="h-4 w-4" />
              </ToolbarButton>
            </div>

            {/* Undo/Redo */}
            <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
              <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </ToolbarButton>
            </div>

            {/* Actions */}
            {onSave && (
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  className="h-8 px-3"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="relative">
        <EditorContent 
          editor={editor} 
          className="prose prose-sm max-w-none p-4 min-h-[300px] focus:outline-none"
        />
        
        {autoSave && (
          <div className="absolute top-2 right-2 text-xs text-gray-400">
            Auto-saving...
          </div>
        )}
      </div>

      {/* Character count */}
      <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 text-xs text-gray-500 flex justify-between">
        <span>{editor.storage.characterCount?.characters() || 0} characters</span>
        <span>{editor.storage.characterCount?.words() || 0} words</span>
      </div>
    </div>
  );
};

export default RichTextEditor;
