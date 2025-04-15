import { useState } from 'react';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';

interface GoogleLoginButtonProps {
  onSuccess?: (response: any) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export function GoogleLoginButton({ 
  onSuccess, 
  onError,
  className = ''
}: GoogleLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const initializeGoogleSignIn = () => {
    setIsLoading(true);
    
    if (!window.google) {
      console.error('Google API not loaded');
      setIsLoading(false);
      toast({
        title: "登录失败",
        description: "Google API 未加载，请稍后再试",
        variant: "destructive",
      });
      if (onError) onError(new Error('Google API not loaded'));
      return;
    }

    try {
      const clientId = import.meta.env?.VITE_GOOGLE_CLIENT_ID || '';
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          window.google.accounts.id.renderButton(
            document.getElementById('google-login-button-container')!,
            { theme: 'outline', size: 'large', width: 250 }
          );
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
      setIsLoading(false);
      toast({
        title: "登录失败",
        description: "初始化 Google 登录时出错",
        variant: "destructive",
      });
      if (onError) onError(error as Error);
    }
  };

  const handleCredentialResponse = (response: any) => {
    try {
      if (response.credential) {
        toast({
          title: "登录成功",
          description: "您已成功登录",
        });
        if (onSuccess) onSuccess(response);
      }
    } catch (error) {
      console.error('Error handling Google credential response:', error);
      toast({
        title: "登录失败",
        description: "处理 Google 凭据时出错",
        variant: "destructive",
      });
      if (onError) onError(error as Error);
    }
  };

  return (
    <div className={className}>
      <Button
        variant="outline"
        onClick={initializeGoogleSignIn}
        disabled={isLoading}
        className="flex items-center justify-center gap-2 w-full"
      >
        {isLoading ? (
          <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
        ) : (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            width="24" 
            height="24"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        <span>使用 Google 登录</span>
      </Button>
      <div id="google-login-button-container" className="mt-2"></div>
    </div>
  );
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, options: any) => void;
        };
      };
    };
  }
}
