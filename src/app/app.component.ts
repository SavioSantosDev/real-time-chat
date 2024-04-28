import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CanActivateFn, RouterOutlet } from '@angular/router';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment.dev';

export const authGuard: CanActivateFn = (route, state) => {
  // Nevegar para tela de login se não tiver logado.
  return true;
};

interface Chat {
  created_at: string;
  editable: boolean;
  id: string;
  sender: string;
  text: string;
  users: {
    id: string;
    avatar_url: string;
    full_name: string;
  };
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'real-time-chat';

  chats = signal<Chat[]>([]);

  readonly formGroup = new FormGroup({
    message: new FormControl()
  });

  private readonly supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    // Ouvindo eventos de autenticação
    this.supabase.auth.onAuthStateChange((event, session) => {
      // console.log({ event });
      // console.log({ session });

      if (session?.user) {
        localStorage.setItem('userSession', JSON.stringify(session.user));
        // navigate
      }
    });
  }
}
