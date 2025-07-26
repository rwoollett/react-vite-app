import type { HTMLAttributes, JSX } from "react";
import style from './Skeleton.module.scss';

interface SkeletonProps {
  times: number;
}

function Skeleton({ times, className }: SkeletonProps & HTMLAttributes<HTMLElement>): JSX.Element {
  let outerClassNames = style.skeleton__container;
  if (className) {
    outerClassNames += ' ' + className;
  } 
  const innerClassNames = style.skeleton;
  const boxes = Array(times)
    .fill(0)
    .map((_, i) => 
      (
        <div key={i} className={outerClassNames}>
          <div className={innerClassNames}></div>
        </div>
      ));

  return (<div>{boxes}</div>);
}

export default Skeleton;

