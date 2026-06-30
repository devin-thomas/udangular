import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);

  private readonly products$ = this.http
    .get<Product[]>('assets/data.json')
    .pipe(shareReplay(1));

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  getProductById(productId: number): Observable<Product | undefined> {
    return this.products$.pipe(
      map((products) => products.find((product) => product.id === productId))
    );
  }
}
