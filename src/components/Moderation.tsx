import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function ModeratedTextarea() {
  const draftId = useRef(uuidv4()).current;

  const [text, setText] = useState("");
  const [status, setStatus] = useState<"clean" | "prohibited" | "pending">("clean");
  const [message, setMessage] = useState("");
  const wsRef = useRef<WebSocket | null>(null);

  function debounce<A extends unknown[], R>(
    fn: (...args: A) => R,
    delay: number
  ) {
    let timer: ReturnType<typeof setTimeout> | null = null;

    return (...args: A) => {
      if (timer !== null) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  const sendModerationRequest = debounce(async (value: string) => {
    setStatus("pending");

    await fetch("/api/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        draft_id: draftId,
        text: value
      })
    });
  }, 300);

  useEffect(() => {
    const ws = new WebSocket("wss://yourserver/ws");
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "moderation_result" && msg.draft_id === draftId) {
        if (msg.allowed) {
          setStatus("clean");
          setMessage("");
        } else {
          setStatus("prohibited");
          setMessage("⚠️ This text contains prohibited content");
        }
      }
    };

    return () => ws.close();
  }, [draftId]);

  return (
    <div>
      <textarea
        value={text}
        onInput={(e) => {
          const value = e.currentTarget.value;
          setText(value);
          sendModerationRequest(value);
        }}
        style={{
          width: "100%",
          height: "200px",
          border: status === "clean" ? "2px solid green" :
            status === "prohibited" ? "2px solid red" :
              "2px solid orange"
        }}
      />

      {status === "pending" && <p style={{ color: "orange" }}>Checking…</p>}
      {status === "prohibited" && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
}
