'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from './Button';

interface SignInPromptProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export default function SignInPrompt({ isOpen, onClose, message = 'Sign in to save favorites to your profile' }: SignInPromptProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-botanical-cream-50 rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-2xl font-serif text-botanical-green-800 mb-4">
          Sign In Required
        </h2>
        <p className="text-botanical-green-700 mb-6">
          {message}
        </p>
        <div className="flex gap-4">
          <Button href="/signin" size="lg" className="flex-1">
            Sign In
          </Button>
          <Button href="/signup" variant="secondary" size="lg" className="flex-1">
            Sign Up
          </Button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 text-botanical-green-600 hover:text-botanical-green-800 underline text-sm w-full"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

