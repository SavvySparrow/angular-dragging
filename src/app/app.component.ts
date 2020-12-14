import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  VERSION,
  ViewChild
} from "@angular/core";
import { AngularDraggingDirective } from "./directives/dragging/dragging.directive";

type Square2D = {
  initialLeft: number;
  initialTop: number;
  currentBounds: any;
};

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent
  implements
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked,
    OnInit {
  name = "Dragging";

  sqaure2DArray: Array<Square2D>;

  @ViewChild("boundary", { read: ElementRef, static: true })
  boundaryRef: ElementRef;

  constructor(private ngZone: NgZone) {}
  ngOnInit(): void {
    console.log("on init");
    if (!this.sqaure2DArray) {
      this.initGenerateSquare2dArray();
    }
  }

  ngAfterViewChecked(): void {
    // if (!this.sqaure2DArray) {
    //   this.initGenerateSquare2dArray();
    // }
    console.log("on view checked");
  }

  ngAfterContentInit(): void {}
  ngAfterContentChecked(): void {
    if (!this.sqaure2DArray) {
      this.initGenerateSquare2dArray();
    }
  }

  ngAfterViewInit(): void {}

  initGenerateSquare2dArray() {
    this.sqaure2DArray = [];
    let tempQuad: any;
    const randomInt = this.getRandomInt(2, 10);
    [...Array(randomInt)].forEach((_, i) => {
      tempQuad = this.getXYQuad();
      this.sqaure2DArray.push({
        initialLeft: tempQuad.x,
        initialTop: tempQuad.y,
        currentBounds: {}
      });
    });
    //console.log(this.sqaure2DArray.length, this.sqaure2DArray);
  }

  getXYQuad() {
    let found: boolean = false;
    let maxBoundX = (this.boundaryRef.nativeElement as HTMLElement).offsetWidth - 102;
    let maxBoundY = (this.boundaryRef.nativeElement as HTMLElement).offsetHeight - 102;
    let cordX: number = this.getRandomInt(0, maxBoundX);
    let cordY: number = this.getRandomInt(0, maxBoundY);
    let i = 0;
    this.ngZone.runOutsideAngular(() => {
      while (!found && i<100) {
        cordX = this.getRandomInt(0, maxBoundX);
        cordY = this.getRandomInt(0, maxBoundY);
        if (this.sqaure2DArray.length == 0) {
          console.log(`found at - (${cordX},${cordY})`);
          found = true;
        } else {
          let foundTemp = true;
          console.log(`verify Quad - (${cordX},${cordY}) and length - ${this.sqaure2DArray.length}`);
          this.sqaure2DArray.every((item, index) => {
            console.log(index,item.initialLeft,(cordX >= 0 && cordX < item.initialLeft-102),(cordX <= maxBoundX && cordX > item.initialLeft+102))
            if (!((cordX >= 0 && cordX < item.initialLeft-102) || (cordX <= maxBoundX && cordX > item.initialLeft+102))
            || !((cordY >= 0 && cordY < item.initialTop-102) || (cordY <= maxBoundY && cordY > item.initialTop+102))) {
              foundTemp=false;
              console.log('break loop');
              return false;
            }
            return true;
          });
          if(foundTemp) {
            console.log(`found at - (${cordX},${cordY})`);
            found=true;
          } 
        }
        i++;
      }
    });

    //console.log(found, cord);
    return {x: cordX,y: cordY};
  }

  getRandomLeft(): number {
    let found: boolean = false;
    let maxBound =
      (this.boundaryRef.nativeElement as HTMLElement).offsetWidth - 102;
    //maxBound = 1444;
    let cord: number = this.getRandomInt(0, maxBound);
    let i = 0;
    this.ngZone.runOutsideAngular(() => {
      while (!found && i<100) {
        cord = this.getRandomInt(0, maxBound);
        if (this.sqaure2DArray.length == 0) {
          console.log("found at",cord);
          found = true;
        } else {
          let foundTemp = true;
          console.log("length",this.sqaure2DArray.length,cord);
          this.sqaure2DArray.every((item, index) => {
            console.log(index,item.initialLeft,(cord >= 0 && cord < item.initialLeft-102),(cord <= maxBound && cord > item.initialLeft+102))
            if (!((cord >= 0 && cord < item.initialLeft-102) || (cord <= maxBound && cord > item.initialLeft+102))) {
              foundTemp=false;
              console.log('break loop');
              return false;
            }
            return true;
          });
          if(foundTemp) {
            //console.log("found at",cord);
            found=true;
          } 
        }
        i++;
      }
    });

    //console.log(found, cord);
    return cord;
  }

  getRandomTop(): number {
    return this.getRandomInt(0, 553);
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

  updateCurrentBounds(sqaure2D, cord) {
    sqaure2D.currentBounds = cord;
  }

  refresh() {
    AngularDraggingDirective.destroyCount = 0;
    this.sqaure2DArray = undefined;
  }
}
