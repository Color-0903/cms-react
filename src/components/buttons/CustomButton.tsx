import { Button, ButtonProps } from 'antd';
import React from 'react';

interface CustomButtonProps extends ButtonProps {}

const CustomButton: React.FC<CustomButtonProps> = (props) => {
  let buttonClassName = 'ant-custom-button';
  const updateProps = { ...props };
  if (props.className) {
    buttonClassName = buttonClassName + ' ' + props.className;

    delete updateProps.className;
  }
  return <Button className={buttonClassName} {...updateProps} />;
};

export default CustomButton;
