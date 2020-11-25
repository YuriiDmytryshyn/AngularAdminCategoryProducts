import { Component, OnInit, TemplateRef } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'
import { Observable } from 'rxjs';
import { Product } from 'src/app/shared/classes/product.model';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { CategoriesService } from 'src/app/shared/services/categories.service';
import { ProductsService } from 'src/app/shared/services/products.service';


@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit {

  adminCategories: Array<ICategory> = [];
  currentCategory: ICategory;

  modalRef: BsModalRef;
  uploadPercent: Observable<number>;
  addModalHeight = 460;
  fileUploaded = false;
  dynamic: number = 0;

  adminProducts: Array<IProduct> = [];
  productID: number | string;
  productCategory: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  productImage: string;

  constructor(
    private modalService: BsModalService,
    private categoryService: CategoriesService,
    private productService: ProductsService,
    private storage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    this.getCategories();
    this.getProducts();
  }

  private getCategories(): void {
    this.categoryService.getCategories().subscribe(
      data => {
        this.adminCategories = data;
        this.currentCategory = this.adminCategories[0];
      }
    )
  };

  setCategory(): void {
    this.currentCategory = this.adminCategories.filter(category =>
      category.name === this.productCategory)[0];
  };

  private getProducts(): void {
    this.productService.getProducts().subscribe(
      data => {
        this.adminProducts = data;
      }
    )
  };

  addProduct(): void {
    const newProd = new Product(
      1,
      this.currentCategory,
      this.productName,
      this.productDescription,
      this.productPrice,
      this.productImage,
    );
    delete newProd.id;
    this.productService.postProduct(newProd).subscribe(() => {
      this.getProducts();
    });
    this.productName = '';
    this.productDescription = '';
    this.productPrice = null;
    this.productCategory = '';
    this.productImage = '';
  };

  selectProduct(prod: IProduct): void {
    this.productID = prod.id;
  };

  deleteProduct(): void {
    this.productService.deleteProduct(this.productID).subscribe(() => {
      this.getProducts();
    });
  };

  uploadFile(event): void {
    const file = event.target.files[0];
    const filePath = `images/${file.name}`;
    const ref = this.storage.ref(filePath);
    const task = ref.put(file);
    this.uploadPercent = task.percentageChanges();
    this.uploadPercent.subscribe(data => {
      if (data === 100) {
        this.dynamic = 100;
      }
    });
    task.then(image => {
      this.storage.ref(`images/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        this.productImage = url;
        this.addModalHeight = 490;
        this.fileUploaded = true;
      });
    });
  };

  openModalAdd(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  };

  openModalDelete(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  };

  private resetForm(): void {
    this.productName = '';
    this.productDescription = '';
    this.productPrice = null;
    this.productCategory = '';
    this.productImage = '';
    this.fileUploaded = false;
    this.dynamic = 0;
  }

}
