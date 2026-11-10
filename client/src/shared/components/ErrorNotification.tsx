import { useEffect, useState } from 'react';
import './ErrorNotification.css';

interface ErrorNotificationProps {
  error: Error | null;
  onClose?: () => void;
  autoDismiss?: boolean;
  autoDismissTime?: number;
}

export function ErrorNotification({
  error,
  onClose,
  autoDismiss = true,
  autoDismissTime = 5000,
}: ErrorNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  useEffect(() => {
    if (error) {
      setIsVisible(true);
      setIsExiting(false);
      
      if (autoDismiss) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoDismissTime);
        
        return () => clearTimeout(timer);
      }
    }
  }, [error, autoDismiss, autoDismissTime]);
  
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  };
  
  if (!isVisible || !error) {
    return null;
  }
  
  return (
    <div
      className={`error-notification ${isExiting ? 'exiting' : ''}`}
      role="alert"
      aria-live="assertive"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="error-notification__icon">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="16" r="1" fill="currentColor" />
        </svg>
      </div>
      
      <div className="error-notification__content">
        <p className="error-notification__message">{error.message}</p>
      </div>
      
      <button
        className="error-notification__close"
        onClick={handleClose}
        aria-label="Cerrar notificación de error"
        type="button"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}