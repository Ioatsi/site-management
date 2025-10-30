import { Component, OnInit } from '@angular/core';
import { PaginatedSites, Site, SiteService } from '../../services/site.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sites-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sites-table.component.html',
  styleUrls: ['./sites-table.component.less']
})
export class SitesTableComponent implements OnInit {
  sites: Site[] = [];
  selectedSite: Site | null = null;
  selectedFile: File | null = null;
  pagination: PaginatedSites | null = null;
  sortBy: string = 'sitenumber';
  sortOrder: 'asc' | 'desc' = 'asc';
  filters: any = {};
  constructor(private siteService: SiteService) { }

  ngOnInit(): void {
    this.loadSites(1);
  }

  // Load all sites from backend
  loadSites(page: number): void {
    this.siteService.getSites(page, this.sortBy, this.sortOrder, this.filters).subscribe({
      next: resp => { this.sites = resp.data; this.pagination = resp },
      error: err => console.error('Failed to load sites', err)
    });
  }

  toggleSort(column: string): void {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
    }
    this.loadSites(1);
  }

  applyFilter(type: string): void {
    if (type === 'lat_gt_40') {
      this.filters = { lat_min: 40 };
    } else if (type === 'lat_lt_40') {
      this.filters = { lat_max: 40 };
    } else if (type === 'lon_gt_40') {
      this.filters = { lon_min: 40 };
    } else if (type === 'lon_lt_40') {
      this.filters = { lon_max: 40 };
    } else {
      this.filters = {};
    }
    this.loadSites(1);
  }

  // File selection handler
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  // Upload Excel file to backend
  importExcel(): void {
    if (!this.selectedFile) return;

    this.siteService.importExcel(this.selectedFile).subscribe({
      next: res => {
        console.log('Import successful', res);
        this.selectedFile = null;
        this.loadSites(1); // refresh table
      },
      error: err => console.error('Excel import failed', err)
    });
  }

  toggleEdit(site: Site): void {
    if (this.selectedSite && this.selectedSite.sitenumber === site.sitenumber) {
      this.selectedSite = null; // cancel edit
    } else {
      this.selectedSite = { ...site }; // copy for editing
    }
    
  }

  // Save edited site
  saveSite(): void {
    if (!this.selectedSite) return;

    this.siteService.updateSite(this.selectedSite).subscribe({
      next: () => this.loadSites(1),
      error: err => console.error('Failed to update site', err),
      complete: () => this.selectedSite = null
    });
  }

  // Delete site
  deleteSite(id: number): void {
    if (!confirm('Are you sure?')) return;

    this.siteService.deleteSite(id).subscribe({
      next: () => this.loadSites(1),
      error: err => console.error('Failed to delete site', err)
    });
  }
  changePage(page: number, event: Event): void {
    event.preventDefault();
    if (page >= 1 && page <= (this.pagination?.last_page ?? 1)) {
      this.loadSites(page);
    }
  }
}