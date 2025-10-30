import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SitesTableComponent } from "./components/sites-table/sites-table.component";

@Component({
  selector: 'app-root',
  imports: [SitesTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'frontend';
}
