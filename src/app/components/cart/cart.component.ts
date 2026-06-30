import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem } from '../../models/cart-item.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  standalone: false,
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  cartItems: CartItem[] = [];
  total = 0;
  formModel = {
    fullName: '',
    address: '',
    creditCard: ''
  };

  constructor() {
    this.cartService.items$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((items) => {
        this.cartItems = items;
      });

    this.cartService.total$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((total) => {
        this.total = total;
      });
  }

  onQuantityChange(productId: number, value: number | string): void {
    this.cartService.updateQuantity(productId, Number(value));
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  checkout(form: NgForm): void {
    if (form.invalid || !this.cartItems.length) {
      return;
    }

    this.cartService.checkout(this.formModel);
    form.resetForm();
    this.router.navigateByUrl('/confirmation');
  }
}
