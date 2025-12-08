"use client";
import React, { useState } from "react";

export default function Home() {
  return (
    <div className="mx-auto my-8 w-2/4" dir="rtl">
      <audio controls>
        <source src="finale/finale.mp3" type="audio/mpeg"></source>
        Your browser does not support the audio element.
      </audio>

      <br></br>

      <p></p>
    </div>
  );
}
