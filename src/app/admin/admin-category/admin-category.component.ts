import { Component, OnInit, TemplateRef } from '@angular/core';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'
import { CategoriesService } from 'src/app/shared/services/categories.service';
import { Category } from 'src/app/shared/classes/category.model';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {

  adminCategories: Array<ICategory> = [];
  categoryID: number | string;
  modalRef: BsModalRef;
  inputCategory: string;
  disabledStatys = true;
  Status = false;
  searchCategory: string;

  constructor(
    private modalService: BsModalService,
    private categoryService: CategoriesService
  ) { }

  ngOnInit(): void {
    this.getCategories();
  }

  private getCategories(): void {
    this.categoryService.getCategories().subscribe(
      data => {
        this.adminCategories = data;
      }
    )
  };

  addCategory(): void {
    const newCategory = new Category(1, this.inputCategory);
    delete newCategory.id;
    this.categoryService.postCategory(newCategory).subscribe(() => {
      this.getCategories();
    });
    this.resetForm();
  };

  deleteCategory(category: ICategory): void {
    this.categoryID = category.id;
  };

  delCategory(): void {
    this.categoryService.deleteCategory(this.categoryID).subscribe(() => {
      this.getCategories();
    })
  }

  editCategory(category: ICategory): void {
    this.Status = true;
    this.categoryID = category.id;
    this.inputCategory = category.name;
  };

  saveCategory(): void {
    const updateCategory = {
      id: this.categoryID,
      name: this.inputCategory,
    };
    this.categoryService.updateCategory(updateCategory).subscribe(() => {
      this.getCategories();
    });
    this.resetForm();
  };

  changeInp(): void {
    if (this.inputCategory.length > 0) {
      this.disabledStatys = false;
    } else {
      this.disabledStatys = true;
    }
  };

  openModal(template: TemplateRef<any>) {
    this.Status = false;
    this.modalRef = this.modalService.show(template);
  };

  openModa(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  };

  private resetForm(): void {
    this.inputCategory = '';
    this.disabledStatys = true;
  };


}
