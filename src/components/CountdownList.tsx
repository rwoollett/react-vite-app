import { useNavigate } from "react-router-dom";
import SortableTable from "./SortableTable";
import type { ConfigAction, ConfigColumn, ConfigEdit, ConfigTable } from "./Table";
import { useAppDispatch, useAppSelector } from "../store/reducers/store";
import type { CountdownTimer } from "../types/countdown";
import Countdown from "./Countdown";
import { toTime } from "../utility/date";
import { removeCountdown } from '../store/actions/data';

function CountdownList() {
  const countdowns = useAppSelector((state) => {
    return state.data.timers;
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const configCoumns: ConfigColumn<CountdownTimer>[] = [
    {
      label: "Name",
      render: (timer: CountdownTimer) => timer.name,
      sortValue: (timer: CountdownTimer) => timer.name
    },
    {
      label: "Time",
      render: (timer: CountdownTimer) => toTime(new Date(timer.date), timer.time).toLocaleString(),
      sortValue: (timer: CountdownTimer) => toTime(new Date(timer.date), timer.time).getTime()
    },
    {
      label: "Countdown",
      render: (timer: CountdownTimer) => <Countdown timeTillDate={toTime(new Date(timer.date), timer.time)} />,
      sortValue: (timer: CountdownTimer) => toTime(new Date(timer.date), timer.time).getTime()
    }

  ];

  const configEdit: ConfigEdit<CountdownTimer>[] = [
    {
      label: "Remove",
      execute: (item: CountdownTimer) => {
        dispatch(removeCountdown(item));
      }
    },
  ];
  const configAction: ConfigAction[] = [
    {
      label: "Create",
      execute: () => {
        navigate("create");
      }
    },
  ];

  const config: ConfigTable<CountdownTimer> = {
    columns: configCoumns,
    edit: configEdit,
    action: configAction
  }

  const keyFn = (timer: CountdownTimer) => {
    return timer.id;
  };

  return <div>
    <SortableTable data={countdowns} config={config} keyFn={keyFn} />
  </div>

}

export default CountdownList;