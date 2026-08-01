import { Box } from '@mantine/core';
import style from './Skeleton.module.scss';

interface SkeletonProps {
  times: number;
  size?: 'small' | 'medium' | 'large';
  radius?: 'xs' | 'sm' | 'md' | 'lg';
}

function Skeleton({ times, size = 'medium', radius = 'sm' }: SkeletonProps) {
  const outerClassNames = `${style.skeleton__container}`;
  const innerClassNames = `${style.skeleton} ${style[size]}`;

  return (
    <Box>
      {Array.from({ length: times }).map((_, i) => (
        <Box key={i} className={outerClassNames} style={{
            borderRadius: `var(--mantine-radius-${radius})`}}>
          <Box className={innerClassNames} style={{
            backgroundColor: 'var(--mantine-color-gray-3)',
          }} />
        </Box>
      ))}
    </Box>
  );
}

export default Skeleton;
