import { type ChangeEvent, type FormEvent, useState } from 'react'
import Countdown from '../components/Countdown';
import { dateAsString, toTime } from '../utility/date';
import { useAppDispatch } from '../store/reducers/store';
import { addCountdown } from '../store/actions/data';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { TABLE_VIEW } from './Table';

function CountdownCreate() {
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("00:00");
  const [isValidForm, setIsValidForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onHandleStart = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errorMessage: string[] = [];
    if (name === '') {
      errorMessage.push('Please enter event name!');
    }

    if (toTime(date, time) < new Date()) {
      errorMessage.push('Please enter event date in future time!');
    }

    setErrorMessage(errorMessage);
    if (errorMessage.length === 0) {
      setIsValidForm(true);
      dispatch(addCountdown({ id: uuidv4(), name, date: dateAsString(date), time }));
      navigate('/countdown', { state: { tableMode: TABLE_VIEW } });
    }
  };
  const onHandleCancel = () => {
    navigate('/countdown', { state: { tableMode: TABLE_VIEW } });
  };

  return (
    <form onSubmit={onHandleStart}>
      <ul>
        {errorMessage.length > 0 && errorMessage.map((err, i) => {
          return (<li key={i}>{err}</li>);
        })}
      </ul>
      <div className="field">
        <label className="label">Event Name</label>
        <div className="control">
          <input value={name}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
            className={`input ${name === '' && errorMessage.length && 'is-danger'}`}
            type="text" placeholder="e.g Alex Smith" />
        </div>
      </div>

      <div className="field">
        <label className="label">Event Date</label>
        <div className="control">
          <input value={dateAsString(date)}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setDate(new Date(event.target.value))}
            className={`input ${new Date(date) < new Date() && errorMessage.length && 'is-danger'}`}
            type="date" placeholder="event date" />
        </div>
      </div>

      <div className="field">
        <label className="label">Time (optional) Default is midnight</label>
        <div className="control">
          <input value={time}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              return setTime(event.target.value);
            }}
            className={`input`}
            type="time" placeholder="event time" />
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button type="submit" className="button is-primary">Create</button>
        </div>
        <div className="control">
          <button type="button" onClick={() => onHandleCancel()} className="button is-primary">Cancel</button>
        </div>
      </div>

      <div className='block'>
        {isValidForm && <Countdown timeTillDate={toTime(date, time)} />}
      </div>
    </form>
  )
}

export default CountdownCreate

