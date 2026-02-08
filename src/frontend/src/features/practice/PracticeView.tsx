import { useState, useEffect } from 'react';
import { YouTubePicker } from '../../components/youtube/YouTubePicker';
import { YouTubeEmbed } from '../../components/youtube/YouTubeEmbed';
import { ChartImporter } from '../../components/chart/ChartImporter';
import { PianoRoll } from '../../components/pianoroll/PianoRoll';
import { TransportControls } from '../../components/pianoroll/TransportControls';
import { HitFeedback } from '../../components/feedback/HitFeedback';
import { usePracticeTransport } from '../../hooks/usePracticeTransport';
import { useKeyboardInput } from '../../hooks/useKeyboardInput';
import { useHitDetection } from './useHitDetection';
import { useSaveCallerUserProfile, useGetCallerUserProfile } from '../../hooks/useQueries';
import type { NoteChart } from '../../types/noteChart';
import { Card, CardContent } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Info } from 'lucide-react';

export function PracticeView() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [chart, setChart] = useState<NoteChart | null>(null);
  const [chartFilename, setChartFilename] = useState('');

  const { data: userProfile } = useGetCallerUserProfile();
  const saveMutation = useSaveCallerUserProfile();

  const transport = usePracticeTransport();
  const keyboardInput = useKeyboardInput();
  const hitDetection = useHitDetection(chart, transport.currentTime, keyboardInput.lastPressed);

  // Load saved practice config
  useEffect(() => {
    if (userProfile?.practiceConfig) {
      const { lastYoutubeUrl, lastChartFilename } = userProfile.practiceConfig;
      if (lastYoutubeUrl) {
        setYoutubeUrl(lastYoutubeUrl);
      }
      if (lastChartFilename) {
        setChartFilename(lastChartFilename);
      }
    }
  }, [userProfile]);

  const handleYoutubeLoad = (url: string, id: string) => {
    setYoutubeUrl(url);
    setVideoId(id);
    savePracticeConfig(url, chartFilename);
  };

  const handleChartLoad = (loadedChart: NoteChart, filename: string) => {
    setChart(loadedChart);
    setChartFilename(filename);
    savePracticeConfig(youtubeUrl, filename);
  };

  const savePracticeConfig = (url: string, filename: string) => {
    if (userProfile && (url || filename)) {
      saveMutation.mutate({
        ...userProfile,
        practiceConfig: {
          lastYoutubeUrl: url,
          lastChartFilename: filename,
        },
      });
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8 space-y-6">
        <div>
          <h2 className="mb-2 text-3xl font-bold tracking-tight">Practice Session</h2>
          <p className="text-muted-foreground">
            Choose a YouTube song and import a note chart to start practicing
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <YouTubePicker onLoad={handleYoutubeLoad} initialUrl={youtubeUrl} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <ChartImporter onLoad={handleChartLoad} />
            </CardContent>
          </Card>
        </div>

        {videoId && (
          <Card>
            <CardContent className="pt-6">
              <YouTubeEmbed videoId={videoId} />
            </CardContent>
          </Card>
        )}
      </div>

      {!chart ? (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Import a note chart (MIDI or JSON) to see the falling piano roll visualization and start practicing.
            You can still play the YouTube video for reference.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-6">
          <TransportControls transport={transport} />
          <HitFeedback hitState={hitDetection.hitState} keyMapping={keyboardInput.keyMapping} />
          <PianoRoll
            chart={chart}
            currentTime={transport.currentTime}
            isPlaying={transport.isPlaying}
            hitNotes={hitDetection.hitNotes}
          />
        </div>
      )}
    </div>
  );
}
