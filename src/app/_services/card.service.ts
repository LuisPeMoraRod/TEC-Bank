
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Card } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class CardService {
    private cardSubject: BehaviorSubject<Card>;
    public card: Observable<Card>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.cardSubject = new BehaviorSubject<Card>(JSON.parse(localStorage.getItem('card')));
        this.card = this.cardSubject.asObservable();
    }

    public get cardValue(): Card {
        return this.cardSubject.value;
    }

    register(card: Card) {
        return this.http.post(`${environment.apiUrl}/cards/register`, card);
    }

    getAll() {
        return this.http.get<Card[]>(`${environment.apiUrl}/cards`);
    }

    getById(id: string) {
        return this.http.get<Card>(`${environment.apiUrl}/cards/${id}`);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/cards/${id}`, params)
            .pipe(map(x => {
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/cards/${id}`)
            .pipe(map(x => {
                return x;
            }));
    }
}