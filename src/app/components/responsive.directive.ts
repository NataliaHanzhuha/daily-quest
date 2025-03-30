import { Directive, ElementRef, Renderer2, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appResponsiveClass]'
})
export class ResponsiveDirective {
  @Input() largeClassName: string = 'large-screen';
  @Input() smallClassName: string = 'small-screen';
  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.setClass(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.setClass((event.target as Window).innerWidth);
  }

  private setClass(width: number) {
    if (width < 768) {
      this.renderer.addClass(this.el.nativeElement, this.smallClassName);
      this.renderer.removeClass(this.el.nativeElement, this.largeClassName);
    } else {
      this.renderer.addClass(this.el.nativeElement, this.largeClassName);
      this.renderer.removeClass(this.el.nativeElement, this.smallClassName);
    }
  }
}
