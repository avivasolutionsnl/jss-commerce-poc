import React, { useContext } from 'react';
import CartContext from '../../lib/CartContext';

const AddCartLineButton = ({onAddCartLine, title, sellableItem}) => {
  return (
    <button onClick={() => onAddCartLine(sellableItem)}>
        {title}
    </button>
  );
}

const AddNomadPhone = (props) => {
  const sellableItem = {
    "itemId": "Habitat_Master|6042305|56042305",
    "quantity": 1
  }

  return <AddCartLineButton title="Add Nomad phone" sellableItem={sellableItem} {...props} />
}

const AddInstaClix = (props) => {
  const sellableItem = {
    "itemId": "Habitat_Master|7042066|57042066",
    "quantity": 1
  }

  return <AddCartLineButton title="Add InstaClix camera" sellableItem={sellableItem} {...props} />
}

// TODO: Make a React Commerce component library, e.g. based on https://react-bootstrap.github.io/
const CartLine = ({onRemoveCartLine, CartLineComponents, Id, Quantity, Totals}) => {
  const cartProductComponent = CartLineComponents.find(e => e['@odata.type'] === '#Sitecore.Commerce.Plugin.Carts.CartProductComponent');
  const price = `${Totals.GrandTotal.CurrencyCode} ${Totals.GrandTotal.Amount}`;

  // TODO: make static text translatable
  return (
    <article className="cartline">
      <h2 className="cartline__name">{cartProductComponent.DisplayName}</h2>
      <p className="cartline__quantity">Quantity: {Quantity}</p>
      <p className="cartline__price">{price}</p>
      <button onClick={() => onRemoveCartLine(Id)}>Remove</button>
    </article>
  );
};

const Cart = () => {
  const cart = useContext(CartContext);
  
  let cartLines = <p>Your cart is empty!</p>;
  let total = null;
  
  const data = cart.data;
  if (data != null && data.Lines.length > 0) {
    cartLines = data.Lines.map((item, key) => <CartLine key={key} onRemoveCartLine={cart.actions.removeCartLine} {...item} />);

    const grandTotal = data.Totals.GrandTotal;
    const price = `${grandTotal.CurrencyCode} ${grandTotal.Amount}`;
    total = <p className="cart__price">Total {price}</p>;
  }

  // TODO: Make static text translatable
  return (
      <article className="cart">
        <header>
          <h1 className="cart__title">Cart</h1>
        </header>
        <section>{cartLines}</section>
        <footer>
          {total}
          <AddNomadPhone onAddCartLine={cart.actions.addCartLine} />
          <AddInstaClix onAddCartLine={cart.actions.addCartLine} />
        </footer>
      </article>
  )
};

export default Cart;
