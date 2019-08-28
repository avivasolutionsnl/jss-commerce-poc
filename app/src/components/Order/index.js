import React from 'react';
import { Text } from '@sitecore-jss/sitecore-jss-react';

const Order = (props) => (
  <div>
    <p>Thank you for ordering!</p>
    <Text field={props.fields.heading} />
  </div>
);

export default Order;
