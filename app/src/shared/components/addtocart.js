import React, {useContext} from 'react';
import CartContext from '../../lib/CartContext';
import { productCatalog } from '../../temp/config';

const AddToCartButton = ({productId, variantId}) => {
    const cart = useContext(CartContext);

    const sellableItem = {
        "itemId": `${productCatalog}|${productId}|${variantId}`,
        "quantity": 1
    }

    return (
        <button className='addtocart' onClick={() => cart.actions.addCartLine(sellableItem)}>
            Add to cart
        </button>
    );
}

export default AddToCartButton;