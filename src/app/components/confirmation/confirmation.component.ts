import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  standalone: false,
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent {
  protected readonly confirmation = inject(CartService).getCurrentConfirmation();
}
