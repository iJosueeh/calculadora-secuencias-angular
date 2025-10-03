import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs'; // Added Observable
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }
/*-----Metodos de Login----*/

  login(email: string, password: string) {
    return this.http.get<User[]>(`${this.apiUrl}/users?email=${email}&password=${password}`)
      .pipe(map(users => {
        if (users.length > 0) {
          localStorage.setItem('currentUser', JSON.stringify(users[0]));
          return true;
        }
        return false;
      }));
  }

/*---------*/
  /*-----Metodos de Home----*/

  getUserData(email: string) {
    return this.http.get<User[]>(`${this.apiUrl}/users?email=${email}`)
      .pipe(map(users => users.length > 0 ? users[0] : null));
  }

  getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  logout() {
    localStorage.removeItem('currentUser');
  }

  deleteAccount(userId: number) {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }

  updateUser(user: User): Observable<User> { // Modified return type
    return this.http.put<User>(`${this.apiUrl}/users/${user.id}`, user);
  }

  /*---------*/
}