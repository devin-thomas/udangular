import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { OrderConfirmation } from '../models/order-confirmation.model';
import { Product } from '../models/product.model';

interface CheckoutPayload {
  fullName: string;
  address: string;
  creditCard: string;
}

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly storageKey = 'udangular-cart';
  private readonly memoryStorage = new Map<string, string>();
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>(this.loadCart());
  private readonly feedbackSubject = new BehaviorSubject<string>('');
  private readonly confirmationSubject = new BehaviorSubject<OrderConfirmation | null>(null);
  private feedbackTimeoutId?: number;

  readonly items$ = this.itemsSubject.asObservable();
  readonly feedback$ = this.feedbackSubject.asObservable();
  readonly confirmation$ = this.confirmationSubject.asObservable();
  readonly itemCount$ = this.items$.pipe(
    map((items) => items.reduce((count, item) => count + item.quantity, 0))
  );
  readonly total$ = this.items$.pipe(
    map((items) => this.calculateTotal(items))
  );

  addToCart(product: Product, quantity: number): void {
    const normalizedQuantity = this.normalizeQuantity(quantity);
    const items = [...this.itemsSubject.value];
    const existingItem = items.find((item) => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += normalizedQuantity;
    } else {
      items.push({ product, quantity: normalizedQuantity });
    }

    this.commitItems(items);
    this.setFeedback(`${product.name} added to your cart.`);
  }

  updateQuantity(productId: number, quantity: number): void {
    const normalizedQuantity = this.normalizeQuantity(quantity);
    const items = this.itemsSubject.value.map((item) =>
      item.product.id === productId ? { ...item, quantity: normalizedQuantity } : item
    );
    const updatedItem = items.find((item) => item.product.id === productId);

    if (!updatedItem) {
      throw new Error(`Unable to update cart item ${productId}.`);
    }

    this.commitItems(items);
    this.setFeedback(`${updatedItem.product.name} quantity updated.`);
  }

  removeFromCart(productId: number): void {
    const itemToRemove = this.itemsSubject.value.find((item) => item.product.id === productId);

    if (!itemToRemove) {
      throw new Error(`Unable to remove cart item ${productId}.`);
    }

    const items = this.itemsSubject.value.filter((item) => item.product.id !== productId);
    this.commitItems(items);
    this.setFeedback(`${itemToRemove.product.name} removed from your cart.`);
  }

  checkout(payload: CheckoutPayload): void {
    const items = this.itemsSubject.value;

    if (!items.length) {
      throw new Error('Cannot complete checkout with an empty cart.');
    }

    this.confirmationSubject.next({
      fullName: payload.fullName.trim(),
      address: payload.address.trim(),
      creditCardLastFour: payload.creditCard.slice(-4),
      itemCount: items.reduce((count, item) => count + item.quantity, 0),
      total: this.calculateTotal(items)
    });

    this.itemsSubject.next([]);
    this.persistCart([]);
    this.setFeedback('Order placed successfully.');
  }

  getCurrentConfirmation(): OrderConfirmation | null {
    return this.confirmationSubject.value;
  }

  private commitItems(items: CartItem[]): void {
    this.itemsSubject.next(items);
    this.persistCart(items);
  }

  private calculateTotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  private loadCart(): CartItem[] {
    const rawCart = this.getStorage().getItem(this.storageKey);

    if (!rawCart) {
      return [];
    }

    return JSON.parse(rawCart) as CartItem[];
  }

  private normalizeQuantity(quantity: number): number {
    const normalizedQuantity = Math.floor(quantity);

    if (!Number.isFinite(normalizedQuantity) || normalizedQuantity < 1) {
      throw new Error('Cart quantity must be a positive integer.');
    }

    return normalizedQuantity;
  }

  private persistCart(items: CartItem[]): void {
    this.getStorage().setItem(this.storageKey, JSON.stringify(items));
  }

  private setFeedback(message: string): void {
    if (this.feedbackTimeoutId) {
      window.clearTimeout(this.feedbackTimeoutId);
    }

    this.feedbackSubject.next(message);
    this.feedbackTimeoutId = window.setTimeout(() => {
      this.feedbackSubject.next('');
      this.feedbackTimeoutId = undefined;
    }, 3000);
  }

  private getStorage(): StorageLike {
    const storageCandidate = globalThis.localStorage as Partial<Storage> | undefined;

    if (
      storageCandidate &&
      typeof storageCandidate.getItem === 'function' &&
      typeof storageCandidate.setItem === 'function'
    ) {
      return storageCandidate as Storage;
    }

    return {
      getItem: (key: string) => this.memoryStorage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        this.memoryStorage.set(key, value);
      }
    };
  }
}
