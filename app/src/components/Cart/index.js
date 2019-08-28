import React, { useContext } from 'react';
import { withNamespaces } from 'react-i18next';
import CartContext from '../../lib/CartContext';

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

const CartLine = ({t, onRemoveCartLine, id, displayName, quantity, price}) => {
  return (
    <article className="cartline">
      <h2 className="cartline__name">{displayName}</h2>
      <p className="cartline__quantity">{t('cart-line-quantity')}: {quantity}</p>
      <p className="cartline__price">{price}</p>
      <button className="cartline--remove" onClick={() => onRemoveCartLine(id)}>{t('cart-line-remove')}</button>
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

const Cart = ({t}) => {
  const cart = useContext(CartContext);
  
  let cartLines = <p>{t('cart-is-empty')}</p>;
  let total = null;

  if (cart.data != null) {
    const data = mapToCartProps(cart.data);

    if (data.lines.length > 0) {
      cartLines = data.lines.map((line, key) => <CartLine key={key} t={t} onRemoveCartLine={cart.actions.removeCartLine} {...mapToCartLineProps(line)} />);
      total = <p className="cart__price">{t('cart-total')} {data.totalPrice}</p>;
    }
  }

  return (
      <article className="cart">
        <header>
          <h1 className="cart__title">{t('cart-title')}</h1>
        </header>
        <section>{cartLines}</section>
        <footer>
          {total}
        </footer>
      </article>
  )
};

export default withNamespaces()(Cart);
