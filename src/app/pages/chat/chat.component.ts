import { AsyncPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatService } from '@services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule, DatePipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  readonly items$ = this.chatService.listChat();

  readonly formGroup = new FormGroup({
    message: new FormControl<string>('', Validators.required)
  });

  constructor(private readonly chatService: ChatService) {}

  sendMessage(): void {
    const message = this.formGroup.value.message;
    if (message) {
      this.chatService.sendMessage(message).subscribe();
    }
  }
}
