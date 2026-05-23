'use client';

import { useEffect, useRef, useState } from 'react';

import { Pause, Play } from 'lucide-react';

import { formatAudioDuration } from '@/components/notes/utils';
import { Button } from '@/components/ui/button';

type AudioNotePlayerProps = {
  audioUrl: string;
  durationSeconds?: number | null;
};

export function AudioNotePlayer({ audioUrl, durationSeconds }: AudioNotePlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [resolvedDuration, setResolvedDuration] = useState(durationSeconds ?? 0);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (!audioElement) {
      return;
    }

    const resolvedAudioElement = audioElement;

    function handleTimeUpdate() {
      setCurrentTime(Math.floor(resolvedAudioElement.currentTime));
    }

    function handleLoadedMetadata() {
      if (Number.isFinite(resolvedAudioElement.duration) && resolvedAudioElement.duration > 0) {
        setResolvedDuration(Math.floor(resolvedAudioElement.duration));
      }
    }

    function handlePlay() {
      setIsPlaying(true);
    }

    function handlePause() {
      setIsPlaying(false);
    }

    function handleEnded() {
      setIsPlaying(false);
      setCurrentTime(0);
    }

    resolvedAudioElement.addEventListener('timeupdate', handleTimeUpdate);
    resolvedAudioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    resolvedAudioElement.addEventListener('play', handlePlay);
    resolvedAudioElement.addEventListener('pause', handlePause);
    resolvedAudioElement.addEventListener('ended', handleEnded);

    return () => {
      resolvedAudioElement.removeEventListener('timeupdate', handleTimeUpdate);
      resolvedAudioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      resolvedAudioElement.removeEventListener('play', handlePlay);
      resolvedAudioElement.removeEventListener('pause', handlePause);
      resolvedAudioElement.removeEventListener('ended', handleEnded);
    };
  }, []);

  async function togglePlayback() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.paused) {
      await audio.play();
      return;
    }

    audio.pause();
  }

  return (
    <div className="border-border/70 bg-card/50 flex items-center gap-4 rounded-lg border px-4 py-4">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <Button
        type="button"
        size="icon"
        className="size-11 rounded-full"
        aria-label={isPlaying ? 'Pausar áudio' : 'Reproduzir áudio'}
        onClick={() => void togglePlayback()}
      >
        {isPlaying ? <Pause className="size-4" /> : <Play className="ml-0.5 size-4" />}
      </Button>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">Nota de áudio</p>
        <p className="text-muted-foreground text-sm">
          {formatAudioDuration(currentTime)} / {formatAudioDuration(resolvedDuration)}
        </p>
      </div>
    </div>
  );
}
