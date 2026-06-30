import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: false,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  protected readonly itemCount$ = inject(CartService).itemCount$;
}
