import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService, AlertService } from '@app/_services';

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
        private accountService: UserService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        
        // password not required in edit mode
        const passwordValidators = [Validators.minLength(6)];
        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
        }

        this.form = this.formBuilder.group({
            ssn: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', passwordValidators],
            address: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            income: ['', Validators.required],
            clientType: ['', Validators.required]
        });

        if (!this.isAddMode) {
            this.accountService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.f.ssn.setValue(x.ssn);
                    this.f.firstName.setValue(x.firstName);
                    this.f.lastName.setValue(x.lastName);
                    this.f.username.setValue(x.username);
                    this.f.address.setValue(x.address);
                    this.f.phoneNumber.setValue(x.phoneNumber);
                    this.f.income.setValue(x.income);
                    this.f.clientType.setValue(x.clientType);
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
            this.createUser();
        } else {
            this.updateUser();
        }
    }

    private createUser() {
        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('User added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['.', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    private updateUser() {
        this.accountService.update(this.id, this.form.value)
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