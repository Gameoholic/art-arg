"use client";

import { useState, useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.href =
      "https://drive.google.com/drive/folders/1GTm4-Qc2o7bicJ4-ZhBS4XkLZzQPcjUy?usp=sharing";
  }, []);
}
