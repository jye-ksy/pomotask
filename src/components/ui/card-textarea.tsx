// Our modified version of shadcn's textarea for card component

import * as React from "react";
import { cn } from "~/lib/utils";
import { mergeRefs } from "react-merge-refs";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

    // Resize the textarea height based on the scroll height
    React.useEffect(() => {
      const ref = textAreaRef?.current;

      const updateTextareaHeight = () => {
        if (ref) {
          ref.style.height = "auto";
          // Set the default height to 1 line
          ref.style.height = "40px";

          if (ref?.scrollHeight > 40) {
            ref.style.height = ref?.scrollHeight + "px";
          }
        }
      };

      updateTextareaHeight();
      ref?.addEventListener("input", updateTextareaHeight);

      return () => ref?.removeEventListener("input", updateTextareaHeight);
    }, []);
    return (
      <textarea
        className={cn(
          "flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
          className,
        )}
        ref={mergeRefs([textAreaRef, ref])}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
