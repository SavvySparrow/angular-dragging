import { AfterViewChecked, AfterViewInit, Component, VERSION } from "@angular/core";

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
export class AppComponent implements AfterViewChecked,AfterViewInit {
  name = "Dragging";

  sqaure2DArray: Array<Square2D>;

  constructor() {}
  ngAfterViewChecked(): void {
    //this.sqaure2DArray = this.sqaure2DArray;
  }

  ngAfterViewInit(): void {
    this.initGenerateSquare2dArray();
  }

  initGenerateSquare2dArray() {
    const randomInt = this.getRandomInt(2, 10);
    [...Array(randomInt)].forEach((_, i) => {
      console.log(i);
      this.sqaure2DArray.push({initialLeft: this.getRandomLeft(),initialTop: this.getRandomTop(),currentBounds: {}});
    });
  }

  getRandomLeft(): number {
    return this.getRandomInt(0,1444);
  }

  getRandomTop(): number {
    return this.getRandomInt(0,553);;
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

  updateCurrentBounds(sqaure2D, cord) {
    sqaure2D.currentBounds = cord;
  }
}
