import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/user';

  constructor(private http: HttpClient) {}

  checkDuplicateUsername(username: string): Observable<boolean> {
    const data = { username };
    return this.http.post<boolean>(`${this.apiUrl}/check`, data);
  }

  registerUser(newUser: { username: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, newUser).pipe(
      catchError((error) => {
        console.error('Error registering user:', error);
        throw error;
      })
    );
  }

  
}
