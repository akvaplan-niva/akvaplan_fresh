import { useEffect, useState } from "preact/hooks";
import { BlurWord } from "@/islands/BlurWord.tsx";

export function Buzzwords(
  {
    words,
  }: { words: string[] },
) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % (words?.length ?? 0));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span class="block whitespace-nowrap">
      {words && words.length > 0
        ? (
          <span class="relative inline-block">
            <BlurWord word={words[wordIndex]} trigger={wordIndex} />
          </span>
        )
        : null}
    </span>
  );
}
