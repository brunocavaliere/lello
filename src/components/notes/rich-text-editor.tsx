'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Heading2, Italic, List, ListOrdered, Quote, Redo2, Undo2 } from 'lucide-react';

import { NOTE_EDITOR_PLACEHOLDER } from '@/components/notes/constants';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type RichTextEditorProps = {
  initialContent?: string;
  className?: string;
  editorClassName?: string;
  placeholder?: string;
  toolbarClassName?: string;
  onChange: (payload: { html: string; text: string; isEmpty: boolean }) => void;
};

const TOOLBAR_ITEMS = [
  { icon: Bold, label: 'Negrito', action: 'bold' },
  { icon: Italic, label: 'Italico', action: 'italic' },
  { icon: Heading2, label: 'Titulo', action: 'heading' },
  { icon: List, label: 'Lista', action: 'bulletList' },
  { icon: ListOrdered, label: 'Lista numerada', action: 'orderedList' },
  { icon: Quote, label: 'Citacao', action: 'blockquote' },
] as const;

const TOOLBAR_GROUPS = [
  TOOLBAR_ITEMS.slice(0, 2),
  TOOLBAR_ITEMS.slice(2, 3),
  TOOLBAR_ITEMS.slice(3, 6),
] as const;

export function RichTextEditor({
  initialContent = '',
  className,
  editorClassName,
  placeholder = NOTE_EDITOR_PLACEHOLDER,
  toolbarClassName,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        code: false,
        codeBlock: false,
        horizontalRule: false,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: cn(
          'min-h-52 w-full rounded-lg border border-border/70 bg-background px-4 py-4 text-sm leading-7 outline-none dark:bg-background',
          editorClassName
        ),
      },
    },
    onCreate({ editor }) {
      onChange({
        html: editor.getHTML(),
        text: editor.getText(),
        isEmpty: editor.isEmpty,
      });
    },
    onUpdate({ editor }) {
      onChange({
        html: editor.getHTML(),
        text: editor.getText(),
        isEmpty: editor.isEmpty,
      });
    },
  });

  if (!editor) {
    return null;
  }

  function runAction(action: (typeof TOOLBAR_ITEMS)[number]['action']) {
    if (!editor) {
      return;
    }

    const chain = editor.chain().focus();

    switch (action) {
      case 'bold':
        chain.toggleBold().run();
        break;
      case 'italic':
        chain.toggleItalic().run();
        break;
      case 'heading':
        chain.toggleHeading({ level: 2 }).run();
        break;
      case 'bulletList':
        chain.toggleBulletList().run();
        break;
      case 'orderedList':
        chain.toggleOrderedList().run();
        break;
      case 'blockquote':
        chain.toggleBlockquote().run();
        break;
    }
  }

  return (
    <div
      className={cn(
        'border-border/70 bg-background dark:bg-background overflow-hidden rounded-lg border',
        className
      )}
    >
      <div
        className={cn(
          'border-border/70 [scrollbar-width:none] overflow-x-auto border-b px-3 py-2.5 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-track]:bg-transparent',
          toolbarClassName
        )}
      >
        <div className="flex min-w-max items-center gap-2">
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-sm"
              aria-label="Desfazer"
              title="Desfazer"
              disabled={!editor.can().chain().focus().undo().run()}
              onClick={() => editor.chain().focus().undo().run()}
            >
              <Undo2 className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-sm"
              aria-label="Refazer"
              title="Refazer"
              disabled={!editor.can().chain().focus().redo().run()}
              onClick={() => editor.chain().focus().redo().run()}
            >
              <Redo2 className="size-4" />
            </Button>
          </div>

          <div className="bg-border h-6 w-px shrink-0" />

          {TOOLBAR_GROUPS.map((group, groupIndex) => (
            <div key={`group-${groupIndex}`} className="flex items-center gap-1">
              {group.map((item) => {
                const Icon = item.icon;
                const isActive =
                  (item.action === 'bold' && editor.isActive('bold')) ||
                  (item.action === 'italic' && editor.isActive('italic')) ||
                  (item.action === 'heading' && editor.isActive('heading', { level: 2 })) ||
                  (item.action === 'bulletList' && editor.isActive('bulletList')) ||
                  (item.action === 'orderedList' && editor.isActive('orderedList')) ||
                  (item.action === 'blockquote' && editor.isActive('blockquote'));

                return (
                  <Button
                    key={item.label}
                    type="button"
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="icon-sm"
                    className={cn('rounded-sm', isActive && 'bg-secondary text-foreground')}
                    aria-label={item.label}
                    title={item.label}
                    onClick={() => runAction(item.action)}
                  >
                    <Icon className="size-4" />
                  </Button>
                );
              })}

              {groupIndex < TOOLBAR_GROUPS.length - 1 ? (
                <div className="bg-border ml-1 h-6 w-px shrink-0" />
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        {editor.isEmpty ? (
          <p className="text-muted-foreground pointer-events-none absolute top-4 left-4 z-10 text-sm">
            {placeholder}
          </p>
        ) : null}
        <EditorContent
          editor={editor}
          className="[&_blockquote]:border-border [&_blockquote]:text-muted-foreground [&_h2]:font-editorial [&_p.is-editor-empty:first-child]:text-muted-foreground [&_.ProseMirror]:relative [&_.ProseMirror]:z-0 [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_h2]:text-2xl [&_h2]:leading-tight [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
        />
      </div>
    </div>
  );
}
