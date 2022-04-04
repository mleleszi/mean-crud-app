import { Component, OnInit } from '@angular/core';
import Product from '../product.model';
import { Subscription } from 'rxjs';
import { ProductService } from '../product.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css'],
})
export class ProductCreateComponent implements OnInit {
  enteredName = '';
  enteredDescription = '';
  enteredStock = '';
  enteredPrice = '';
  product: Product;
  isLoading = false;
  private mode = 'create';
  private productId: string;
  private authStatusSub: Subscription;

  constructor(
    public productService: ProductService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('productId')) {
        this.mode = 'edit';
        this.productId = paramMap.get('productId');
        this.isLoading = true;
        this.productService.getProduct(this.productId).subscribe((data) => {
          this.isLoading = false;
          this.product = {
            _id: data.product._id,
            name: data.product.name,
            description: data.product.description,
            stock: data.product.stock,
            price: data.product.price,
          };
        });
      } else {
        this.mode = 'create';
        this.productId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) return;

    this.isLoading = true;
    if (this.mode === 'create') {
      this.productService.createProduct({
        _id: null,
        name: form.value.name,
        description: form.value.description,
        stock: Math.floor(form.value.stock),
        price: Math.floor(form.value.price),
      });
    } else {
      this.productService.updateProduct({
        _id: this.productId,
        name: form.value.name,
        description: form.value.description,
        stock: Math.floor(form.value.stock),
        price: Math.floor(form.value.price),
      });
    }

    form.resetForm();
  }
  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
