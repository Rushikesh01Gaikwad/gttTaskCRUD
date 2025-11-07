import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { Product } from '../interface/product';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  products: Product[] = [];
  filteredList: Product[] = [];
  searchTerm: string = '';
  selectedProduct: Product | any;
  action: string = '';
  categories: string[] = [];
  selectedCategory: string = 'All';
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.http.get().subscribe((data: Product[]) => {
      this.products = data;
      this.filteredList = [...this.products];
      this.extractCategories();
    });
  }

  extractCategories(): void {
    const uniqueCategories = new Set(this.products.map(p => p.category));
    this.categories = ['All', ...Array.from(uniqueCategories)];
  }

  filteredProducts(): Product[] {
    let filtered = [...this.products];
    if (this.selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }
    if (this.searchTerm.trim()) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredList = filtered;
    return this.paginatedProducts();
  }

  paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredList.slice(startIndex, startIndex + this.itemsPerPage);
  }

  totalPages(): number {
    return Math.ceil(this.filteredList.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  editProduct(product: Product) {
    this.selectedProduct = { ...product };
    this.action = 'Edit';
  }

  addProduct() {
    this.selectedProduct = {
      id: 0,
      title: '',
      price: 0,
      description: '',
      category: '',
      image: '',
      rating: { rate: 0, count: 0 },
    };
    this.action = 'Add';
  }


  saveProduct() {
    if (this.action === 'Add') {
      this.http.post(this.selectedProduct).subscribe((newProduct: any) => {
        alert('✅ Product added successfully!');
        this.products.push({
          ...this.selectedProduct,
          id: newProduct.id || this.products.length + 1,
        }); // Update local list
        this.filteredProducts();
        this.selectedProduct = null;
      });
    } else if (this.action === 'Edit') {
      this.http.put(this.selectedProduct).subscribe(() => {
        alert('✅ Product updated successfully!');
        const index = this.products.findIndex(p => p.id === this.selectedProduct.id);
        if (index > -1) this.products[index] = { ...this.selectedProduct }; // Update local list
        this.filteredProducts();
        this.selectedProduct = null;
      });
    }
  }

  deleteProduct(id: number) {
    const confirmed = confirm('⚠️ Are you sure you want to delete this product?');
    if (!confirmed) return;

    this.http.delete(id).subscribe(() => {
      alert('🗑️ Product deleted successfully!');
      this.products = this.products.filter(p => p.id !== id); // Update local list
      this.filteredProducts();
    });
  }




  cancelEdit() {
    this.selectedProduct = null;
  }
}
