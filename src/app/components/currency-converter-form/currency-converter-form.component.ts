import { Component, OnDestroy, OnInit } from '@angular/core';
import { CurrencyService } from '../../shared/services/currency.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ICurrency } from '../../models/interfaces/currency.interface';
import { ICurrencyRate } from '../../models/interfaces/currency-rate-data.interface';
import { Subject, filter, takeUntil } from 'rxjs';
import { NumberFilterDirective } from '../../directives/number-filter.directive';

@Component({
  selector: 'app-currency-converter-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatSelectModule, NumberFilterDirective],
  templateUrl: './currency-converter-form.component.html',
  styleUrl: './currency-converter-form.component.scss'
})
export class CurrencyConverterFormComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  CURRENCIES: ICurrency[] = [
    { key: 'RUB', name: 'Руб.' },
    { key: 'USD', name: 'Доллар США' },
    { key: 'EUR', name: 'Евро' },
    { key: 'GBP', name: 'Фунт стерлингов' },
  ];

  form!: FormGroup;
  rates!: ICurrencyRate;

  constructor(
    private fb: FormBuilder,
    private currencyService: CurrencyService,
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      baseAmount: [null, Validators.required],
      baseCurrency: [null, Validators.required],
      secondAmount: [null],
      secondCurrency: [null, Validators.required],
    });

    this.form.get('baseCurrency')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => this.getRates(value));


    this.form.valueChanges
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe((data: IFormData) => {
        this.calculateSecondAmount();
      });
  }

  getRates(baseCurrency: string): void {
    const currencies = this.CURRENCIES.map(({ key }) => key);

    this.currencyService.getRates(baseCurrency, currencies)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.rates = data.data;
        this.calculateSecondAmount();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private isFormFilled(): boolean {
    const { baseAmount, baseCurrency, secondCurrency } = <IFormData>this.form.getRawValue();;

    return baseAmount !== null && baseCurrency !== null && secondCurrency !== null;
  }

  private calculateSecondAmount(): void {
    if (!this.isFormFilled()) {
      return;
    }

    const rate = this.rates[this.form.get('secondCurrency')?.value];
    const baseAmount = this.form.get('baseAmount')?.value;

    if (rate != null) {
      this.form.get('secondAmount')?.setValue((baseAmount * rate).toFixed(2), { emitEvent: false });
    }
  }
}

interface IFormData {
  baseAmount: number;
  baseCurrency: string;
  secondAmount: number;
  secondCurrency: string;
}
