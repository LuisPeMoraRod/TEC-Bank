
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { MyAccount } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class MyAccountService {
    private accountSubject: BehaviorSubject<MyAccount>;
    public account: Observable<MyAccount>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.accountSubject = new BehaviorSubject<MyAccount>(JSON.parse(localStorage.getItem('account')));
        this.account = this.accountSubject.asObservable();
    }

    public get accountValue(): MyAccount {
        return this.accountSubject.value;
    }


    getByUserId(id: string) {
        return this.http.get<MyAccount>(`${environment.apiUrl}/accounts/${id}`);
    }

}