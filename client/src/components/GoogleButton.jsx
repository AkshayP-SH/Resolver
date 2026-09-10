import { useEffect, useRef, useState } from 'react';
import { showToast } from '../services/toast';

export default function GoogleButton({ onSuccess, label = 'Continue with Google', disabled = false }) {
  const buttonRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load Google script only once
    if (document.getElementById('google-identity-script')) {
      renderButton();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.id = 'google-identity-script';
    script.async = true;
    script.defer = true;
    script.onload = renderButton;
    script.onerror = () => showToast('Failed to load Google Sign-In', 'error');
    document.body.appendChild(script);
  }, []);

  const renderButton = () => {
    if (!window.google || !buttonRef.current) return;
    try {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width: buttonRef.current.parentElement?.offsetWidth || 320,
        text: label === 'Continue with Google' ? 'continue_with' : 'signin_with',
        shape: 'rectangular',
        locale: 'en',
      });
    } catch (err) {
      console.error('Google button render error:', err);
    }
  };

  const handleGoogleResponse = async (response) => {
    if (!response.credential) {
      showToast('Google sign-in cancelled', 'error');
      return;
    }
    setLoading(true);
    try {
      await onSuccess(response.credential);
    } catch (err) {
      showToast(err.message || 'Google sign-in failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div
        ref={buttonRef}
        className={`flex justify-center ${disabled || loading ? 'opacity-50 pointer-events-none' : ''}`}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-base-100/70">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      )}
    </div>
  );
}