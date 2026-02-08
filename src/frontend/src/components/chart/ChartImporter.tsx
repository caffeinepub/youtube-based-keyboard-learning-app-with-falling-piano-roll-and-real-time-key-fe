import { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { parseJSONChart, parseMIDIChart } from '../../utils/chartParsers';
import type { NoteChart } from '../../types/noteChart';
import { Upload, FileMusic, Loader2 } from 'lucide-react';

interface ChartImporterProps {
  onLoad: (chart: NoteChart, filename: string) => void;
}

export function ChartImporter({ onLoad }: ChartImporterProps) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadedFile, setLoadedFile] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setIsLoading(true);

    try {
      const filename = file.name;
      const extension = filename.split('.').pop()?.toLowerCase();

      let chart: NoteChart;

      if (extension === 'json') {
        const text = await file.text();
        chart = parseJSONChart(text);
      } else if (extension === 'mid' || extension === 'midi') {
        const arrayBuffer = await file.arrayBuffer();
        chart = parseMIDIChart(arrayBuffer);
      } else {
        throw new Error('Unsupported file format. Please use JSON or MIDI files.');
      }

      setLoadedFile(filename);
      onLoad(chart, filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chart');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileMusic className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Note Chart</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="chart-file">Import MIDI or JSON Chart</Label>
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            id="chart-file"
            type="file"
            accept=".json,.mid,.midi"
            onChange={handleFileChange}
            disabled={isLoading}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </>
            )}
          </Button>
          {loadedFile && (
            <p className="text-sm text-muted-foreground">
              Loaded: <span className="font-medium text-foreground">{loadedFile}</span>
            </p>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Alert>
        <AlertDescription className="text-xs">
          <strong>Supported formats:</strong> MIDI (.mid, .midi) or JSON with notes array containing pitch, startTime,
          and duration.
        </AlertDescription>
      </Alert>
    </div>
  );
}
