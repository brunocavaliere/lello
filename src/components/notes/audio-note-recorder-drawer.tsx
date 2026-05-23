'use client';

import { useEffect, useRef, useState } from 'react';

import { Mic, Square } from 'lucide-react';

import { AudioNotePlayer } from '@/components/notes/audio-note-player';
import { NOTE_CATEGORY_OPTIONS, UNTITLED_NOTE_LABEL } from '@/components/notes/constants';
import { useCreateAudioNote } from '@/components/notes/hooks';
import { formatAudioDuration } from '@/components/notes/utils';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { dismissToast, showErrorToast, showLoadingToast, showSuccessToast } from '@/lib/toast';

type AudioNoteRecorderDrawerProps = {
  bookId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type RecorderStep = 'idle' | 'recording' | 'preview';

const SUPPORTED_AUDIO_MIME_TYPES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'] as const;

function getSupportedAudioMimeType() {
  if (typeof MediaRecorder === 'undefined') {
    return '';
  }

  return (
    SUPPORTED_AUDIO_MIME_TYPES.find((mimeType) => MediaRecorder.isTypeSupported(mimeType)) ?? ''
  );
}

function getAudioFileExtension(mimeType: string) {
  if (mimeType.includes('mp4')) {
    return 'm4a';
  }

  return 'webm';
}

export function AudioNoteRecorderDrawer({
  bookId,
  open,
  onOpenChange,
}: AudioNoteRecorderDrawerProps) {
  const createAudioNote = useCreateAudioNote(bookId);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const shouldDiscardRef = useRef(false);

  const [step, setStep] = useState<RecorderStep>('idle');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'note' | 'reflection' | 'quote' | 'summary'>('note');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState('');

  function clearTimer() {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function stopStream() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  function resetState() {
    clearTimer();
    stopStream();
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    shouldDiscardRef.current = false;
    setStep('idle');
    setRecordingSeconds(0);
    setTitle('');
    setCategory('note');
    setAudioBlob(null);
    setAudioPreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      return '';
    });
  }

  useEffect(() => {
    return () => {
      clearTimer();
      stopStream();
    };
  }, []);

  function handleDrawerOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      onOpenChange(true);
      return;
    }

    const mediaRecorder = mediaRecorderRef.current;

    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      shouldDiscardRef.current = true;
      mediaRecorder.stop();
    } else {
      resetState();
    }

    onOpenChange(false);
  }

  async function handleStartRecording() {
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === 'undefined'
    ) {
      showErrorToast('Gravação indisponível.', {
        description: 'Seu navegador não suporta notas de áudio neste momento.',
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedAudioMimeType();
      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      chunksRef.current = [];
      shouldDiscardRef.current = false;
      streamRef.current = stream;
      mediaRecorderRef.current = mediaRecorder;
      setRecordingSeconds(0);
      setAudioBlob(null);
      setAudioPreviewUrl((currentUrl) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl);
        }

        return '';
      });

      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      });

      mediaRecorder.addEventListener('stop', () => {
        clearTimer();
        stopStream();

        if (shouldDiscardRef.current) {
          shouldDiscardRef.current = false;
          setStep('idle');
          setRecordingSeconds(0);
          return;
        }

        const blob = new Blob(chunksRef.current, {
          type: mediaRecorder.mimeType || mimeType || 'audio/webm',
        });
        const previewUrl = URL.createObjectURL(blob);

        setAudioBlob(blob);
        setAudioPreviewUrl(previewUrl);
        setStep('preview');
      });

      mediaRecorder.start();
      setStep('recording');
      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((current) => current + 1);
      }, 1000);
    } catch (error) {
      showErrorToast('Não foi possível iniciar a gravação.', {
        description: error instanceof Error ? error.message : 'Verifique a permissão de microfone.',
      });
    }
  }

  function handleStopRecording() {
    const mediaRecorder = mediaRecorderRef.current;

    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
      return;
    }

    mediaRecorder.stop();
  }

  function handleCancelRecording() {
    handleDrawerOpenChange(false);
  }

  async function handleSaveAudioNote() {
    if (!audioBlob) {
      showErrorToast('Nenhum áudio pronto para salvar.');
      return;
    }

    const fileExtension = getAudioFileExtension(audioBlob.type);
    const audioFile = new File([audioBlob], `nota-${Date.now()}.${fileExtension}`, {
      type: audioBlob.type || 'audio/webm',
    });
    const loadingToastId = showLoadingToast('Salvando nota de áudio...');

    try {
      await createAudioNote.mutateAsync({
        bookId,
        title: title.trim() || UNTITLED_NOTE_LABEL,
        category,
        audioFile,
        audioDurationSeconds: recordingSeconds,
      });
      showSuccessToast('Nota de áudio salva.');
      handleDrawerOpenChange(false);
    } catch (error) {
      showErrorToast('Não foi possível salvar o áudio.', {
        description:
          error instanceof Error ? error.message : 'Tente novamente em alguns instantes.',
      });
    } finally {
      dismissToast(loadingToastId);
    }
  }

  return (
    <Drawer open={open} onOpenChange={handleDrawerOpenChange}>
      <DrawerContent className="h-[76dvh] max-h-[76dvh] px-0 pb-0">
        <DrawerHeader className="gap-3 px-5 pt-6 pb-2 sm:px-6 sm:pt-7">
          <DrawerTitle className="font-editorial text-2xl tracking-[-0.03em]">
            Nova nota de áudio
          </DrawerTitle>
          <DrawerDescription className="max-w-sm text-sm leading-6">
            Capture esse pensamento antes que ele passe.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex min-h-0 flex-1 flex-col px-5 pt-2 pb-[calc(env(safe-area-inset-bottom)+1rem)] sm:px-6">
          {step === 'idle' ? (
            <div className="flex flex-1 flex-col justify-center gap-8 pb-6 text-center">
              <p className="text-lg font-medium">Toque para gravar</p>

              <div className="flex justify-center">
                <Button
                  type="button"
                  size="icon"
                  className="size-24 rounded-full shadow-lg"
                  aria-label="Começar gravação"
                  onClick={() => void handleStartRecording()}
                >
                  <Mic className="size-8" />
                </Button>
              </div>
            </div>
          ) : null}

          {step === 'recording' ? (
            <div className="flex flex-1 flex-col justify-center gap-8 pb-6 text-center">
              <div className="space-y-3">
                <p className="text-destructive text-sm font-medium">Gravando...</p>
                <p className="font-editorial text-5xl tracking-[-0.05em]">
                  {formatAudioDuration(recordingSeconds)}
                </p>
              </div>

              <div className="flex items-center justify-center">
                <Button
                  type="button"
                  size="icon"
                  className="size-20 rounded-full shadow-lg"
                  aria-label="Finalizar gravação"
                  onClick={() => handleStopRecording()}
                >
                  <Square className="size-6 fill-current" />
                </Button>
              </div>

              <div className="flex justify-center pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => handleCancelRecording()}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : null}

          {step === 'preview' && audioPreviewUrl ? (
            <>
              <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pt-3 pb-4">
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_11rem]">
                  <div className="space-y-2.5">
                    <label htmlFor="audio-note-title" className="text-sm font-medium">
                      Título
                    </label>
                    <Input
                      id="audio-note-title"
                      value={title}
                      placeholder="Nota sem título"
                      className="bg-background dark:bg-background h-10 rounded-lg text-sm"
                      onChange={(event) => setTitle(event.target.value)}
                    />
                  </div>

                  <div className="space-y-2.5">
                    <label htmlFor="audio-note-category" className="text-sm font-medium">
                      Categoria
                    </label>
                    <Select
                      value={category}
                      onValueChange={(value) => setCategory(value as typeof category)}
                    >
                      <SelectTrigger
                        id="audio-note-category"
                        className="bg-background dark:bg-background h-10 w-full rounded-lg text-sm"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {NOTE_CATEGORY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <AudioNotePlayer
                  key={audioPreviewUrl}
                  audioUrl={audioPreviewUrl}
                  durationSeconds={recordingSeconds}
                />
              </div>

              <DrawerFooter className="border-border/70 bg-background/96 gap-3 border-t px-0 pt-4 pb-0 backdrop-blur">
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    className="rounded-full"
                    disabled={createAudioNote.isPending}
                    onClick={() => void handleSaveAudioNote()}
                  >
                    Salvar áudio
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    disabled={createAudioNote.isPending}
                    onClick={() => void handleStartRecording()}
                  >
                    Gravar novamente
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-full"
                    disabled={createAudioNote.isPending}
                    onClick={() => handleCancelRecording()}
                  >
                    Cancelar
                  </Button>
                </div>
              </DrawerFooter>
            </>
          ) : null}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
