import React, {useContext} from 'react';
import { CartContext } from '../../lib/commerce';
import {NavLink} from 'react-router-dom';

const CartLink = () => {
    const cart = useContext(CartContext);
       
    let itemCount;
    if(!cart || !cart.data) {
        itemCount = 0;
    } else {
        itemCount = cart.data.ItemCount;
    }

    return <NavLink to='/cart'>
        Cart ({itemCount})
    </NavLink>
  };

  export default CartLink;