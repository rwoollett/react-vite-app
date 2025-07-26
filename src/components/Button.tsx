import { type HTMLAttributes, type ButtonHTMLAttributes } from 'react';
import className from 'classnames';
import style from './Button.module.scss';

interface ButtonProps {
  rounded?: boolean;
  outline?: boolean;
  primary?: boolean;
  secondary?: boolean;
  success?: boolean;
  warning?: boolean;
  danger?: boolean;
}

type RequireOnlyOne<T, Keys extends keyof T = keyof T> = 
  Omit<T, Keys> 
  & 
  {     
    [K in keyof Required<T>]  : Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;   
  }[Keys];

type ButtonPropsCheck = RequireOnlyOne<ButtonProps, 'primary'|'secondary'|'success'|'warning'|'danger'>


function Button({ 
  children, 
  rounded, 
  outline, 
  primary, 
  secondary, 
  success, 
  warning, 
  danger,
  ...rest 
}: (Partial<ButtonPropsCheck> & HTMLAttributes<HTMLElement> & ButtonHTMLAttributes<HTMLElement> ) ) {
  const classes = className(
    rest.className,
    style.button,     {
    [style.primary]: primary,
    [style.secondary]: secondary,
    [style.success]: success,
    [style.warning]: warning,
    [style.danger]: danger,
    [style.rounded]: rounded,
    [style.outline]: outline,
    [style.textBlue]: outline && primary,
    [style.textGray]: outline && secondary,
    [style.textGreen]: outline && success,
    [style.textYellow]: outline && warning,
    [style.textRed]: outline && danger
  });

  return (<button {...rest} className={classes}>{children}</button>);
}

Button.propTypes = {
  checkVariationValue: ({ primary, secondary, success, warning, danger }: ButtonProps) => {
    const count = Number(!!primary)
      + Number(!!secondary)
      + Number(!!success)
      + Number(!!warning)
      + Number(!!danger);

    if (count > 1) {
      return new Error('Only one of primary, secondary, success, warning, danger can be true.');
    }
  }
};

export default Button;