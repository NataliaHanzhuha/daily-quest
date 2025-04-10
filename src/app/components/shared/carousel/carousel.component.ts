import { Component, Input, AfterViewInit, ElementRef, ViewChild, ContentChildren, QueryList, HostListener, Output, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselItemDirective } from './carousel-item.directive';
import { BehaviorSubject, fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PlatformService } from '../../../services/platform.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CarouselComponent implements AfterViewInit, OnDestroy {
  @Input() showIndicators = true;
  @Input() showControls = true;
  @Input() autoplay = false;
  @Input() autoplayDelay = 5000; // ms
  @Input() loop = true;
  @Input() perView = 1; // Items per view
  @Input() spacing = 20; // px
  @Input() initialSlide = 0;
  @Input() showPeek = false; // Show a peek of the next slide
  @Input() peekAmount = 50; // px

  @Output() slideChange = new EventEmitter<number>();
  
  @ViewChild('carouselContainer') carouselContainer!: ElementRef;
  @ContentChildren(CarouselItemDirective) items!: QueryList<CarouselItemDirective>;

  currentIndex$ = new BehaviorSubject<number>(0);
  numSlides = 0;
  itemWidth = 0;
  containerWidth = 0;
  autoplayInterval: any;
  isDragging = false;
  startX = 0;
  currentX = 0;
  translateX = 0;
  private resizeSubscription?: Subscription;
  
  get numSlidesWithClones(): number {
    return this.numSlides + (this.loop ? 2 : 0);
  }

  constructor(private cd: ChangeDetectorRef, private el: ElementRef, private platform: PlatformService) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.numSlides = this.items.length;
      this.currentIndex$.next(this.initialSlide);
      this.calculateDimensions();
      this.setupAutoplay();
      this.setupResizeListener();
      this.cd.detectChanges();
    });
  }

  ngOnDestroy() {
    this.clearAutoplay();
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  setupResizeListener() {
    const win = this.platform.windowRef as Window;
    if (!win) {
      return;
    }

    this.resizeSubscription = fromEvent(win, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => {
        this.calculateDimensions();
        this.goToSlide(this.currentIndex$.value);
      });
  }

  calculateDimensions() {
    if (!this.carouselContainer) return;
    
    this.containerWidth = this.carouselContainer.nativeElement.offsetWidth;
    this.itemWidth = (this.containerWidth - (this.perView - 1) * this.spacing) / this.perView;
    
    // If showPeek is true, adjust the item width
    if (this.showPeek && this.perView === 1) {
      this.itemWidth = this.containerWidth - this.peekAmount * 2;
    }
    
    // Apply width to all items
    const itemElements = this.el.nativeElement.querySelectorAll('.carousel-item');
    itemElements.forEach((item: HTMLElement) => {
      item.style.width = `${this.itemWidth}px`;
      item.style.marginRight = `${this.spacing}px`;
      item.style.marginLeft = `${this.spacing}px`;
    });
  }

  setupAutoplay() {
    this.clearAutoplay();
    if (this.autoplay) {
      this.autoplayInterval = setInterval(() => {
        this.next();
      }, this.autoplayDelay);
    }
  }

  clearAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }

  pauseAutoplay() {
    this.clearAutoplay();
  }

  resumeAutoplay() {
    if (this.autoplay) {
      this.setupAutoplay();
    }
  }

  prev() {
    if (this.currentIndex$.value > 0 || this.loop) {
      this.goToSlide(this.currentIndex$.value - 1);
    }
  }

  next() {
    if (this.currentIndex$.value < this.numSlides - 1 || this.loop) {
      this.goToSlide(this.currentIndex$.value + 1);
    }
  }

  goToSlide(index: number) {
    let targetIndex = index;

    // Handle looping
    if (this.loop) {
      if (index < 0) {
        targetIndex = this.numSlides - 1;
      } else if (index >= this.numSlides) {
        targetIndex = 0;
      }
    } else {
      // Clamp index without loop
      targetIndex = Math.max(0, Math.min(index, this.numSlides - 1));
    }

    // Calculate the translation
    const translateX = -(targetIndex * (this.itemWidth + this.spacing));
    
    // Apply transform
    const track = this.el.nativeElement.querySelector('.carousel-track');
    if (track) {
      track.style.transform = `translateX(${translateX}px)`;
    }

    this.currentIndex$.next(targetIndex);
    this.slideChange.emit(targetIndex);
    
    // Reset autoplay
    if (this.autoplay) {
      this.clearAutoplay();
      this.setupAutoplay();
    }
  }

  // Mouse and touch event handlers
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.startDrag(event.clientX);
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      this.updateDrag(event.clientX);
      event.preventDefault();
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.endDrag();
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.startDrag(event.touches[0].clientX);
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (this.isDragging) {
      this.updateDrag(event.touches[0].clientX);
      event.preventDefault();
    }
  }

  @HostListener('touchend')
  onTouchEnd() {
    this.endDrag();
  }

  startDrag(clientX: number) {
    this.isDragging = true;
    this.startX = clientX;
    this.currentX = clientX;
    this.pauseAutoplay();
    
    const track = this.el.nativeElement.querySelector('.carousel-track');
    if (track) {
      // Get current translateX value
      const style = (this.platform.windowRef as Window)?.getComputedStyle(track);
      const matrix = new WebKitCSSMatrix(style.transform);
      this.translateX = matrix.m41;
      
      // Add transition class
      track.classList.add('dragging');
    }
  }

  updateDrag(clientX: number) {
    if (!this.isDragging) return;
    
    const deltaX = clientX - this.currentX;
    this.currentX = clientX;
    this.translateX += deltaX;
    
    const track = this.el.nativeElement.querySelector('.carousel-track');
    if (track) {
      track.style.transform = `translateX(${this.translateX}px)`;
    }
  }

  endDrag() {
    if (!this.isDragging) return;
    this.isDragging = false;
    
    const track = this.el.nativeElement.querySelector('.carousel-track');
    if (track) {
      track.classList.remove('dragging');
      
      // Calculate which slide to snap to
      const dragDistance = this.currentX - this.startX;
      const slideThreshold = this.itemWidth * 0.2; // 20% threshold
      
      if (Math.abs(dragDistance) > slideThreshold) {
        // Determine direction
        if (dragDistance > 0) {
          this.prev();
        } else {
          this.next();
        }
      } else {
        // Snap back to current slide
        this.goToSlide(this.currentIndex$.value);
      }
    }
    
    this.resumeAutoplay();
  }

  // For indicator clicks
  onIndicatorClick(index: number) {
    this.goToSlide(index);
  }
}
