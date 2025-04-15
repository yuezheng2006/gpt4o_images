import { toast as sonnerToast } from 'sonner';

type ToastProps = {
  title?: string;
  description?: string;
  duration?: number;
  variant?: 'default' | 'destructive';
};

export const toast = ({ title, description, duration = 3000, variant = 'default' }: ToastProps) => {
  return sonnerToast(title, {
    description,
    duration,
    className: variant === 'destructive' ? 'bg-red-500' : '',
  });
};
