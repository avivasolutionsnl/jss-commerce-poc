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

function mapToCartLineProps({CartLineComponents, Id, Quantity, Totals}) {
  const cartProductComponent = CartLineComponents.find(e => e['@odata.type'] === '#Sitecore.Commerce.Plugin.Carts.CartProductComponent');
  const price = `${Totals.GrandTotal.CurrencyCode} ${Totals.GrandTotal.Amount}`;

  return {
    id: Id,
    displayName: cartProductComponent.DisplayName,
    quantity: Quantity,
    price: price
  }
}

const CartLine = ({onRemoveCartLine, id, displayName, quantity, price}) => {
  // TODO: make static text translatable
  return (
    <article className="cartline">
      <h2 className="cartline__name">{displayName}</h2>
      <p className="cartline__quantity">Quantity: {quantity}</p>
      <p className="cartline__price">{price}</p>
      <button onClick={() => onRemoveCartLine(id)}>Remove</button>
    </article>
  );
};

function mapToCartProps({Totals, Lines}) {
  const grandTotal = Totals.GrandTotal;
  const totalPrice = `${grandTotal.CurrencyCode} ${grandTotal.Amount}`;

  return {
    totalPrice: totalPrice,
    lines: Lines
  }
}

const Cart = () => {
  const cart = useContext(CartContext);
  
  let cartLines = <p>Your cart is empty!</p>;
  let total = null;

  if (cart.data != null) {
    const data = mapToCartProps(cart.data);

    if (data.lines.length > 0) {
      cartLines = data.lines.map((line, key) => <CartLine key={key} onRemoveCartLine={cart.actions.removeCartLine} {...mapToCartLineProps(line)} />);
      total = <p className="cart__price">Total {data.price}</p>;
    }
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
