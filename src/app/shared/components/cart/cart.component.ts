import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../../services/shopping-cart.service';

@Component({
  selector: 'app-cart',
  template: `
   <ng-container *ngIf="{total: total$ | async, quantity: quantity$ | async} as dataCart">
   <ng-container  *ngIf="dataCart.total">
     <mat-icon>add_shopping_cart</mat-icon>
     {{ dataCart.total | currency }}
     ({{ dataCart.quantity }})
   </ng-container>
  </ng-container>
  `,
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
   quantity$ = this.shoppingCartSvs.quantityAction$;
  total$ = this.shoppingCartSvs.totalAction$;
  cart$ = this.shoppingCartSvs.cartAction$
  constructor(private shoppingCartSvs: ShoppingCartService) { }

  ngOnInit(): void {
  }

}
