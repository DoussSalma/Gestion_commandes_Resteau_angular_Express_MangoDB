import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-danger shadow">
      <div class="container-fluid">
        <a class="navbar-brand fw-bold" routerLink="/">
          🍽️ Restaurant Manager
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/plats" routerLinkActive="active">🍖 Plats</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/categories" routerLinkActive="active">📂 Catégories</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/commandes" routerLinkActive="active">📋 Commandes</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/panier" routerLinkActive="active">🛒 Panier</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `
})
export class HeaderComponent {}
