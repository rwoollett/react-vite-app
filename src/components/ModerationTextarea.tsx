import { Box, Badge, Group, Text, Textarea } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useWebSocket } from "../hooks/use-websocket-context";
import type { ModerateResult } from "../types";
import { http } from "../utility/fetchData";

export default function ModeratedTextarea() {
  const { gatewayUserId, livePostMessageQueue, lastProcessedLivePostSeq, setLastProcessedLivePostSeq } = useWebSocket();

  const draftId = useRef(uuidv4()).current;

  const [text, setText] = useState("");
  const [status, setStatus] = useState<"clean" | "prohibited" | "pending">("clean");
  const [moderateResult, setModerateResult] = useState<ModerateResult | null>(null);
  const [message, setMessage] = useState("");
  const labels = [
    "toxic",
    "severe_toxic",
    "obscene",
    "threat",
    "insult",
    "identity_hate"
  ] as const;

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

    try {
      const apiUrl = `${import.meta.env.VITE_LIVEPOSTS_URL}`;
      const reqInit = {
        body: JSON.stringify({ id: draftId, userId: gatewayUserId, value }),
        method: "PUT"
      };
      await http<{ createPost: ModerateResult }>(`${apiUrl}/api/v1/liveposts/moderate`, reqInit);

    } catch (_err) {
      console.warn("Moderate Job not authenticated.");
    }

    // await fetch("/api/v1/liveposts/moderate", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     draft_id: draftId,
    //     text: value
    //   })
    // });
  }, 500);

  useEffect(() => {
    let updatedSeq = lastProcessedLivePostSeq;
    //console.log('\n*MODERATION*client lastProcessedLivePostSeq', updatedSeq);

    for (const { seq, msg } of livePostMessageQueue) {
      if (seq > updatedSeq) {
        //console.log(' -- client', updatedSeq, seq, msg);
        if (msg.subject === "liveposts_moderate_Result" && msg.payload.id === draftId) {
          if (msg.payload.isRejected) {
            setStatus("prohibited");
            setMessage("⚠️ This text contains prohibited content");
            setModerateResult(msg.payload);
          } else {
            setStatus("clean");
            setMessage("");
            setModerateResult(null);
          }
        }
        updatedSeq = seq;
      }
    }
    //console.log('client looped live[post updatesSeq', updatedSeq, lastProcessedLivePostSeq);
    if (updatedSeq !== lastProcessedLivePostSeq) {
      //console.log('lastProcessedTTTSeq', updatedSeq);
      setLastProcessedLivePostSeq(updatedSeq);
    }

  }, [livePostMessageQueue, draftId, lastProcessedLivePostSeq, setLastProcessedLivePostSeq]);

  return (
    <div>
      <Textarea
        label="Content"
        value={text}
        onChange={(e) => {
          //console.log('Moderation on change');
          const value = e.currentTarget.value;
          setText(value);
          sendModerationRequest(value);
        }}
        minRows={14}
        autosize={false}
        styles={{
          input: {
            minHeight: 300,
            borderRadius: 6,
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
            width: "100%",
            border: status === "clean" ? "2px solid green" :
              status === "prohibited" ? "2px solid red" :
                "2px solid orange"
          }
        }}
      />
      <Text
        size="sm"
        mt={4}
        style={{
          minHeight: 24, // reserve space
          display: "flex",
          alignItems: "center",
          color:
            status === "pending"
              ? "orange"
              : status === "prohibited"
                ? "red"
                : "black"
        }}
      >
        {status === "clean"
          ? "Content acceptable"
          : status === "pending"
            ? "Checking…"
            : message
        }
      </Text>

      <Box
        style={{
          minHeight: 32, // height of one badge row
          display: "flex",
          alignItems: "center"
        }}
      >
        <Group gap="xs">
          {moderateResult !== null
            ? moderateResult.matchedLabels.map(label => {
              const idx = labels.indexOf(label as typeof labels[number]);

              return (
                <Badge
                  key={label}
                  color="red"
                  variant="light"
                >
                  {label} {(moderateResult.probabilities[idx] * 100).toFixed(0)}%
                </Badge>
              );
            })
            : null}
        </Group>
      </Box>
    </div>
  );
}
