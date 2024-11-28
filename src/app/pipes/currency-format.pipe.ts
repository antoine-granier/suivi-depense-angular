import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number, currencySymbol: string = '€'): string {
    return `${value.toFixed(2)} ${currencySymbol}`;
  }
}
