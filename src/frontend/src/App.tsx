import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { AppShell } from './components/layout/AppShell';
import { NameOnboarding } from './components/profile/NameOnboarding';
import { PracticeView } from './features/practice/PracticeView';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const isInitializing = loginStatus === 'initializing';

  // Show loading during initialization
  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show onboarding if authenticated but no profile
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <AppShell>
      {!isAuthenticated ? (
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">Welcome to KeyFlow</h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Learn keyboard with your favorite YouTube songs
            </p>
          </div>
        </div>
      ) : showProfileSetup ? (
        <NameOnboarding />
      ) : (
        <PracticeView />
      )}
    </AppShell>
  );
}
