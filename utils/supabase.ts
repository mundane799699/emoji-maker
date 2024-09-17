import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getAllEmojis(userId?: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let query = supabase
    .from("emojis")
    .select(
      `
      *,
      emoji_likes (user_id)
    `
    )
    .order("created_at", { ascending: false });

  if (userId) {
    query = query.eq("emoji_likes.user_id", userId);
  }

  const { data, error } = await query;
  console.log("data = ", data);

  if (error) {
    console.error("获取表情符号时出错：", error);
    return [];
  }

  return data.map((emoji) => ({
    ...emoji,
    isLiked: emoji.emoji_likes && emoji.emoji_likes.length > 0,
  }));
}

// ... 现有代码 ...

export async function toggleLike(userId: string, emojiId: number) {
  const { data: existingLike, error: checkError } = await supabase
    .from("emoji_likes")
    .select("*")
    .eq("user_id", userId)
    .eq("emoji_id", emojiId)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    console.error("Error checking like status:", checkError);
    return null;
  }

  if (existingLike) {
    // 如果已经点赞，则取消点赞
    const { error: deleteError } = await supabase
      .from("emoji_likes")
      .delete()
      .eq("user_id", userId)
      .eq("emoji_id", emojiId);

    if (deleteError) {
      console.error("Error removing like:", deleteError);
      return null;
    }
  } else {
    // 如果未点赞，则添加点赞
    const { error: insertError } = await supabase
      .from("emoji_likes")
      .insert({ user_id: userId, emoji_id: emojiId });

    if (insertError) {
      console.error("Error adding like:", insertError);
      return null;
    }
  }

  // 更新 emojis 表中的 likes_count
  const { data, error } = await supabase.rpc("update_emoji_likes_count", {
    emoji_id: emojiId,
  });

  if (error) {
    console.error("Error updating likes count:", error);
    return null;
  }

  return { isLiked: !existingLike, likesCount: data[0].likes_count };
}
