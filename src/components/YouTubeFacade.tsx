import { useState } from 'react';
import { Play } from 'lucide-react';

// Click-to-load YouTube embed. Until the visitor presses play the only
// third-party request is the poster image from i.ytimg.com (no script, no
// cookie), which keeps the hub pages' CWV budget and the consent rule in
// src/lib/consent.ts intact: no third-party script loads on mount. On click
// the privacy-enhanced youtube-nocookie.com player replaces the poster.
// Pair it with <VideoStructuredData> (StructuredData.tsx) so crawlers get the
// VideoObject without executing any of this.
interface YouTubeFacadeProps {
  videoId: string;
  title: string;
  className?: string;
}

export const YouTubeFacade = ({ videoId, title, className }: YouTubeFacadeProps) => {
  const [playing, setPlaying] = useState(false);

  return (
    <div className={`relative aspect-video overflow-hidden rounded-lg border border-border bg-black ${className ?? ''}`}>
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 h-full w-full"
        >
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt={title}
            width={480}
            height={360}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg transition-transform group-hover:scale-110">
              <Play className="ml-1 h-8 w-8" aria-hidden="true" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
};

export default YouTubeFacade;
