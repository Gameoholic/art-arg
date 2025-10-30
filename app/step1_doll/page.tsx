"use client";
import React, { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const url = `/step1_doll?password=${encodeURIComponent(input)}`;
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

      if (cookies.advanceToRiddle2) {
        window.location.href = cookies.advanceToRiddle2;
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
    <div className="mx-auto my-8 w-2/4" dir="rtl">
      <p dir="rtl">16/4/1968 היומן של דניאל - פרק 2</p>
      <br></br>
      <p dir="rtl">
        אור ולי החליטו להציל אותי וחשבו שזה יהיה ממש מצחיק לגרום לי ליצור את
        החידה החמישית. מה שהם לא יודעים, זה שאני לא הולך ליצור שום חידה. אני
        הולך לגרום להם לחשוב שאני עושה משהו סופר מתוחכם וקשה לפיצוח, כשבמציאות
        אני אתן לכל מי שירצה לעבור לשלב הבא. זו הנקמה שלי. אם מישהו קורא את זה,
        כנראה שאתם לא שפויים והחלטתם להתעלם מהפתרון שאני עומד לכתוב לחידה הזו.
        בכל אופן, החידה שאלה מה השם של החיה האהובה על אור ולי. אני אתן רמז,
        והרמז הזה רלוונטי לכל השלבים בחידה: סתכלו מסביב טוב טוב, כולל גם על הים
        וגם על הדברים שצפים בו.
      </p>

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
