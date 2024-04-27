import { JsonPipe } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CanActivateFn, RouterOutlet } from '@angular/router';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { from } from 'rxjs';
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

    this.supabase
      .channel('chat')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat' }, data => {
        console.log(data);
      })
      .subscribe();

    effect(() => {
      this.listChat();
    });
  }

  signInGoogle() {
    from(
      this.supabase.auth.signInWithOAuth({
        provider: 'google'
      })
    ).subscribe({
      // next: console.log
    });
  }

  logout() {
    from(this.supabase.auth.signOut()).subscribe({
      // next: console.log
    });
  }

  submit() {
    const text = this.formGroup.value.message;
    from(this.supabase.from('chat').insert({ text })).subscribe({
      next: ({ data, error }) => {
        // console.log({ data });
        if (error) {
          alert(error.message);
        }
      },
      error: console.error
    });
  }

  listChat() {
    from(this.supabase.from('chat').select('*,users(*)')).subscribe({
      next: ({ data, error }) => {
        if (data) {
          this.chats.set(data);
        }

        if (error) {
          alert(error.message);
        }
      },
      error: console.error
    });
  }

  deleteMsg(msg: Chat) {
    from(this.supabase.from('chat').delete().eq('id', msg.id)).subscribe({
      next: ({ data }) => {
        // console.log(data);
      }
    });
  }
}
