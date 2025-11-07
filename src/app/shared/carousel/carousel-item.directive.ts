import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[carouselItem]',
  standalone: true
})
export class CarouselItemDirective {
  constructor(public el: ElementRef) {
  }
}
