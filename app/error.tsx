'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-purple-50 to-pink-50 dark:from-primary/5 dark:via-purple-950 dark:to-pink-950">
      <div className="container max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-8 space-y-6 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3">
              <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-500" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">문제가 발생했습니다</h2>
            <p className="text-muted-foreground">
              페이지를 불러오는 중 오류가 발생했습니다.
            </p>
            {error.message && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                {error.message}
              </p>
            )}
          </div>

          <div className="flex gap-2 justify-center">
            <Button onClick={() => reset()} variant="default">
              다시 시도
            </Button>
            <Button onClick={() => (window.location.href = '/')} variant="outline">
              홈으로 이동
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
