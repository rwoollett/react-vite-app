import type { HTMLAttributes, JSX } from 'react';
import type { StatusErrors } from '../types/statusErrors';
import style from './StatusAlert.module.scss';

interface StatusAlertProps {
  statusErrors: StatusErrors;
}

const StatusAlert = ({ statusErrors, className }: StatusAlertProps & HTMLAttributes<HTMLElement>): JSX.Element => {
  let outerClassNames = style.alert;
  if (className) {
    outerClassNames += ' ' + className;
  } 
  return (
    <div className={outerClassNames}>
      <ul>
        {statusErrors.data && statusErrors.data.errors.map(err => (
          <li key={err.message}>{err.message}</li>
        ))}
        {statusErrors.status && <li key={statusErrors.status}>{statusErrors.error}</li>}
      </ul>
    </div>
  );
};

export default StatusAlert;