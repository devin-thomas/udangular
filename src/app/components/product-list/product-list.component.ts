import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  standalone: false,
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  products: Product[] = [];
  errorMessage = '';

  constructor() {
    this.productService.getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products) => {
          this.products = products;
        },
        error: () => {
          this.errorMessage = 'Unable to load products right now.';
        }
      });
  }

  onAddToCart(payload: { product: Product; quantity: number }): void {
    this.cartService.addToCart(payload.product, payload.quantity);
  }
}
