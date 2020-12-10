import { Directive, ElementRef } from "@angular/core";

@Directive({
  selector: "[savDragHandle]",
})
export class DraggingHandleDirective {
  constructor(public elementRef: ElementRef<HTMLElement>) {}
}