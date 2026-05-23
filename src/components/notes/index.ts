export { AudioNotePlayer } from '@/components/notes/audio-note-player';
export { AudioNoteRecorderDrawer } from '@/components/notes/audio-note-recorder-drawer';
export { NoteEditorDrawer } from '@/components/notes/note-editor-drawer';
export { NoteList } from '@/components/notes/note-list';
export { NoteListItem } from '@/components/notes/note-list-item';
export { NoteViewDrawer } from '@/components/notes/note-view-drawer';
export { RichTextEditor } from '@/components/notes/rich-text-editor';
export {
  NOTE_EDITOR_PLACEHOLDER,
  NOTES_AUDIO_BUCKET,
  NOTE_CATEGORY_LABELS,
  NOTE_CATEGORY_OPTIONS,
  NOTE_TYPE_LABELS,
  UNTITLED_NOTE_LABEL,
} from '@/components/notes/constants';
export {
  useBookNotes,
  useCreateAudioNote,
  useCreateTextNote,
  useDeleteNote,
  useUpdateTextNote,
} from '@/components/notes/hooks';
export {
  createAudioNote,
  createTextNote,
  deleteNote,
  getNotesByBookId,
  updateTextNote,
} from '@/components/notes/services';
export type {
  AudioNoteInput,
  NoteCategory,
  Note,
  NoteInsert,
  NoteType,
  NoteUpdate,
  TextNoteInput,
  UpdateTextNoteInput,
} from '@/components/notes/types';
export {
  extractTextFromHtml,
  formatAudioDuration,
  formatNoteDate,
  getNoteCategoryLabel,
  getNotePreview,
  getNoteTitle,
  getNoteTypeLabel,
  matchesNoteSearch,
} from '@/components/notes/utils';
