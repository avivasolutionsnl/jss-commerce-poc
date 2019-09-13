import React from 'react';
import { abandonSession } from '../../lib/commerce/tracking';

const AbandonButton = () => (
  <button className="abandon-session" onClick={abandonSession}>Abandon session</button>
);

export default AbandonButton;
