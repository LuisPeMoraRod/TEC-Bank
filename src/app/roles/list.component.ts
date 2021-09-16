import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { RoleService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    roles = null;

    constructor(private roleService: RoleService) {}

    ngOnInit() {
        this.roleService.getAll()
            .pipe(first())
            .subscribe(roles => this.roles = roles);
    }

    deleteRole(id: string) {
        const role = this.roles.find(x => x.id === id);
        role.isDeleting = true;
        this.roleService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.roles = this.roles.filter(x => x.id !== id) 
            });
    }
}