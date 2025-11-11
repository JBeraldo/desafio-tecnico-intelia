import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
  ],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss'],
})
export class MainLayout {}