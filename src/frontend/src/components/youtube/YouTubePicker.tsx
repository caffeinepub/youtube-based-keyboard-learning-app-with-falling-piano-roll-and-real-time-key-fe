import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { extractVideoId, isValidYouTubeUrl } from '../../utils/youtube';
import { Youtube, Loader2 } from 'lucide-react';

interface YouTubePickerProps {
  onLoad: (url: string, videoId: string) => void;
  initialUrl?: string;
}

export function YouTubePicker({ onLoad, initialUrl = '' }: YouTubePickerProps) {
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoad = () => {
    setError('');
    setIsLoading(true);

    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      setIsLoading(false);
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      setError('Invalid YouTube URL. Please enter a valid YouTube video link.');
      setIsLoading(false);
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      setError('Could not extract video ID from URL');
      setIsLoading(false);
      return;
    }

    onLoad(url, videoId);
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Youtube className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">YouTube Song</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="youtube-url">YouTube Video URL</Label>
        <div className="flex gap-2">
          <Input
            id="youtube-url"
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
            disabled={isLoading}
          />
          <Button onClick={handleLoad} disabled={isLoading || !url.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Load'}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
