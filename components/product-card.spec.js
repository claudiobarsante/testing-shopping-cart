import ProductCard from './ProductCard';
import { render, screen, fireEvent } from '@testing-library/react';

const product = {
  title: 'Nice watch',
  price: '22.00',
  image: 'https://nicewatch.test/image.jpg'
};

const addToCart = jest.fn();

const renderProductCard = () => {
  render(<ProductCard product={product} addToCart={addToCart} />);
};

describe('<ProductCard/>', () => {
  it('should render <ProductCard/>', () => {
    renderProductCard();

    expect(screen.getByTestId('product-card')).toBeInTheDocument();
  });

  it('should display proper content', () => {
    renderProductCard();

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

    const div = screen.getByTestId('image');

    expect(div).toHaveStyle({
      backgroundImage: `url(${product.image})`
    });
  });

  it('should call props.addToCart() when button gets cliked', async () => {
    renderProductCard();

    const button = screen.getByRole('button');

    await fireEvent.click(button);

    expect(addToCart).toHaveBeenCalledTimes(1);
    expect(addToCart).toHaveBeenCalledWith(product);
  });
});
