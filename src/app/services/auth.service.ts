import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { map } from 'rxjs/operators';

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

  register(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }
}
