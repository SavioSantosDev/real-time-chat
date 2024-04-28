import { Component } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private readonly authService: AuthService) {}

  login() {
    this.authService.loggin().pipe(take(1)).subscribe();
  }
}
