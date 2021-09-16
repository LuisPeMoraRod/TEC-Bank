import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { CardService, AlertService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    cards = null;

    constructor(
        private cardService: CardService,
        private alertService: AlertService
        ) { }

    ngOnInit() {
        this.cardService.getAll()
            .pipe(first())
            .subscribe(cards => this.cards = cards);
    }

    deleteCard(id: string) {
        const card = this.cards.find(x => x.id === id);
        if (Number(card.balance) > 0) {
            this.alertService.error('To delete a credit card, its balance should be zero.')
        }
        else{
        card.isDeleting = true;
        this.cardService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.cards = this.cards.filter(x => x.id !== id)
            });
        }
    }
}