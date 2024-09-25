import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[paimonClickOutside]',
  standalone: true
})
export class ClickOutsideDirective {
  // id or className
  @Input() skipSelectors: string[] = [];
  @Output() clickOutsideChange = new EventEmitter<void>();
  @HostListener('document:click', ['$event', '$event.target'])
  public onClick($event: MouseEvent, targetElement: HTMLDivElement) {
    const isClickedInside = this._elementRef.nativeElement.contains(targetElement);
    // if need to skip elements with specific selectors
    const isSkipped = this.skipSelectors.some(
      selector => targetElement.classList.contains(selector) || targetElement.id === selector
    );
    if (!isClickedInside && !isSkipped) {
      this.clickOutsideChange.emit();
    }
  }
  constructor(private _elementRef: ElementRef) {}
}
