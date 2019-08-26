import React from 'react';

const Price = ({currencyCode, amount}) => {
    return (
      <div className='product__price'>
        <span className='product__price__currency'>
          {currencyCode}
        </span>  
        <span className='product__price__price'>
          {amount}
        </span>
      </div>
    );
  };

  export default Price;