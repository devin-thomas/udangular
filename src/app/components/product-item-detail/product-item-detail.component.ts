import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-item-detail',
  templateUrl: './product-item-detail.component.html',
  standalone: false,
  styleUrls: ['./product-item-detail.component.css']
})
export class ProductItemDetailComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  product?: Product;
  quantity = 1;
  errorMessage = '';

  constructor() {
    this.route.paramMap
      .pipe(
        switchMap((params) => this.productService.getProductById(Number(params.get('id')))),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((product) => {
        if (!product) {
          this.errorMessage = 'We could not find that product.';
          return;
        }

        this.errorMessage = '';
        this.product = product;
      });
  }

  onQuantityChange(value: number | string): void {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue) || numericValue < 1) {
      this.quantity = 1;
      return;
    }

    this.quantity = Math.floor(numericValue);
  }

  addCurrentProductToCart(): void {
    if (!this.product) {
      throw new Error('Product detail is missing a selected product.');
    }

    this.cartService.addToCart(this.product, this.quantity);
  }
}
