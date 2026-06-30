import { TestBed } from '@angular/core/testing';
import { CartItem } from '../models/cart-item.model';
import { CartService } from './cart.service';
import { Product } from '../models/product.model';

const product: Product = {
  id: 1,
  name: 'Notebook',
  price: 12.5,
  url: 'https://example.com/notebook.jpg',
  description: 'A small notebook.'
};

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('adds quantities for the same product', () => {
    service.addToCart(product, 1);
    service.addToCart(product, 2);

    let currentItems: CartItem[] = [];
    service.items$.subscribe((items) => {
      currentItems = items;
    }).unsubscribe();

    expect(currentItems.length).toBe(1);
    expect(currentItems[0].quantity).toBe(3);
  });

  it('creates an order confirmation and empties the cart', () => {
    service.addToCart(product, 2);
    service.checkout({
      fullName: 'Taylor Dev',
      address: '123 Market Street',
      creditCard: '4111111111111111'
    });

    let currentItems: CartItem[] = [];
    service.items$.subscribe((items) => {
      currentItems = items;
    }).unsubscribe();

    expect(currentItems.length).toBe(0);
    expect(service.getCurrentConfirmation()?.creditCardLastFour).toBe('1111');
  });
});
