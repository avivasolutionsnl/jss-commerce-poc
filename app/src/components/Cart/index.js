import React, { useContext } from 'react';
import { t } from 'i18next';
import { NavLink } from 'react-router-dom';
import { CartContext } from '../../lib/commerce';
import Price from '../../shared/components/price';

function mapToCartLineProps({CartLineComponents, Id, Quantity, Totals}) {
  const cartProductComponent = CartLineComponents.find(e => e['@odata.type'] === '#Sitecore.Commerce.Plugin.Carts.CartProductComponent');

  return {
    id: Id,
    displayName: cartProductComponent.DisplayName,
    quantity: Quantity,
    amount: Totals.GrandTotal.Amount,
    currencyCode: Totals.GrandTotal.CurrencyCode
  }
}

const CartLine = ({t, onRemoveCartLine, line}) => {
  const {displayName, quantity, amount, currencyCode} = line;

  return (
    <article className="cartline">
      <p className="cartline__name">{displayName}</p>
      <div className="cartline__actions">
        <input className="cartline__quantity" value={quantity} readOnly />
        <Price amount={amount} currencyCode={currencyCode} />
        <button className="cartline--remove" onClick={() => onRemoveCartLine(line)}>{t('cart-line-remove')}</button>
      </div>
    </article>
  );
};

function mapToCartProps({Totals, Lines}) {
  const grandTotal = Totals.GrandTotal;

  return {
    amount: grandTotal.Amount,
    currencyCode: grandTotal.CurrencyCode,
    lines: Lines
  }
}

const Cart = () => {
  const cart = useContext(CartContext);
  
  let cartLines = <p>{t('cart-is-empty')}</p>;
  let total = null;
  let toCheckout = null;

  if (cart.data != null) {
    const {amount, currencyCode, lines} = mapToCartProps(cart.data);

    if (lines.length > 0) {
      cartLines = lines.map((line, key) => <CartLine key={key} t={t} onRemoveCartLine={cart.actions.removeCartLine} line={mapToCartLineProps(line)} />);
      total = <Price className="cart__price" amount={amount} currencyCode={currencyCode} />;
      toCheckout = <NavLink className="cart--checkout" to="/checkout">{t('cart-to-checkout')}</NavLink>;
    }
  }

  return (
      <article className="cart">
        <header>
          <h1 className="cart__title">{t('cart-title')}</h1>
        </header>
        <section className="cart__lines">{cartLines}</section>
        <footer>
          {total}
          {toCheckout}
        </footer>
      </article>
  )
};

export default Cart;
