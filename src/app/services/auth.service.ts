import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment.dev';
import { createClient } from '@supabase/supabase-js';
import { Observable, from, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

  constructor(private readonly router: Router) {
    this.supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        localStorage.setItem('userSession', JSON.stringify(session.user));
        this.router.navigate(['chat']);
      }
    });
  }

  loggin(): Observable<void> {
    return from(this.supabase.auth.signInWithOAuth({ provider: 'google' })).pipe(map(() => undefined));
  }

  logout(): Observable<void> {
    return from(this.supabase.auth.signOut()).pipe(map(() => undefined));
  }
}
