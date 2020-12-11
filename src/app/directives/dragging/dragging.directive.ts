import { DOCUMENT } from "@angular/common";
import {
AfterViewChecked,
  AfterViewInit,
ContentChild,
    Directive,
  ElementRef,
EventEmitter,
    Inject,
Input,
    OnDestroy,
  OnInit,
Output
} from "@angular/core";
import { fromEvent, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DraggingHandleDirective } from "./drag-handle.directive";

@Directive({ selector: "[savDrag]" })
export class AngularDraggingDirective
  implements OnInit, AfterViewInit, OnDestroy {

  static destroyCount: number = 0;

  @Input('savDrag') bound: any;
  @Output('currentBounds') currentBounds: EventEmitter<any> = new EventEmitter();
  private element: HTMLElement;

  private subscriptions: Subscription[] = []

  @ContentChild(DraggingHandleDirective) handleElementRef: DraggingHandleDirective;
  handleElement: HTMLElement;
  draggingBoundaryElement: HTMLElement;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngAfterViewInit(): void {
    this.draggingBoundaryElement = (this.document as Document).querySelector(".drag-boundary");
    this.element = this.elementRef.nativeElement as HTMLElement;
    this.handleElement = this.handleElementRef?.elementRef.nativeElement as HTMLElement || this.element;
    this.initDrag();
  }
  ngOnInit(): void {
    
  }
  ngOnDestroy(): void {
    console.log(`Destroyed: (${this.bound.initialLeft},${this.bound.initialTop})`,++AngularDraggingDirective.destroyCount);
    this.subscriptions.forEach(s => {
      if(s) s.unsubscribe();
    });
  }

  initDrag() {
    const dragStart$ = fromEvent<MouseEvent>(this.handleElement, "mousedown");
    const dragEnd$ = fromEvent<MouseEvent>(this.document, "mouseup");
    const drag$ = fromEvent<MouseEvent>(this.document, "mousemove").pipe(
      takeUntil(dragEnd$)
    );

    // 2
    let initialX: number,
      initialY: number,
      currentX = 0,
      currentY = 0;

    let dragSub: Subscription;

    const minBoundX = currentX;
    const minBoundY = currentY;
    const maxBoundX =
      minBoundX +
      this.draggingBoundaryElement.offsetWidth -
      this.element.offsetWidth;
    const maxBoundY =
      minBoundY +
      this.draggingBoundaryElement.offsetHeight -
      this.element.offsetHeight;
      currentX = Math.max(minBoundX, Math.min(this.bound?this.bound.initialLeft:0, maxBoundX));
      currentY = Math.max(minBoundY, Math.min(this.bound?this.bound.initialTop:0, maxBoundY));
      this.generateNewBounds(currentX,currentY);
      
      //console.log(this.bound,currentX,currentY,maxBoundX,maxBoundY)
    // 3
    const dragStartSub = dragStart$.subscribe((event: MouseEvent) => {
      //console.log(event.clientX, event.clientY, event.offsetX, event.offsetY);
      initialX = event.clientX - currentX
      initialY = event.clientY - currentY;
      //console.log("initial-axis", initialX, initialY);
      this.element.classList.add("free-dragging");

      // 4
      dragSub = drag$.subscribe((event: MouseEvent) => {
        event.preventDefault();
          const x = event.clientX - initialX;
          const y = event.clientY - initialY;
          //console.log(event.clientX,event.clientY,x,y, event.offsetX);

          currentX = Math.max(minBoundX, Math.min(x, maxBoundX));
          currentY = Math.max(minBoundY, Math.min(y, maxBoundY));
          this.currentBounds.emit({x: currentX, y: currentY,width: this.element.offsetWidth,height: this.element.offsetHeight});
          this.element.style.transform =
            "translate3d(" + currentX + "px, " + currentY + "px, 0)";
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

  generateNewBounds(currentX,currentY) {
    this.element.style.transform =
        "translate3d(" + currentX + "px, " + currentY + "px, 0)";
    this.currentBounds.emit({x: currentX, y: currentY,width: this.element.offsetWidth,height: this.element.offsetHeight});
  }
}
