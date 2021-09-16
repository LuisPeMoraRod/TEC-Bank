import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { CardService, AlertService } from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private cardService: CardService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        

        this.form = this.formBuilder.group({
            number: ['', Validators.required],
            type: ['', Validators.required],
            expDate: ['', Validators.required],
            balance: ['', Validators.required],
            cvc: ['', Validators.required],
            clientId: ['', Validators.required]
        });

        if (!this.isAddMode) {
            this.cardService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.f.number.setValue(x.number);
                    this.f.type.setValue(x.type);
                    this.f.expDate.setValue(x.expDate);
                    this.f.balance.setValue(x.balance);
                    this.f.cvc.setValue(x.cvc);
                    this.f.clientId.setValue(x.clientId);
                });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createCard();
        } else {
            this.updateCard();
        }
    }

    private createCard() {
        this.cardService.register(this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Card added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['.', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    private updateCard() {
        this.cardService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['..', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    onKeyPress(event: any) {
        const regexpNumber = /[0-9\+\-\ ]/;
        let inputCharacter = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !regexpNumber.test(inputCharacter)) {
          event.preventDefault();
        }
      }
}