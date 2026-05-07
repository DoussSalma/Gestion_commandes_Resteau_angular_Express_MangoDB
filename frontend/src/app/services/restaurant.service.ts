import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Categorie, Plat, Commande } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private baseUrl = `${environment.apiUrl}/${environment.prefix}`;

  constructor(private http: HttpClient) {}

  // ========== CATÉGORIES ==========
  getAllCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.baseUrl}/categories`);
  }

  getCategorieById(id: string): Observable<Categorie> {
    return this.http.get<Categorie>(`${this.baseUrl}/categories/${id}`);
  }

  createCategorie(data: Categorie): Observable<Categorie> {
    return this.http.post<Categorie>(`${this.baseUrl}/categories`, data);
  }

  updateCategorie(id: string, data: Categorie): Observable<any> {
    return this.http.put(`${this.baseUrl}/categories/${id}`, data);
  }

  deleteCategorie(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/categories/${id}`);
  }

  // ========== PLATS ==========
  getAllPlats(): Observable<Plat[]> {
    return this.http.get<Plat[]>(`${this.baseUrl}/plats`);
  }

  getPlatById(id: string): Observable<Plat> {
    return this.http.get<Plat>(`${this.baseUrl}/plats/${id}`);
  }

  searchPlats(nom: string): Observable<Plat[]> {
    return this.http.get<Plat[]>(`${this.baseUrl}/plats/search?nom=${nom}`);
  }

  getPlatsByCategorie(categorieId: string): Observable<Plat[]> {
    return this.http.get<Plat[]>(`${this.baseUrl}/plats/categorie/${categorieId}`);
  }

  createPlat(data: any): Observable<Plat> {
    return this.http.post<Plat>(`${this.baseUrl}/plats`, data);
  }

  updatePlat(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/plats/${id}`, data);
  }

  deletePlat(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/plats/${id}`);
  }

  // ========== COMMANDES ==========
  getAllCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.baseUrl}/commandes`);
  }

  getCommandeById(id: string): Observable<Commande> {
    return this.http.get<Commande>(`${this.baseUrl}/commandes/${id}`);
  }

  createCommande(data: any): Observable<Commande> {
    return this.http.post<Commande>(`${this.baseUrl}/commandes`, data);
  }

  updateCommande(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/commandes/${id}`, data);
  }

  deleteCommande(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/commandes/${id}`);
  }



  uploadImage(file: File): Observable<any> {
  const formData = new FormData();
  formData.append('image', file);
  return this.http.post(`${this.baseUrl}/upload`, formData);
}


}
