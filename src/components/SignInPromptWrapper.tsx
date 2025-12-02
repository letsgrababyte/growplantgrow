'use client';

import { useFavorites } from '@/contexts/FavoritesContext';
import SignInPrompt from './SignInPrompt';

export default function SignInPromptWrapper() {
  const { showSignInPrompt, setShowSignInPrompt } = useFavorites();

  return (
    <SignInPrompt
      isOpen={showSignInPrompt}
      onClose={() => setShowSignInPrompt(false)}
      message="Sign in to save favorites to your profile and access them from any device"
    />
  );
}

