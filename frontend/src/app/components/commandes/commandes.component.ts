import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../services/restaurant.service';
import { Commande } from '../../models/models';

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './commandes.component.html'
})
export class CommandesComponent implements OnInit {
  commandes: Commande[] = [];
  selectedCommande: Commande | null = null;

  statutLabels: { [key: string]: string } = {
    'en_attente': '⏳ En attente',
    'en_preparation': '👨‍🍳 En préparation',
    'servie': '✅ Servie',
    'annulee': '❌ Annulée'
  };

  statutColors: { [key: string]: string } = {
    'en_attente': 'warning',
    'en_preparation': 'info',
    'servie': 'success',
    'annulee': 'danger'
  };

  constructor(private service: RestaurantService) {}

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes(): void {
    this.service.getAllCommandes().subscribe(
      data => this.commandes = data,
      err => console.error(err)
    );
  }

  voirDetails(commande: Commande): void {
    this.selectedCommande = this.selectedCommande?.id === commande.id ? null : commande;
  }

  changerStatut(commande: Commande, statut: string): void {
    this.service.updateCommande(commande.id!, { statut }).subscribe(
      () => { commande.statut = statut; },
      err => alert('Erreur: ' + err.error?.message)
    );
  }

  supprimer(id: string): void {
    if (!confirm('Supprimer cette commande?')) return;
    this.service.deleteCommande(id).subscribe(
      () => { alert('Commande supprimée!'); this.loadCommandes(); this.selectedCommande = null; },
      err => alert('Erreur: ' + err.error?.message)
    );
  }

  getStatutLabel(s: string): string { return this.statutLabels[s] || s; }
  getStatutColor(s: string): string { return this.statutColors[s] || 'secondary'; }
}
