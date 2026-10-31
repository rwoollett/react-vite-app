// components/posts/PostStatus.tsx

import { Badge } from "@mantine/core";
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconClockFilled,
} from "@tabler/icons-react";
import type { PostStatusType } from "../../types";

interface PostStatusProps {
  status: PostStatusType;
}

export function PostStatus({
  status,
}: PostStatusProps) {
  switch (status) {
    case "Live":
      return (
        <Badge
          color="green"
          size="lg"
          leftSection={
            <IconCircleCheckFilled size={12} />
          }
          variant="light"
        >
          Live
        </Badge>
      );

    case "PendingModeration":
      return (
        <Badge
          color="yellow"
          size="lg"
          leftSection={
            <IconClockFilled size={12} />
          }
          variant="light"
        >
          Pending Moderation
        </Badge>
      );

    case "Rejected":
      return (
        <Badge
          color="red"
          size="lg"
          leftSection={
            <IconCircleXFilled size={12} />
          }
          variant="light"
        >
          Rejected
        </Badge>
      );
  }
}