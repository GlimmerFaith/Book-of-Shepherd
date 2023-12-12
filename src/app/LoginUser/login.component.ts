import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { User } from '../User/user.model';
import { UserService } from "../User/user.service";
import { AuthService } from "../Authenticate/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginFailed: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  login(): void {
    const user = {
      username: this.username,
      password: this.password,
    };

    this.authService.loginUser(user).subscribe(
      (response) => {
        console.log('Login successful:', response);
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Login failed:', error);
        if (error.status === 401 && error.error.message === 'Invalid username or password') {
          this.loginFailed = true;
        }
      }
    );
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

}