
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Account } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private accountSubject: BehaviorSubject<Account>;
    public account: Observable<Account>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.accountSubject = new BehaviorSubject<Account>(JSON.parse(localStorage.getItem('account')));
        this.account = this.accountSubject.asObservable();
    }

    public get accountValue(): Account {
        return this.accountSubject.value;
    }

    register(account: Account) {
        return this.http.post(`${environment.apiUrl}/accounts/register`, account);
    }

    getAll() {
        return this.http.get<Account[]>(`${environment.apiUrl}/accounts`);
    }

    getById(id: string) {
        return this.http.get<Account>(`${environment.apiUrl}/accounts/${id}`);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/accounts/${id}`, params)
            .pipe(map(x => {
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/accounts/${id}`)
            .pipe(map(x => {
                return x;
            }));
    }
}