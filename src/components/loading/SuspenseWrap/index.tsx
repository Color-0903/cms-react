import { Spin } from 'antd';
import { random } from 'lodash';
import { Suspense } from 'react';

interface SuspenseWrapperProps {
  component: React.ReactNode;
}
export const SuspenseWrapper = (props: SuspenseWrapperProps) => {
  return (
    <Suspense
      key={'suspense-' + random(10)}
      fallback={
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spin size="large" />
        </div>
      }
    >
      {props.component}
    </Suspense>
  );
};
