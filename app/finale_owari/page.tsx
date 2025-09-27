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

      <p>
        こんにちは。 ダニエル・タラッシュクです。
        このイスターエッグを見つけてくれてありがとうございます。 I wasn't sure
        how to end this riddle, so I thought to do a tribute to the original
        riddle and end it in the same way. I'm not actually sure if anyone is
        reading this at the time of me writing this, or if I just wasted one
        week of my life making this. Either way, I'm gonna go back to working on
        my projects and actually doing stuff that I postponed for the sake of
        the painting and this project. Or and Tom, I've watched you guys since I
        was a kid, and I know you get this a lot, but you guys really did impact
        my life a ton. If I were to impact other people in the same way, that'd
        be a dream come true. So just making you something like this and you
        receiving it really means a lot to me.
        というわけで、ここまで聞いてくれて本当にありがとう。 じゃあね！
      </p>
    </div>
  );
}
