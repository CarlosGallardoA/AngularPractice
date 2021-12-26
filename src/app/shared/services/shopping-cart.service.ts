import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from 'src/app/pages/products/interface/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  products: Product[] = [];
  private cartSubject = new BehaviorSubject<Product[]>([]);
  private totalSubject = new BehaviorSubject<number>(0);
  private quantitySubject = new BehaviorSubject<number>(0);

  get totalAction$(): Observable<number>{
    return this.totalSubject.asObservable();
  }
  get quantityAction$(): Observable<number>{
    return this.quantitySubject.asObservable();
  }
  get cartAction$(): Observable<Product[]>{
    return this.cartSubject.asObservable();
  }
  updateCart(product: Product): void{
    this.addToCart(product);
    this.quantityProduct();
    this.calcTotal();
  }
  resetShoppingCart(): void{
    this.products = [];
    this.cartSubject.next(this.products);
    this.quantitySubject.next(0);
    this.totalSubject.next(0);
  }
  private addToCart(product:Product): void{
    const isPorductInCart = this.products.find(p => p.id === product.id);
    if(isPorductInCart){
      isPorductInCart.qty++;
    }else{
      product.qty = 1;
      this.products.push(product);
    }
    this.cartSubject.next(this.products);
  }
  private quantityProduct():void{
    const quantity = this.products.reduce((acc, product) => acc += product.qty, 0);
    this.quantitySubject.next(quantity);
  }
  private calcTotal():void{
    const total = this.products.reduce((acc, product) => acc += (product.price * product.qty), 0);
    this.totalSubject.next(total);
  }
  constructor() { }
}
