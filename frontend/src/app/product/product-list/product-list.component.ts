import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import Product from '../product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[];
  isLoading = false;
  userIsAuthenticated = false;
  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'stock',
    'price',
    'operations',
  ];
  private productSubscription: Subscription;
  private authListenerSubscription: Subscription;

  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.productService.getProducts();
    this.productSubscription = this.productService
      .getProductsUpdatedListener()
      .subscribe((data) => {
        this.isLoading = false;
        this.products = data.products;
      });
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubscription = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onDelete(productId: string) {
    this.isLoading = true;
    this.productService.deleteProduct(productId).subscribe(() => {
      this.productService.getProducts();
    });
  }

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
    this.authListenerSubscription.unsubscribe();
  }
}
