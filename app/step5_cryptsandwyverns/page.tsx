"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";

export default function Home() {
  const text: string[] = [
    "שלום.",
    "זה אני, שוב.",
    "לי ואור הצילו אותי, ואמרו לי שהם רוצים שאני אהיה חלק מהחידה.",
    "הם הכריחו אותי לכתוב חידה וסיפור שלם בו אני הופך לנוול, ומשקר לכם שאור ולי לא קשורים לחידה, ושאני הכנתי את הכל.",
    "בהתחלה הייתם חוקרים אותי, מגלים על התחביבים שלי ועל זה שאני 'עוקב אחריכם' במשך כל החידה. הם אפילו נתנו לי גישה ל-webcams שלכם.",
    "הייתי אמור לשנוא אתכם, ואז בסוף להתברר שאתם דווקא בסדר ושהנוולים האמיתיים הם אור ולי.",
    "אבל נמאס לי. נמאס לי מכל ה-mind games האלו.",
    "אני רוצה שתביסו אותם אחת ולתמיד. בלי שום חידות. בלי שום התעללות.",
    "אני אתן לכם עכשיו גישה לחדר הבא. ממה שראיתי יהיה קשה להביס אותם.",
    "אני מאחל לכם בהצלחה.",
  ];

  function getWeightedRandomDelay() {
    const choices = [
      { value: 50, weight: 0.4 },
      { value: 80, weight: 0.4 },
      { value: 10, weight: 0.19 },
      { value: 500, weight: 0.01 },
    ];

    const rand = Math.random();
    let sum = 0;

    for (const choice of choices) {
      sum += choice.weight;
      if (rand < sum) return choice.value;
    }

    return choices[0].value;
  }

  function Timer() {
    const [currentString, setCurrentString] = useState("");
    const [lineIndex, setLineIndex] = useState(0);
    const [letterIndex, setLetterIndex] = useState(0);
    const [isWaiting, setIsWaiting] = useState(false); // ⏱ Pause state
    const [showCursor, setShowCursor] = useState(false); // blinking cursor
    const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
    const [webcamError, setWebcamError] = useState<string | null>(null);

    useEffect(() => {
      if (lineIndex >= text.length || isWaiting) return;

      const currentLine = text[lineIndex];

      const timeout = setTimeout(() => {
        if (letterIndex < currentLine.length) {
          setCurrentString(" " + currentLine.substring(0, letterIndex + 1));
          setLetterIndex(letterIndex + 1);
        } else {
          // Finished line, start 3s pause
          setIsWaiting(true);
          setShowCursor(true); // Start blinking

          const pauseTimeout = setTimeout(() => {
            setIsWaiting(false);
            setShowCursor(false);
            setLineIndex(lineIndex + 1);
            setLetterIndex(0);
            setCurrentString(" ");
          }, 3000);

          return () => clearTimeout(pauseTimeout);
        }
      }, getWeightedRandomDelay());

      return () => clearTimeout(timeout);
    }, [letterIndex, lineIndex, isWaiting]);

    // Cursor blinking animation during pause
    useEffect(() => {
      if (!isWaiting) return;

      const blinkInterval = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 500); // Toggle every 500ms

      return () => clearInterval(blinkInterval);
    }, [isWaiting]);

    // Request webcam access exactly when the line includes "webcams"
    useEffect(() => {
      if (lineIndex < text.length) {
        if (
          currentString.includes("webcams") &&
          !webcamStream &&
          !webcamError
        ) {
          navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => {
              setWebcamStream(stream);
            })
            .catch((err) => {
              console.error("Error accessing webcam:", err);
              setWebcamError("לא ניתן לגשת למצלמה");
            });
        }
      }
    }, [currentString, webcamStream, webcamError]);

    useEffect(() => {
      if (lineIndex < text.length) {
        if (currentString.includes("אני מאחל לכם בהצלחה.")) {
          redirect("/step6_dungeonsanddragons");
        }
      }
    }, [currentString]);

    return (
      <div className="mx-auto my-8 w-1/4" dir="rtl">
        <p>
          דניאל:
          {currentString}
          {isWaiting && showCursor ? "|" : ""}
        </p>
        {/* If webcam access granted, show the video */}
        {webcamStream && (
          <video
            autoPlay
            playsInline
            muted
            ref={(video) => {
              if (video && webcamStream) {
                video.srcObject = webcamStream;
              }
            }}
            style={{ width: "300px", marginTop: "1rem" }}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <Timer />
    </div>
  );
}
