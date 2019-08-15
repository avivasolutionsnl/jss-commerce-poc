import React, { useState, useEffect } from 'react';
import { Text } from '@sitecore-jss/sitecore-jss-react';
import fetch from 'node-fetch';

function getToken() {
  return fetch('https://localhost:5001/identity/authentication/getanonymoustoken', {
    method: 'post'
  })
    .then(res => res.json())
    .then(json => json.token);
}

function getCart(token) {
  return fetch('https://localhost:5001/api/carts/me', {
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
    .then(res => res.json());
}

function addCartLine(token, line) {
  return fetch('https://localhost:5001/api/carts/me/addline', {
    method: 'put', 
    headers: {
      'Authorization' : `Bearer ${token}`, 
      'Content-Type' : 'application/json'
    }, 
    body: JSON.stringify(line)
  })
    .then(res => res.json());
}

function removeCartLine(token, lineId) {
  return fetch(`https://localhost:5001/api/carts/me/lines/${lineId}`, {
    method: 'delete', 
    headers: {
      'Authorization' : `Bearer ${token}`, 
      'Content-Type' : 'application/json'
    }
  })
    .then(res => res.json());
}

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

const CartLine = ({onRemoveCartLine, CartLineComponents, Id, Quantity, Totals}) => {
  const cartProductComponent = CartLineComponents.find(e => e['@odata.type'] === '#Sitecore.Commerce.Plugin.Carts.CartProductComponent');
  const price = `${Totals.GrandTotal.CurrencyCode} ${Totals.GrandTotal.Amount}`;

  return (
    <article class="cartline">
      <h2 class="cartline--name">{cartProductComponent.DisplayName}</h2>
      <p class="cartline--quantity">Quantity: {Quantity}</p>
      <p class="cartline--price">{price}</p>
      <button onClick={() => onRemoveCartLine(Id)}>Remove</button>
    </article>
  );
};

const Cart = (props) => {
  const [token, setToken] = useState(null);
  const [cart, setCart] = useState(null);

  useEffect(() => {
    getToken().then(t => setToken(t));
  }, []);

  useEffect(() => {
    if (token != null) {
      getCart(token).then(c => setCart(c));
    }
  }, token);

  function onAddCartLine(line) {
    addCartLine(token, line)
      .then(() => getCart(token).then(c => setCart(c)));
  }

  function onRemoveCartLine(lineId) {
    removeCartLine(token, lineId)
      .then(() => getCart(token).then(c => setCart(c)));
  }

  let cartLines = <p>Your cart is empty!</p>;
  let total = null;
  if (cart != null && cart.Lines.length > 0) {
    console.log(cart);
    cartLines = cart.Lines.map((item, key) => <CartLine key={key} onRemoveCartLine={onRemoveCartLine} {...item} />);

    const grandTotal = cart.Totals.GrandTotal;
    const price = `${grandTotal.CurrencyCode} ${grandTotal.Amount}`;
    total = <p class="cart--price">Total {price}</p>;
  }

  return (
    <article class="cart">
      <header>
        <h1 class="cart--title">Cart</h1>
      </header>
      <section>{cartLines}</section>
      <footer>
        {total}
        <AddNomadPhone onAddCartLine={onAddCartLine} />
        <AddInstaClix onAddCartLine={onAddCartLine} />
      </footer>
    </article>
  )
};

export default Cart;
