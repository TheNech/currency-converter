import { HttpClient } from "@angular/common/http";
import { ICurrencyRateData } from "../../models/interfaces/currency-rate-data.interface";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  constructor(private http: HttpClient) { }

  public getRates(base: string, currencies: string[]): Observable<ICurrencyRateData> {
    return this.http.get<ICurrencyRateData>(`https://api.freecurrencyapi.com/v1/latest?apikey=${environment.apiKey}&base_currency=${base}&currencies=${currencies.join(',')}`);
  }
}
