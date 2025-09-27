// app/page.tsx or pages/index.tsx depending on your project structure
"use client";

import Image from "next/image";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const iconData = [
  "arbitrary1.png",
  "arbitrary3.png",
  "arbitrary15.png",
  "arbitrary21.png",
  "arbitrary26.png",
  "arbitrary134.png",
];

function SortableIcon({ id }: { id: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Image
        src={`/not_a_cyber_arg_this_is_dead_end/${id}`}
        alt="Icon"
        width={100}
        height={100}
      />
    </div>
  );
}

export default function Home() {
  const [input, setInput] = useState(iconData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [icons, setIcons] = useState(iconData);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = icons.indexOf(active.id);
      const newIndex = icons.indexOf(over.id);
      const newIcons = arrayMove(icons, oldIndex, newIndex);
      setIcons(newIcons);
      setInput(newIcons);
      console.log("new input, ", newIcons);
    }
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const url = `/step3_assaultongiant?order=${encodeURIComponent(input.toString())}`;
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

      let penaltyString = response.headers.get("penalty");
      if (penaltyString != null) {
        setError(
          `יש להמתין ${penaltyString} שניות עד לניחוש הבא. הפתרון לא דורש ניחוש קומבינציות.`,
        );
      } else if (cookies.advanceToRiddle4) {
        window.location.href = cookies.advanceToRiddle4;
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
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "250px",
          width: "100%",
          overflowX: "auto",
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={icons}
            strategy={horizontalListSortingStrategy}
          >
            <div style={{ display: "flex", gap: "10px" }}>
              {icons.map((id) => (
                <SortableIcon key={id} id={id} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div className="mt-5 flex flex-col items-center gap-3">
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
