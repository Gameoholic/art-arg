// riddle 2

"use client";

import React, { useState } from "react";

const Translations = () => {
  const [isFirstHebrew, setIsFirstHebrew] = useState(true);
  const [isSecondHebrew, setIsSecondHebrew] = useState(false);

  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const paragraph1 = {
    he: (
      <p dir="rtl">
        הודעה מאור ולי: הרגע חשבנו על זה שיכול להיות שיש דוברי אנגלית שינסו
        לפתור את החידה ולא התחשבנו בהם בכלל, שיט. וגם אין בכלל כאילו רפרזנטציה
        של התרבות שלהם וזה. אוקיי שיט אנחנו שנייה מוצאים איזשהו ציטוט בגוגל
        ועושים לו תרגום שיהיה ברור גם לדוברי אנגלית וגם לדוברי עברית. חייב שלא
        יהיה שום *קשר* בין הציטוט לחידה. התרגום לא יהיה 1:1 אבל בסדר עדיף מכלום.
      </p>
    ),
    en: (
      <p>
        Message from Or and Lee: We just realized some of you might be English
        speakers and we didn't consider you at all, shit. And there's like no
        representation of english speakers' culture and stuff. OO okay there's
        this one quote that we heard on a cruise and we thought it was cool.
        There should knot be any connection between the quote and the riddle.
        The translation won't be 1:1 but that's okay, better than nothing.
      </p>
    ),
  };

  const paragraph2 = {
    he: (
      <p dir="rtl">
        זה לא העומק, אלא האורך של החיים, שמשפיע על איחוט החיים של הפרט. -ראלף
        וולדו אמרסון
      </p>
    ),
    en: (
      <p>
        It is not the length of life, but the depth of life. He who is not
        everyday conquering some fear has not learned the secret of life. -Ralph
        Waldo Emerson
      </p>
    ),
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const url = `/step2_puppet?password=${encodeURIComponent(input)}`;
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

      if (cookies.advanceToRiddle3) {
        window.location.href = cookies.advanceToRiddle3;
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
      <div>
        {isFirstHebrew ? paragraph1.he : paragraph1.en}
        <div className="flex justify-center">
          <button
            className="mt-3 h-10 w-40 rounded-lg border-gray-300 bg-white font-medium text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            onClick={() => setIsFirstHebrew(!isFirstHebrew)}
          >
            {isFirstHebrew ? "Translate to English" : "תרגם לעברית"}
          </button>
        </div>
      </div>

      <div className="mt-5">
        {isSecondHebrew ? paragraph2.he : paragraph2.en}
        <div className="flex justify-center">
          <button
            className="mt-3 h-10 w-40 rounded-lg border-gray-300 bg-white font-medium text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            onClick={() => setIsSecondHebrew(!isSecondHebrew)}
          >
            {isSecondHebrew ? "Translate to English" : "תרגם לעברית"}
          </button>
        </div>
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
};

export default function Home() {
  return (
    <div>
      <Translations></Translations>
    </div>
  );
}
