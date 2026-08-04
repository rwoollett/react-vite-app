import { useState, type FormEvent } from "react";
import { Paper, TextInput, Button, Stack, Group, Text } from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import Countdown from "../components/Countdown";
import { dateAsString, toTime } from "../utility/date";
import { useAppDispatch } from "../store/reducers/store";
import { addCountdown } from "../store/actions/data";
import { TABLE_EDIT, TABLE_VIEW } from "./TableModes";
import { useColorMap } from "../theme/colorMap";

function CountdownCreate() {
  const [name, setName] = useState("");
  const [date, setDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState("00:00");
  const [isValidForm, setIsValidForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string[]>([]);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { surfaceBg, surfaceText } = useColorMap();

  const onHandleStart = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors: string[] = [];

    if (name.trim() === "") {
      errors.push("Please enter event name!");
    }

    if (date && toTime(date, time) < new Date()) {
      errors.push("Please enter event date in future time!");
    }

    setErrorMessage(errors);

    if (errors.length === 0 && date) {
      setIsValidForm(true);
      dispatch(
        addCountdown({
          id: uuidv4(),
          name,
          date: dateAsString(date),
          time,
        })
      );
      navigate("/countdown", { state: { tableMode: TABLE_VIEW } });
    }
  };

  const onHandleCancel = () => {
    navigate("/countdown", { state: { tableMode: TABLE_EDIT } });
  };

  return (
    <Paper p="lg" radius="md" shadow="sm" bg={surfaceBg} c={surfaceText}>
      <form onSubmit={onHandleStart}>
        <Stack gap="md">
          {/* Error messages */}
          {errorMessage.length > 0 && (
            <Stack gap={4}>
              {errorMessage.map((err, i) => (
                <Text key={i} c="red" fw={600}>
                  {err}
                </Text>
              ))}
            </Stack>
          )}

          {/* Event Name */}
          <TextInput
            label="Event Name"
            placeholder="e.g. Alex Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={name === "" && errorMessage.length > 0 ? "Required" : undefined}
          />

          {/* Event Date */}
          <DatePickerInput
            label="Event Date"
            value={date}
            onChange={(e) => { if (e) setDate(new Date(e)) }}
            error={
              date && date < new Date() && errorMessage.length > 0
                ? "Date must be in the future"
                : undefined
            }
          />

          {/* Event Time */}
          <TimeInput
            label="Time (optional) — default is midnight"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          {/* Buttons */}
          <Group justify="flex-start">
            <Button type="submit" variant="outline" color="gray">
              Create
            </Button>
            <Button type="button" variant="outline" color="gray" onClick={onHandleCancel}>
              Cancel
            </Button>
          </Group>

          {/* Live Countdown Preview */}
          {isValidForm && date && (
            <Countdown timeTillDate={toTime(date, time)} />
          )}
        </Stack>
      </form>
    </Paper>
  );
}

export default CountdownCreate;
