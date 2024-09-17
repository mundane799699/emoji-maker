import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { useEmojiStore } from "@/store/emojiStore";

export function EmojiForm() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedEmoji, setGeneratedEmoji] = useState<{
    id: number;
    image_url: string;
    prompt: string;
  } | null>(null);

  const { addEmoji } = useEmojiStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-emoji", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate emoji");
      }

      const data = await response.json();
      setGeneratedEmoji(data.emoji);
      addEmoji(data.emoji);
    } catch (err) {
      setError("An error occurred while generating the emoji");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-8 space-y-4 w-full">
      <div className="flex flex-col space-y-2 w-full">
        <Input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="输入表情符号的描述"
          disabled={isLoading}
          className="w-full rounded-md"
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "生成中..." : "生成表情"}
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {generatedEmoji && (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <img
            src={generatedEmoji.image_url}
            alt={generatedEmoji.prompt}
            className="mx-auto mb-2 w-60 h-60 object-contain"
          />
          <p className="text-center text-sm text-gray-600">
            描述: {generatedEmoji.prompt}
          </p>
        </div>
      )}
    </form>
  );
}
