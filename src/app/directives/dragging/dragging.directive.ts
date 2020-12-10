import { DOCUMENT } from "@angular/common";
import {
  AfterViewInit,
ContentChild,
    Directive,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit
} from "@angular/core";
import { fromEvent, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DraggingHandleDirective } from "./drag-handle.directive";
import { DraggingService } from "./dragging.service";

@Directive({ selector: "[savDrag]" })
export class AngularDraggingDirective
  implements OnInit, AfterViewInit, OnDestroy {
  private element: HTMLElement;

  private subscriptions: Subscription[] = [];

  @ContentChild(DraggingHandleDirective) handleElementRef: DraggingHandleDirective;
  handleElement: HTMLElement;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private document: any,
    private service: DraggingService
  ) {}
  ngAfterViewInit(): void {
    this.element = this.elementRef.nativeElement as HTMLElement;
    this.handleElement = this.handleElementRef?.elementRef.nativeElement as HTMLElement || this.element;
    this.initDrag();
  }
  ngOnInit(): void {
    
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  initDrag() {
    const dragStart$ = fromEvent<MouseEvent>(this.handleElement, "mousedown");
    const dragEnd$ = fromEvent<MouseEvent>(this.document, "mouseup");
    const drag$ = fromEvent<MouseEvent>(this.document, "mousemove").pipe(
      takeUntil(dragEnd$)
    );

    //dragStart$.subscribe(x => console.log(x));
    // 2
    let initialX: number,
      initialY: number,
      currentX = 0,
      currentY = 0;

    let dragSub: Subscription;

    // 3
    const dragStartSub = dragStart$.subscribe((event: MouseEvent) => {
      console.log(event.clientX, event.clientY, event.offsetX, event.offsetY);
      initialX = event.clientX - currentX;
      initialY = event.clientY - currentY;
      console.log("initial-axis", initialX, initialY);
      this.element.classList.add("free-dragging");

      // 4
      dragSub = drag$.subscribe((event: MouseEvent) => {
        console.log("current", currentX, currentY);
        if (currentX >= 0 && currentY >= 0) {
          event.preventDefault();

          currentX = event.clientX - initialX;
          currentY = event.clientY - initialY;
          if(currentY<0)currentY=0;
          if(currentX<0)currentX=0;
          console.log(event.clientX, event.offsetX);
          this.service.offsetX$.next(event.clientX);
          this.service.offsetY$.next(event.clientY);
          this.service.currentX$.next(currentX);
          this.service.currentY$.next(currentY);
          this.element.style.transform =
            "translate3d(" + currentX + "px, " + currentY + "px, 0)";
        }
      });
    });

    // 5
    const dragEndSub = dragEnd$.subscribe(() => {
      initialX = currentX;
      initialY = currentY;
      this.element.classList.remove("free-dragging");
      if (dragSub) {
        dragSub.unsubscribe();
      }
    });

    // 6
    this.subscriptions.push.apply(this.subscriptions, [
      dragStartSub,
      dragSub,
      dragEndSub
    ]);
  }
}
