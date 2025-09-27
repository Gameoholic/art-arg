// riddle 4

"use client";

import React, { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const url = `/stepa4_attackontitan?password=${encodeURIComponent(input)}`;
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      //await new Promise((r) => setTimeout(r, 200));

      const cookies = document.cookie
        .split("; ")
        .reduce((acc: Record<string, string>, curr) => {
          const [name, ...rest] = curr.split("=");
          acc[name] = rest.join("=");
          return acc;
        }, {});

      if (cookies.advanceToRiddle5) {
        window.location.href = cookies.advanceToRiddle5;
      } else {
        setError("טעות.");
      }
    } catch (err) {
      console.error(err);
      setError("אירעה תקלה טכנית, אנא נסו שוב. זה לא חלק מהחידה.");
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto my-8 w-2/4">
      <div className="mt-5 flex flex-col items-center gap-3">
        <a
          href="/stepa4_attackontitan.jpg"
          className="text-blue-600 hover:underline"
        >
          stepa4_attackontitan.jpg
        </a>
      </div>

      <div className="mt-5 flex flex-col items-center gap-3">
        <label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="rounded border p-2"
          />
        </label>
        <button
          dir="rtl"
          onClick={handleSubmit}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "בודק..." : "שליחה"}
        </button>
        {error && (
          <p dir="rtl" className="text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
