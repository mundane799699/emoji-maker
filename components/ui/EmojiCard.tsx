"use client";

import { useEffect, useState } from "react";
import { Heart, Download } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { supabase, toggleLike } from "@/utils/supabase";

interface EmojiCardProps {
  emoji: {
    id: number;
    image_url: string;
    prompt: string;
    likes_count: number;
  };
}

export function EmojiCard({ emoji }: EmojiCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [likesCount, setLikesCount] = useState(emoji.likes_count);
  const [isLiked, setIsLiked] = useState(false);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    async function checkLikeStatus() {
      if (user) {
        const { data } = await supabase
          .from("emoji_likes")
          .select("*")
          .eq("user_id", user.id)
          .eq("emoji_id", emoji.id)
          .single();
        setIsLiked(!!data);
      }
    }
    checkLikeStatus();
  }, [user, emoji.id]);

  const handleLike = async () => {
    if (!user) {
      alert("请先登录后再点赞");
      return;
    }

    const result = await toggleLike(user.id, emoji.id);
    if (result) {
      setIsLiked(result.isLiked);
      setLikesCount(result.likesCount);
    }
  };

  return (
    <div
      className="border rounded p-2 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={emoji.image_url} alt={emoji.prompt} className="w-full h-auto" />
      {isHovered && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <button className="mr-2 p-2 bg-white rounded-full">
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
