import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';

const loginModule = () => import('./login/account.module').then(x => x.AccountModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);
const rolesModule = () => import('./roles/roles.module').then(x => x.RolesModule);
const accountsModule = () => import('./bank-accounts/bank-accounts.module').then(x => x.BankAccountsModule);

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] },
    { path: 'roles', loadChildren: rolesModule, canActivate: [AuthGuard]},
    { path: 'accounts', loadChildren: accountsModule, canActivate: [AuthGuard]},
    { path: 'login', loadChildren: loginModule },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }