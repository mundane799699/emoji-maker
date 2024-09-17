"use client";

import { useState } from "react";
import { EmojiGenerator } from "../components/ui/EmojiGenerator";
import { EmojiGrid } from "../components/ui/EmojiGrid";
import { EmojiForm } from "@/components/ui/emoji-form";
import { useEmojiStore } from "@/store/emojiStore";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

interface Emoji {
  id: number;
  image_url: string;
  prompt: string;
  likes_count: number;
  creator_user_id: string;
  created_at: string;
}

export default function Home() {
  const { isSignInModalOpen, onClose } = useEmojiStore();
  return (
    <>
      <main className="flex min-h-screen flex-col items-center p-24">
        <h1 className="text-4xl font-bold mb-8">Emoji Maker</h1>
        <EmojiForm />
        <EmojiGrid />
      </main>
      {isSignInModalOpen && (
        <div className="z-[999999] fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Please sign in</h2>
            <p className="mb-4">
              You need to sign in to continue. 
            </p>
            <SignInButton mode="redirect">
              <Button className="mr-2">Sign in</Button>
            </SignInButton>
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
