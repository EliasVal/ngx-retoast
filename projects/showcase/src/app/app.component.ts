import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';


@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {}

