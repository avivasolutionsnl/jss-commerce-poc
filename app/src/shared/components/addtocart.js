import React, {useContext} from 'react';
import { CartContext } from '../../lib/commerce';
import { productCatalog } from '../../temp/config';

const AddToCartButton = ({productId, variantId, ...other}) => {
    const cart = useContext(CartContext);

    const sellableItem = {
        itemId: `${productCatalog}|${productId}|${variantId}`,
        quantity: 1,
        ...other
    };

    return (
        <button className='addtocart' onClick={() => cart.actions.addCartLine(sellableItem)}>
            Add to cart
        </button>
    );
}

export default AddToCartButton;