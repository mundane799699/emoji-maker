"use client";

import { useEffect, useState } from "react";
import { getAllEmojis } from "@/utils/supabase";
import { createClient } from "@supabase/supabase-js";
import { Download, Heart } from "lucide-react";
import { useEmojiStore } from "@/store/emojiStore";
import { EmojiCard } from "./EmojiCard";

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
        <EmojiCard key={emoji.id} emoji={emoji} />
      ))}
    </div>
  );
}
