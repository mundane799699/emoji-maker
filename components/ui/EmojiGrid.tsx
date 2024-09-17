"use client";

import { useEffect, useState } from "react";
import { getAllEmojis } from "@/utils/supabase";
import { createClient } from "@supabase/supabase-js";
import { Heart } from "lucide-react";
import { useEmojiStore } from "@/store/emojiStore";

interface Emoji {
  id: number;
  image_url: string;
  prompt: string;
  likes_count: number;
  creator_user_id: string;
}

export function EmojiGrid() {
  const { emojis, setEmojis } = useEmojiStore();

  useEffect(() => {
    // const supabase = createClient(
    //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
    //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    // );

    async function fetchEmojis() {
      const fetchedEmojis = await getAllEmojis();
      setEmojis(fetchedEmojis);
    }

    fetchEmojis();

    // const subscription = supabase
    //   .channel("public:emojis")
    //   .on(
    //     "postgres_changes",
    //     { event: "INSERT", schema: "public", table: "emojis" },
    //     (payload) => {
    //       console.log("payload = ", payload);
    //       setEmojis([payload.new as Emoji, ...emojis]);
    //     }
    //   )
    //   .subscribe();

    // return () => {
    //   subscription.unsubscribe();
    // };
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {emojis.map((emoji) => (
        <div key={emoji.id} className="border rounded p-2">
          <img
            src={emoji.image_url}
            alt={emoji.prompt}
            className="w-full h-auto"
          />
          <div className="mt-2 flex justify-between items-center">
            <p className="text-sm truncate flex-1">{emoji.prompt}</p>
            <div className="flex items-center ml-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-xs text-gray-500 ml-1">
                {emoji.likes_count}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
