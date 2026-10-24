"use client";

import { useState } from "react";

/** "Was this article helpful?" Front-end only for now — wire it to analytics when available. */
export function ArticleFeedback({ question, thanks }: { question: string; thanks: string }) {
  const [answered, setAnswered] = useState(false);
  if (!question) return null;
  return (
    <div className="flex min-h-[74px] flex-wrap items-center justify-between gap-4 rounded-[16px] bg-tint-100 px-[22px] py-4" role="status">
      {answered ? (
        <b className="text-[15.5px] text-accent-700">{thanks}</b>
      ) : (
        <>
          <b className="text-[15.5px] text-heading">{question}</b>
          <span className="flex gap-2">
            {["Yes", "No"].map((answer) => (
              <button
                key={answer}
                type="button"
                className="h-[42px] cursor-pointer rounded-[10px] border border-line-strong bg-white px-[18px] text-[14px] font-extrabold text-heading transition-colors hover:border-primary hover:text-primary"
                onClick={() => setAnswered(true)}
              >
                {answer}
              </button>
            ))}
          </span>
        </>
      )}
    </div>
  );
}
