// components/posts/PostStatus.tsx

import { Badge } from "@mantine/core";
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconClockFilled,
} from "@tabler/icons-react";
import type { PostStatusType } from "../../types";
import { useColorMap } from "../../theme/colorMap";

interface PostStatusProps {
  status: PostStatusType;
}

export function PostStatus({
  status,
}: PostStatusProps) {
  const { POST_STATUS_COLORS } = useColorMap();

  switch (status) {
    case "Live":
      return (
        <Badge
          size="lg"
          leftSection={
            <IconCircleCheckFilled size={12} />
          }
          bg={POST_STATUS_COLORS[6]}
          c={POST_STATUS_COLORS[2]}
        >
          Live
        </Badge>
      );

    case "PendingModeration":
      return (
        <Badge
          size="lg"
          leftSection={
            <IconClockFilled size={12} />
          }
          bg={POST_STATUS_COLORS[7]}
          c={POST_STATUS_COLORS[3]}
        >
          Moderating...
        </Badge>
      );

    case "Rejected":
      return (
        <Badge
          size="lg"
          leftSection={
            <IconCircleXFilled size={12} />
          }
          bg={POST_STATUS_COLORS[8]}
          c={POST_STATUS_COLORS[4]}
        >
          Rejected
        </Badge>
      );
  }
}