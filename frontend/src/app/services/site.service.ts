// src/app/services/site.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface Site {
  sitename: string;
  sitenumber: number;
  lat: number;
  lon: number;
  area: string;
  installation_date: string;
}
export interface PaginatedSites {
  current_page: number;
  data: Site[];
  last_page: number;
  per_page: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  private apiUrl = 'http://127.0.0.1:8000/api/sites';


  constructor(private http: HttpClient) { }
  getSites(page = 1, sortBy = 'sitenumber', sortOrder = 'asc', filters: any = {}): Observable<PaginatedSites> {
    let params: any = { page, sort_by: sortBy, sort_order: sortOrder };

    // Add filters if present
    if (filters.lat_min) params.lat_min = filters.lat_min;
    if (filters.lat_max) params.lat_max = filters.lat_max;
    if (filters.lon_min) params.lon_min = filters.lon_min;
    if (filters.lon_max) params.lon_max = filters.lon_max;
    return this.http.get<PaginatedSites>(`${this.apiUrl}?page=${page}`, { params }).pipe(
      map(response => response)
    );
  }
  addSite(site: Site): Observable<Site> {
    return this.http.post<Site>(this.apiUrl, site);
  }

  updateSite(site: Site): Observable<Site> {
    return this.http.put<Site>(`${this.apiUrl}/${site.sitenumber}`, site);
  }

  deleteSite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  // Import Excel file
  importExcel(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/import`, formData);
  }
}
