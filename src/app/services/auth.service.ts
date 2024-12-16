import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User } from '../models/user';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<User> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${credentials.email}`).pipe(
      map(users => {
        const user = users[0];
        if (user && user.password === credentials.password) {
          return user;
        }
        throw new Error('Invalid email or password');
      })
    );
  }

  getLastUserId(): Observable<number> {
    return this.http.get<User[]>(`${this.apiUrl}`).pipe(
      map(users => {
        const user = users[users.length - 1];
        if (user) {
          return user.id;
        }
        throw new Error('Error during operation');
      })
    )
  }

  register(user: User): Observable<User> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${user.email}`).pipe(
      switchMap((users: User[]) => {
        if (users.length > 0) {
          return throwError(() => new Error('Email déjà utilisé'));
        }
        return this.http.post<User>(this.apiUrl, user);
      })
    );
  }
  
}
