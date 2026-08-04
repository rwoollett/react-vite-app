import { useEffect, useState } from "react";
import { Paper, Text, Group } from "@mantine/core";
import { useColorMap } from "../theme/colorMap";

function Countdown({ timeTillDate }: { timeTillDate: Date }) {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [done, setDone] = useState(false);

  const { countdownItemBg, countdownItemText } = useColorMap();

  useEffect(() => {
    const secondInterval = setInterval(() => {
      const now = Date.now();
      const timeTill = timeTillDate.getTime();
      const distance = timeTill - now;

      setDays(Math.floor(distance / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      setSeconds(Math.floor((distance % (1000 * 60)) / 1000));

      if (now >= timeTill) {
        clearInterval(secondInterval);
        setDone(true);
        setDays(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
      }
    }, 1000);

    return () => clearInterval(secondInterval);
  }, [timeTillDate]);

  const renderItem = (value: number | string, label: string) => (
    <Paper
      w={50}
      h={50}
      p={4}
      radius="md"
      shadow="sm"
      bg={countdownItemBg}
      c={countdownItemText}
      withBorder
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: 600,
        lineHeight: "20px",
      }}
    >
      <Text fw={700}>{value}</Text>
      {!done && (
        <Text fz={9} fw={600} tt="uppercase">
          {label}
        </Text>
      )}
    </Paper>
  );

  return (
    <Group justify="center" gap="md">
      {renderItem(done ? "D" : days, "days")}
      {renderItem(done ? "O" : hours, "hours")}
      {renderItem(done ? "N" : minutes, "minutes")}
      {renderItem(done ? "E" : seconds, "seconds")}
    </Group>
  );
}

export default Countdown;
