import CartItem from './cart-item';
import { render, screen, fireEvent } from '@testing-library/react';

const product = {
  title: 'Nice watch',
  price: '22.00',
  image: 'https://nicewatch.test/image.jpg',
  quantity: 1
};

const addToCart = jest.fn();

const renderCartItem = () => {
  render(<CartItem product={product} addToCart={addToCart} />);
};

describe('<CartItem/>', () => {
  it('should render <CartItem/>', () => {
    renderCartItem();

    expect(screen.getByTestId('cart-item')).toBeInTheDocument();
  });

  it('should display proper content', () => {
    renderCartItem();

    /**
     * as product is dynamically generated, you have to use a RegExp to match
     * if it's a string you could use /string/i to be case insensitive
     */
    expect(
      screen.getByText(new RegExp(product.title, 'i')) //case insensitive
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(product.price, 'i'))
    ).toBeInTheDocument();

    const img = screen.getByTestId('image');

    expect(img).toHaveProperty('src', product.image);
    expect(img).toHaveProperty('alt', product.title);
  });

  // it('should call props.addToCart() when button gets cliked', async () => {
  //   renderProductCard();

  //   const button = screen.getByRole('button');

  //   await fireEvent.click(button);

  //   expect(addToCart).toHaveBeenCalledTimes(1);
  //   expect(addToCart).toHaveBeenCalledWith(product);
  // });

  it('should display 1 as initial quantity', () => {
    renderCartItem();
    // -- '.textContent - to get value from html element
    expect(screen.getByTestId('quantity').textContent).toBe('1');
  });

  it('should increase quantity by 1 when second button is clicked', async () => {
    renderCartItem();

    const button = screen.getByTestId('increase');
    // -- or const [_, button] = screen.getAllByRole('button'); choosing the second button

    await fireEvent.click(button);

    expect(screen.getByTestId('quantity').textContent).toBe('2');
  });

  it('should decrease quantity by 1 when fisrt button is clicked', async () => {
    renderCartItem();

    const [buttonDecrease, buttonIncrease] = screen.getAllByRole('button');

    const quantity = screen.getByTestId('quantity');

    await fireEvent.click(buttonIncrease);

    expect(quantity.textContent).toBe('2');

    await fireEvent.click(buttonDecrease);

    expect(quantity.textContent).toBe('1');
  });

  fit('should not go below zero in the quantity', async () => {
    renderCartItem();

    const [buttonDecrease] = screen.getAllByRole('button');

    const quantity = screen.getByTestId('quantity');

    await fireEvent.click(buttonDecrease);
    await fireEvent.click(buttonDecrease);

    expect(quantity.textContent).toBe('0');
  });
});
