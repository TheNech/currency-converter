import { Directive, HostListener } from "@angular/core";

@Directive({
  selector: '[appNumberFilter]',
  standalone: true,
})
export class NumberFilterDirective {
  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent): void {
    const status = [];

    if (event.key.match('^-?[0-9]*([.,]?[0-9]{0,2})?$')) {
      status.push('true');
    } else {
      status.push('false');
    }

    if (status.indexOf('false') !== -1 && !(event.key.toLowerCase() === 'backspace') && !(event.key.toLowerCase() === 'tab')) {
      event.preventDefault();
    }
  }
}
