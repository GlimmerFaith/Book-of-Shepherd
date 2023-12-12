import { Component } from "@angular/core";
import { UserService } from "../User/user.service";
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  registrationStatus: boolean | undefined

  constructor(private userService: UserService, private router: Router) { }

  register(): void {
    const newUser = {
      username: this.username,
      password: this.password,
    };

    this.userService.checkDuplicateUsername(this.username).subscribe(
      (isDuplicate) => {
        if (isDuplicate) {
          this.registrationStatus = true;
        } else {
          this.userService.registerUser(newUser).subscribe(
            (response) => {
              console.log('User registered successfully:', response);
              this.registrationStatus = false;
              this.router.navigate(['/login']);
            },
            (error) => {
              console.error('Error registering user:', error);
            }
          );
        }
      },
      (error) => {
        console.error('Error checking duplicate username:', error);
      }
    );
  }

  returnToLogin(): void {
    this.router.navigate(['/login']);
  }

}
