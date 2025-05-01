import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * ReloadPrompt component
 * 
 * Displays a prompt to the user when a new version of the PWA is available
 * or when the app is ready to work offline.
 */
function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    /**
     * Callback function executed when the Service Worker is registered successfully.
     * @param registration - The ServiceWorkerRegistration object.
     */
    onRegistered(registration: ServiceWorkerRegistration | undefined) {
      console.log('Service Worker registered successfully:', registration);
    },
    /**
     * Callback function executed when there is an error during Service Worker registration.
     * @param error - The error object.
     */
    onRegisterError(error: Error) {
      console.error('Service Worker registration failed:', error);
    },
  });

  /**
   * Closes the prompt.
   */
  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  // Don't render anything if no action is needed
  if (!offlineReady && !needRefresh) {
    return null;
  }

  /**
   * Handles the click event for the update button.
   * Logs the click event and triggers the Service Worker update.
   */
  const handleUpdateClick = () => {
    console.log('Update button clicked, attempting to update Service Worker...');
    updateServiceWorker(true);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Ensure card has a distinct background color */}
      <Card className="w-[350px] shadow-lg bg-white dark:bg-gray-800 border">
        <CardHeader>
          <CardTitle className="text-lg">
            {offlineReady ? '应用程序已准备好离线工作' : '有新内容可用'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {offlineReady
              ? '应用程序已缓存，可在离线时使用。'
              : '点击“更新”按钮加载最新版本。'}
          </p>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          {needRefresh && (
            // Add logging to the update button's onClick handler
            <Button onClick={handleUpdateClick}>
              更新
            </Button>
          )}
          <Button variant="outline" onClick={close}>
            关闭
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ReloadPrompt;
