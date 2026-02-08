import { useState } from 'react';
import { useSaveCallerUserProfile, useGetCallerUserProfile } from '../../hooks/useQueries';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Loader2 } from 'lucide-react';

interface NameOnboardingProps {
  onComplete?: () => void;
}

export function NameOnboarding({ onComplete }: NameOnboardingProps) {
  const { data: existingProfile } = useGetCallerUserProfile();
  const [name, setName] = useState(existingProfile?.name || '');
  const saveMutation = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await saveMutation.mutateAsync({
        name: name.trim(),
        practiceConfig: existingProfile?.practiceConfig,
      });
      onComplete?.();
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to KeyFlow!</CardTitle>
          <CardDescription>
            {existingProfile ? 'Update your name to continue' : "Let's get started. What's your name?"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={saveMutation.isPending}
                autoFocus
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={saveMutation.isPending || !name.trim()}>
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : existingProfile ? (
                'Update Name'
              ) : (
                'Continue'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
