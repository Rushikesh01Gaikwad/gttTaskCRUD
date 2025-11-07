import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../../services/http.service';
declare var $: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  produdcts: any[] = [];
  searchTerm: string = '';
  selectedProduct: any = null;

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.http.get().subscribe((data: any) => {
      this.produdcts = data;
    });
  }

  filteredProducts() {
    if (!this.searchTerm.trim()) {
      return this.produdcts;
    }
    return this.produdcts.filter((p) =>
      p.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  editProduct(product: any) {
    this.selectedProduct = { ...product };
  }

  updateProduct() {
    if (!this.selectedProduct) return;

    this.http.put(this.selectedProduct, { id: this.selectedProduct.id }).subscribe(() => {
      alert('Product updated successfully!');
      this.fetchProducts();
      this.selectedProduct = null;
    });
  }

  deleteProduct(id: number) {
    const confirmed = confirm('⚠️ Are you sure you want to delete this product?');
    if (!confirmed) return;

    this.http.delete({ id }).subscribe(() => {
      alert('Product deleted successfully!');
      this.fetchProducts();
    });
  }

  cancelEdit() {
    this.selectedProduct = null;
  }
}
