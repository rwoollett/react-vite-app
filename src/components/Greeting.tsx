import { useGeolocationQuery } from "../store/api/ipApi";
import style from './Greeting.module.scss';
import classnames from 'classnames';
import Skeleton from "./Skeleton";
//import { useAppSelector } from "../store/reducers/store";

interface GreetingProps {
  name: string;
}

const Greeting = ({ name }: GreetingProps) => {
  const { data, error, isFetching, isLoading } = useGeolocationQuery();

  let content;
  if (isLoading) {
    content = <Skeleton times={1} className={style.greeting} />;
  } else if (error) {
    content = 'A problem with Geolocation';
  } else {
    const geoLocationDetail = data && `${data?.query} ${data?.city} ${data?.regionName} ${data?.country} ${data?.zip} ${data?.lon} ${data?.lat} ${data?.timezone}`
    content = (<div>
      {`Hello ${name} you have successfully logged in!`}
      {` ${geoLocationDetail}`}
    </div>);
  }

  const classDiv = classnames(
    style.greeting,
    {
      [style.disabled]: isFetching
    }
  );
  return (
    <div className={classDiv}>
      {content}
    </div>
  )
};

export default Greeting;
