"use client";

import { useRef, useState } from "react";

// Clickable email address that copies itself to the clipboard and briefly
// swaps its label for "copied!" as confirmation.
const EmailCopy = ({ email }: { email: string }) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      return; // clipboard unavailable (e.g. insecure context) — no-op
    }
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Email address copied to clipboard" : `Copy email address ${email}`}
      className="cursor-pointer text-left text-2xl font-bold transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e1e1e] sm:text-3xl"
    >
      {copied ? "copied!" : email}
    </button>
  );
};

export default EmailCopy;
