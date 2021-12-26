import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { delay, switchMap, tap } from 'rxjs';
import { Details } from 'src/app/shared/interface/order.interface';
import { Store } from 'src/app/shared/interface/store.interface';
import { DataService } from 'src/app/shared/services/data.service';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { Product } from '../products/interface/product.interface';
import { ProductsService } from '../products/services/products.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  model = {
    name:'Scarface',
    store:'',
    shippingAddress:'',
    city:'',
  }
  isDelivery: boolean =true;
  cart: Product[] = [];
  stores: Store[] = [];
  constructor(private dataSvc: DataService, private shoppingCartSvc: ShoppingCartService, private router: Router, private productSvc: ProductsService) { }

  ngOnInit(): void {
    this.getStore();
    this.getDataCart();
    this.prepareDetails();
  }

  onPickupOrDelivery(value:boolean):void{
    this.isDelivery = value;
  }
  onSubmit({value:formData}:NgForm):void{
    console.log(formData);
    const data = {
      ...formData,
      date: new Date().toLocaleDateString(),
      isDelivery: this.isDelivery
    }
    this.dataSvc.saveOrder(data).pipe(
      tap(res => console.log('Order -> ',res)),
      switchMap(({id :orderId})=>{
          const details = this.prepareDetails();
          return this.dataSvc.saveDetailsOrder({details, orderId})
      }),
      tap(() => this.router.navigate(['/checkout/thank-you-page'])),
      delay(2000),
      tap(() => this.shoppingCartSvc.resetShoppingCart())
    ).subscribe()
  }
  private getStore():void{
    this.dataSvc.getStores().pipe(
      tap((stores:Store[]) => this.stores = stores)
    ).subscribe();
  }
  private prepareDetails(){
    const details: Details[] = [];
    this.cart.forEach((product:Product) => {
      const {id: productId, name:productName, qty:quantity,stock} = product;
      const updateStock = stock - quantity;
      this.productSvc.updateStock(productId,updateStock).pipe(
        tap(() => details.push({productId,productName,quantity}))
      ).subscribe();
      
    });
    return details;
  }
    


  private getDataCart():void{
    this.shoppingCartSvc.cartAction$.pipe(
      tap((products: Product[]) => this.cart = products)
    ).subscribe();
  }

}
