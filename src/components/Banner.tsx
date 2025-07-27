import { type JSX } from 'react';
import style from './Banner.module.scss';
import DateDisplay from './DateDisplay';

interface BannerProps {
  title: string;
  desc: string;
}

const Banner = ({ title, desc }: BannerProps): JSX.Element => {
  return (
    <div className={`${style.banner} `}>
      <div className={`${style.banner__container}`}>
        <h1 className={`${style.title} title`}>{title}</h1>
        <p className={`${style.desc}`}>{desc}</p>
        <div className={style.date}><DateDisplay /></div>
      </div>
    </div>);
};

export default Banner;