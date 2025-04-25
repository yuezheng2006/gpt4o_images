import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui/button'; 
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; 

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration: ServiceWorkerRegistration | undefined) { 
      console.log('Service Worker registered:', registration);
    },
    onRegisterError(error: Error) { 
      console.error('Service Worker registration error:', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) {
    return null; 
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-[350px] shadow-lg bg-background border">
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
            <Button onClick={() => updateServiceWorker(true)}>
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
