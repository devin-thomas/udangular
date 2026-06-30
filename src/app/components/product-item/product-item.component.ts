import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  standalone: false,
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent {
  @Input({ required: true }) product!: Product;
  @Output() addToCart = new EventEmitter<{ product: Product; quantity: number }>();

  quantity = 1;

  onQuantityChange(value: number | string): void {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue) || numericValue < 1) {
      this.quantity = 1;
      return;
    }

    this.quantity = Math.floor(numericValue);
  }

  submitAddToCart(): void {
    this.addToCart.emit({
      product: this.product,
      quantity: this.quantity
    });
  }
}
