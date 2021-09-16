import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MyAccountRoutingModule } from './myAccount-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MyAccountRoutingModule
    ],
    declarations: [
        LayoutComponent,
        ListComponent,
    ]
})
export class MyAccountModule { }