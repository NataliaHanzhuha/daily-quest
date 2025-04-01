// is-mobile.directive.ts
import { Directive, EventEmitter, HostBinding, HostListener, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[appIsMobile]',
  standalone: true,
})
export class IsMobileDirective implements OnInit {
  @HostBinding('class.mobile') isMobile = false;
  @Output() isMobileChange = new EventEmitter<boolean>();

  ngOnInit() {
    this.checkWidth();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkWidth();
  }

  private checkWidth() {
    this.isMobile = window.innerWidth < 768;
    this.isMobileChange.emit(this.isMobile);
  }
}
