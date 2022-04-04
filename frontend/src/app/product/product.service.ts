import { Injectable } from '@angular/core';
import Product from './product.model';
import { map, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[];
  private productsUpdated = new Subject<{ products: Product[] }>();

  constructor(private http: HttpClient, private router: Router) {}

  getProductsUpdatedListener() {
    return this.productsUpdated;
  }

  getProducts() {
    this.http
      .get<{ products: Product[] }>('http://localhost:8080/api/product')
      .pipe(
        map((data) => {
          return {
            products: data.products.map((product) => {
              return {
                _id: product._id,
                name: product.name,
                description: product.description,
                stock: product.stock,
                price: product.price,
              };
            }),
          };
        })
      )
      .subscribe((data) => {
        this.products = data.products;
        this.productsUpdated.next({ products: [...this.products] });
      });
  }

  getProduct(id: string) {
    return this.http.get<Product>('http://localhost:8080/api/product/' + id);
  }

  createProduct(product: Product) {
    product._id = null;
    this.http
      .post('http://localhost:8080/api/product/', product)
      .subscribe((res) => {
        this.router.navigate(['/']);
      });
  }

  updateProduct(product: Product) {
    this.http
      .put('http://localhost:8080/api/product/' + product._id, product)
      .subscribe((res) => {
        this.router.navigate(['/']);
      });
  }

  deleteProduct(id: string) {
    return this.http.delete('http://localhost:8080/api/product/' + id);
  }
}
