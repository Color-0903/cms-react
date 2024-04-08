import React, { useState } from 'react';
import { Tabs, TabsProps } from 'antd';
import { useIntl } from 'react-intl';
import FaqTab from './faqTab';
import DocTab from './docTab';

const Help = () => {
  const intl = useIntl();
  const [tabKey, setTabKey] = useState<string>('1');

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: intl.formatMessage({
        id: 'help.tabFAQ',
      }),
      children: <FaqTab />,
    },
    {
      key: '2',
      label: intl.formatMessage({
        id: 'help.tabDoc',
      }),
      children: <DocTab />,
    },
  ];
  const onChange = (key: string) => {
    setTabKey(key);
  };
  return <Tabs defaultActiveKey="1" activeKey={tabKey} items={items} onChange={onChange} />;
};
export default Help;
