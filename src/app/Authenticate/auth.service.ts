import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../User/user.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = 'http://localhost:5000/api/user';
    private _isAuthenticated: boolean = false;

    constructor(private http: HttpClient) { }

    loginUser(user: User): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, user)
            .pipe(
                map(response => {
                    const token = (response as any).token;
                    this.storeToken(token);
                    this._isAuthenticated = true;
                    return 'Login successful';
                }),
                catchError(error => of('Invalid username or password'))
            );
    }

    isAuthenticated(): boolean {
        return this._isAuthenticated;
    }

    private storeToken(token: string): void {
    }

}
