"use client";

import { useEffect, useState } from "react";
import { Heart, Download } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { supabase, toggleLike } from "@/utils/supabase";
import { useEmojiStore } from "@/store/emojiStore";

interface EmojiCardProps {
  emoji: {
    id: number;
    image_url: string;
    prompt: string;
    likes_count: number;
    isLiked: boolean;
  };
  userId?: string;
}

export function EmojiCard({ emoji, userId }: EmojiCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [likesCount, setLikesCount] = useState(emoji.likes_count);
  const [isLiked, setIsLiked] = useState(emoji.isLiked);
  const { onOpen } = useEmojiStore();

  const handleLike = async () => {
    if (!userId) {
      onOpen();
      return;
    }

    const result = await toggleLike(userId, emoji.id);
    if (result) {
      setIsLiked(result.isLiked);
      setLikesCount(result.likesCount);
    }
  };

  const handleDownload = async () => {
    if (!userId) {
      onOpen();
      return;
    }
    try {
      const response = await fetch(emoji.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `emoji-${emoji.id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("download failed:", error);
      alert("download failed, please try again later");
    }
  };

  return (
    <div
      className="border rounded p-2 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img
          src={emoji.image_url}
          alt={emoji.prompt}
          className="w-full h-auto"
        />
        {isHovered && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <button
              className="mr-2 p-2 bg-white rounded-full"
              onClick={handleDownload}
            >
              <Download className="h-5 w-5 text-gray-700" />
            </button>
            <button className="p-2 bg-white rounded-full" onClick={handleLike}>
              <Heart
                className={`h-5 w-5 ${
                  isLiked ? "text-red-500 fill-current" : "text-gray-500"
                }`}
              />
            </button>
          </div>
        )}
      </div>
      <div className="mt-2 flex justify-between items-center">
        <p className="text-sm truncate flex-1">{emoji.prompt}</p>
        <div className="flex items-center ml-2">
          <Heart
            className={`h-4 w-4 ${
              isLiked ? "text-red-500 fill-current" : "text-gray-500"
            }`}
          />
          <span className="text-xs text-gray-500 ml-1">{likesCount}</span>
        </div>
      </div>
    </div>
  );
}
