"use client";

import { useState, useEffect } from "react";
import React from "react";
export default function Home() {
  const [serverTextChanged, setServerTextChanged] = useState(false);
  const [serverText, setServerText] = useState("");
  const [input, setInput] = useState("/");
  const [loading, setLoading] = useState(false);
  const [gameFinished, setGameFinished] = useState("");

  useEffect(() => {
    async function displayLastMessage() {
      try {
        const res = await fetch("/api/commands/command", {
          method: "POST",
          headers: {},
          body: JSON.stringify({ command: "/lastmessage" }),
          credentials: "include",
        });

        const data = await res.json();
        setServerText(data);
        setServerTextChanged(true);
      } catch (error) {}
    }

    displayLastMessage();
  }, []);

  async function processCommand() {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/commands/command", {
        method: "POST",
        headers: {},
        body: JSON.stringify({ command: input }),
        credentials: "include",
      });

      const data = await res.json();
      if (data.includes("ACCESS DENIED")) {
        console.error(`Error running /search_chest command: error intercept-console-error.ts:44
    processCommand page.tsx:28
    onKeyDown page.tsx:53
    executeDispatch react-dom-client.development.js:16970
    runWithFiberInDEV react-dom-client.development.js:874
    processDispatchQueue react-dom-client.development.js:17020
    dispatchEventForPluginEventSystem react-dom-client.development.js:17621
    batchedUpdates$1 react-dom-client.development.js:3311
    dispatchEventForPluginEventSystem react-dom-client.development.js:17174
    dispatchEvent react-dom-client.development.js:21358
    dispatchDiscreteEvent react-dom-client.development.js:21325
    (Async: EventListener.handleEvent)
    addTrappedEventListener react-dom-client.development.js:17121
    listenToNativeEvent react-dom-client.development.js:17057
    listenToAllSupportedEvents react-dom-client.development.js:17069
    listenToAllSupportedEvents react-dom-client.development.js:17066
    hydrateRoot react-dom-client.development.js:25738
    hydrate app-index.tsx:291
    startTransition React
    hydrate app-index.tsx:290
    <anonymous> app-next-turbopack.ts:13
    appBootstrap app-bootstrap.ts:76
    loadScriptsInSequence app-bootstrap.ts:22
    appBootstrap app-bootstrap.ts:58
    <anonymous> app-next-turbopack.ts:10
    instantiateModule dev-base.ts:241
    runModuleExecutionHooks dev-base.ts:275
    instantiateModule dev-base.ts:235
    getOrInstantiateRuntimeModule dev-base.ts:128
    registerChunk runtime-backend-dom.ts:57
    registerChunk dev-base.ts:1146
    NextJS 2
    RCP STACK:
    CLIENT WARNING: No password was provided for /search_chest command. Flagging operation as false to save server bandwidth for hashing password.
    CLIENT WARNING: Converted command "server:[/search_chest[password=NONE]]" to "server:[/search_chest_result:false]".
    REQUEST TO SERVER: "server:[/search_chest_result:false]"
    RESPONSE FROM SERVER: "client:[deny:/search_chest,display_error_to_user:true]
    `);
      }
      if (data.includes("FINISH_")) {
        setServerText("לי: לאאאאאאאאאאאאאאאאאאא");
        setServerTextChanged(true);
        setGameFinished(data.split("FINISH_")[1]);
      } else {
        setServerText(data);
        setServerTextChanged(true);
      }
    } catch (error) {
      console.error("Error processing command: ", error);
    } finally {
      setLoading(false);
    }
  }

  function getWeightedRandomDelay() {
    const choices = [
      { value: 50, weight: 0.4 },
      { value: 60, weight: 0.4 },
      { value: 70, weight: 0.19 },
      { value: 100, weight: 0.01 },
    ];

    const rand = Math.random();
    let sum = 0;

    for (const choice of choices) {
      sum += choice.weight;
      if (rand < sum) return choice.value;
    }

    return choices[0].value;
  }

  function Timer({ testString }: { testString: string }) {
    if (!serverTextChanged) {
      return (
        <div className="mx-auto my-8 w-1/4" dir="rtl">
          <p className="min-h-30">
            {testString?.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
        </div>
      );
    }
    const [currentString, setCurrentString] = useState("");
    const [letterIndex, setLetterIndex] = useState(0);
    const [finished, setFinished] = useState(false);
    useEffect(() => {
      const timeout = setTimeout(
        () => {
          if (letterIndex < testString.length) {
            setCurrentString(" " + testString.substring(0, letterIndex + 1));
            setLetterIndex(letterIndex + 1);
            //console.log(currentString);
          } else {
            setFinished(true);
          }
          if (currentString.includes("לאאאאאאאאאאאא")) {
            window.location.href = gameFinished;
          }
        },
        currentString.includes("\n") // torches
          ? getWeightedRandomDelay() / 2
          : getWeightedRandomDelay(),
      );
      if (letterIndex == testString.length) {
        setServerTextChanged(false);
      }
      return () => clearTimeout(timeout);
    }, [letterIndex, finished]);

    useEffect(() => {
      // if (lineIndex < text.length) {
      //   if (currentString.includes("אני מאחל לכם בהצלחה.")) {
      //     redirect("/step6_dungeonsanddragons");
      //   }
      // }
    }, [currentString]);

    return (
      <div className="mx-auto my-8 w-1/4" dir="rtl">
        <p className="min-h-30">
          {currentString?.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mt-5 flex flex-col items-center gap-3">
        <Timer testString={serverText} />
        <label>
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setServerTextChanged(false);
              setInput(
                e.target.value.startsWith("/")
                  ? e.target.value
                  : "/" + e.target.value,
              );
            }}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                processCommand();
              }
            }}
            className="rounded border p-2"
          />
        </label>
        <button
          dir="rtl"
          onClick={processCommand}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "שולח..." : "שליחה"}
        </button>
      </div>
    </div>
  );
}
