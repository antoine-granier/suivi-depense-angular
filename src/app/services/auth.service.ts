import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${credentials.email}`);
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }
}
