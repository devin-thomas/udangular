import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrls: ['./app.css']
})
export class App {
  private readonly destroyRef = inject(DestroyRef);
  private readonly cartService = inject(CartService);

  feedbackMessage = '';

  constructor() {
    this.cartService.feedback$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((message) => {
        this.feedbackMessage = message;
      });
  }
}
