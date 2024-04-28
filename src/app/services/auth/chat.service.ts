import { Injectable } from '@angular/core';
import { Chat } from '@interfaces/chat.interface';
import { createClient } from '@supabase/supabase-js';
import { Observable, from, map, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment.dev';

const CHAT_TABLE_NAME = 'chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

  listChat(): Observable<Chat[] | null> {
    return this.fromTableChanges().pipe(
      switchMap(() => from(this.supabase.from(CHAT_TABLE_NAME).select('*,users(*)'))),
      map(({ data }) => data)
    );
  }

  private fromTableChanges(): Observable<unknown> {
    return new Observable(observer => {
      this.supabase
        .channel(CHAT_TABLE_NAME)
        .on('postgres_changes', { event: '*', schema: 'public', table: CHAT_TABLE_NAME }, data => observer.next(data));
    });
  }

  sendMessage(text: string) {
    return from(this.supabase.from(CHAT_TABLE_NAME).insert({ text })).pipe(map(() => undefined));
  }

  deleteMsg(messageId: string): Observable<void> {
    return from(this.supabase.from(CHAT_TABLE_NAME).delete().eq('id', messageId)).pipe(map(() => undefined));
  }
}
