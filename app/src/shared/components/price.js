import React from 'react';

const Price = ({currencyCode, amount}) => {
    return (
      <div className='price'>
        <span className='price__currency'>
          {currencyCode}
        </span>  
        <span className='price__price'>
          {amount}
        </span>
      </div>
    );
  };

  export default Price;