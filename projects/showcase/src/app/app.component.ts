import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, HomeComponent, NavbarComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
