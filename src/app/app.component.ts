import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CurrencyConverterFormComponent } from './components/currency-converter-form/currency-converter-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CurrencyConverterFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'currency-converter';
}
