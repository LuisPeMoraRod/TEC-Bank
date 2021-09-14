import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { UserService } from '@app/_services';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    users = null;

    constructor(private accountService: UserService) { }

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
    }

    deleteUser(id: string) {
        const user = this.users.find(x => x.id === id);
        user.isDeleting = true;
        this.accountService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.users = this.users.filter(x => x.id !== id)
            });
    }

    report(id: string, name: string): void {
        const doc = new jsPDF('p', 'pt', 'a5', true);
        doc.setFontSize(22);
        doc.text('Report', 20, 20);

        doc.setFontSize(16);
        doc.text(`Client name: ${name} `, 20, 40);
        doc.text(`Client ID: ${id}`, 20, 60);
        doc.text('Loan number: 33030', 20, 80);
        doc.text('Expired payments:', 20, 100);

        doc.text('Expired payments:', 20, 120);
        doc.setFontSize(12);
        doc.text('\t- 1 - 3/9/2021 -> $30', 20, 140);
        doc.text('\t- 2 - 5/9/2021 -> $40', 20, 160);
        doc.text('\t- 3 - 6/9/2021 -> $33', 20, 180);
        doc.text('\t- 4 - 10/9/2021 -> $32', 20, 200);

        doc.setFontSize(16);
        doc.text('Amount: $135', 20, 220);
        doc.save('report.pdf');
    }
}