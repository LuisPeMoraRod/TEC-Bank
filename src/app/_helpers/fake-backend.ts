import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users')) || [];
let roles = JSON.parse(localStorage.getItem('roles')) || [];
let accounts = JSON.parse(localStorage.getItem('accounts')) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'GET':
                    return getUserById();
                case url.match(/\/users\/\d+$/) && method === 'PUT':
                    return updateUser();
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return deleteUser();

                case url.endsWith('/roles/register') && method === 'POST':
                    return registerRole();
                case url.endsWith('/roles') && method === 'GET':
                    return getRoles();
                case url.match(/\/roles\/\d+$/) && method === 'GET':
                    return getRoleById();
                case url.match(/\/roles\/\d+$/) && method === 'PUT':
                    return updateRole();
                case url.match(/\/roles\/\d+$/) && method === 'DELETE':
                    return deleteRole();

                case url.endsWith('/accounts/register') && method === 'POST':
                    return registerAccount();
                case url.endsWith('/accounts') && method === 'GET':
                    return getAccounts();
                case url.match(/\/accounts\/\d+$/) && method === 'GET':
                    return getAccountById();
                case url.match(/\/accounts\/\d+$/) && method === 'PUT':
                    return updateAccount();
                case url.match(/\/accounts\/\d+$/) && method === 'DELETE':
                    return deleteAccount();

                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions

        function authenticate() {
            const { username, password } = body;
            const user = users.find(x => x.username === username && x.password === password);
            if (!user) return error('Username or password is incorrect');
            return ok({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                token: 'fake-jwt-token'
            })
        }

        function register() {
            const user = body

            if (users.find(x => x.username === user.username)) {
                return error('Username "' + user.username + '" is already taken');
            } 

            user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));
            return ok();
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(users);
        }

        function getUserById() {
            if (!isLoggedIn()) return unauthorized();

            const user = users.find(x => x.id === idFromUrl());
            return ok(user);
        }

        function updateUser() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let user = users.find(x => x.id === idFromUrl());

            // only update password if entered
            if (!params.password) {
                delete params.password;
            }

            // update and save user
            Object.assign(user, params);
            localStorage.setItem('users', JSON.stringify(users));

            return ok();
        }

        function deleteUser() {
            if (!isLoggedIn()) return unauthorized();

            users = users.filter(x => x.id !== idFromUrl());
            localStorage.setItem('users', JSON.stringify(users));
            return ok();
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
        
        //Roles
        function registerRole() {
            const role = body
    
            if (roles.find(x => x.name === role.name)) {
                return error('Username "' + role.name + '" is already taken')
            }

            role.id = roles.length ? Math.max(...roles.map(x => x.id)) + 1 : 1;
            roles.push(role);
            localStorage.setItem('roles', JSON.stringify(roles));
            return ok();
        }

        function getRoles() {
            if (!isLoggedIn()) return unauthorized();
            return ok(roles);
        }

        function deleteRole() {
            if (!isLoggedIn()) return unauthorized();
            roles = roles.filter(x => x.id !== idFromUrl());
            localStorage.setItem('users', JSON.stringify(roles));
            return ok();
        }

        function getRoleById() {
            if (!isLoggedIn()) return unauthorized();
            const role = roles.find(x => x.id === idFromUrl());
            return ok(role);
        }

        function updateRole() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let role = roles.find(x => x.id === idFromUrl());

            // update and save role
            Object.assign(role, params);
            localStorage.setItem('roles', JSON.stringify(roles));

            return ok();
        }

        //Accounts
        function registerAccount() {
            const account = body
    
            if (accounts.find(x => x.number === account.number)) {
                return error('Account number "' + account.number + '" is already taken');
            }else if (!users.find(x => x.ssn === account.clientId)){
                return error('No client is registered with SSN: ' + account.clientId);
            } 
    
            account.id = accounts.length ? Math.max(...accounts.map(x => x.id)) + 1 : 1;
            accounts.push(account);
            localStorage.setItem('accounts', JSON.stringify(accounts));
            return ok();
        }

        function getAccounts() {
            if (!isLoggedIn()) return unauthorized();
            return ok(accounts);
        }

        function deleteAccount() {
            if (!isLoggedIn()) return unauthorized();
            accounts = accounts.filter(x => x.id !== idFromUrl());
            localStorage.setItem('accounts', JSON.stringify(accounts));
            return ok();
        }

        function getAccountById() {
            if (!isLoggedIn()) return unauthorized();
            const account = accounts.find(x => x.id === idFromUrl());
            return ok(account);
        }

        function updateAccount() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let account = accounts.find(x => x.id === idFromUrl());

            Object.assign(account, params);
            localStorage.setItem('accounts', JSON.stringify(accounts));

            return ok();
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};