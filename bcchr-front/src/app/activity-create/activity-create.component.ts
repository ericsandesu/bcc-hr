import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgxChartsModule, reduceTicks } from '@swimlane/ngx-charts';
import { single } from './data';
import { activities } from './master-activity';
import { Subject } from 'rxjs';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-activity-create',
  templateUrl: './activity-create.component.html',
  styleUrls: ['./activity-create.component.scss']
})
export class ActivityCreateComponent implements OnInit {

  //  projects = ['corp web','online claim', 'ext cmp'];
  projects: any[];
  /*
  projects = [{
    name: 'Corp web', time: 0
  },
  { name: 'Online claim', time: 0 },
  { name: 'Ext cmp', time: 0 }
  ];
*/
  adjustmentButton: boolean[];
  activityList : any[];

  totalTime: number = 8.5;
  autoTicks = false;
  disabled = false;
  invert = false;
  max = this.totalTime;
  min = 0;
  showTicks = false;
  step = 0.25;
  thumbLabel = true;
  value = 0;
  vertical = false;
  isNegative: boolean = false;

  errorMessage: string;

  single: any[];
  view: any[] = [500, 400];

  // options
  showLegend: boolean = true;
  showLabels: boolean = true;

  update$: Subject<any> = new Subject();

  //  @ViewChild('chart') chart: LineChartComponent;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  updateChart() {
    this.update$.next(true);
  }

  constructor(public dialog: MatDialog) {
    Object.assign(this, { single });
    /*   var data = [
         {
           "name": "Thursday",
           "value": 8
         }
       ];
       Object.assign(this, { data });
       */
    //   this.single[0].value = 5;
  }

  onSelect(event) {
    console.log(event);
  }

  onChange() {
    console.log('On Change');
    this.single[0].value = this.countTotal();
    this.single[1].value = this.totalTime - this.countTotal();
    Object.assign(this, { single });
    this.updateChart();
    this.single = [...this.single];
    this.updateColor();
    this.updateAdjustmentButton();
  }

  adjustAll() {
    // remove negative number
    this.projects.forEach((value, index, array) => {
      if (array[index].time < 0) {
        this.single[0].value += (array[index].time * -1);
        this.single[1].value -= (array[index].time * -1);
        array[index].time = 0;
        this.updateChart();
        this.single = [...this.single];
      }
    });
    while (this.single[0].value != this.totalTime) {
      this.projects.forEach((value, index, array) => {
        if (this.single[0].value < this.totalTime) {
          array[index].time += 0.25;
          this.single[0].value += 0.25;
          this.single[1].value -= 0.25;
        } else if (this.single[0].value > this.totalTime && array[index].time > 0) {
          array[index].time -= 0.25;
          this.single[0].value -= 0.25;
          this.single[1].value += 0.25;
        }
      });
    }
/*    if (this.single[0].value==this.totalTime) {
      this.single[1].value=0;
    }
*/    this.updateChart();
    this.single = [...this.single];
    this.errorMessage = "";
    this.checkIfNegative();
    this.updateColor();
    this.updateAdjustmentButton();
  }

  updateAdjustmentButton() {
    console.log('updateAdjustmentButton()');
    if (this.single[0].value == this.totalTime) {
      this.projects.forEach((value, index, array) => {
        this.adjustmentButton[index] = false;
      });
      console.log('input matched');
    } else {
      console.log('input not matched');
      this.projects.forEach((value, index, array) => {
        console.log('checking project ' + index);
        if (this.single[0].value > this.totalTime && array[index].time == 0) {
          console.log('input too much');
          this.adjustmentButton[index] = false;
        } else {
          this.adjustmentButton[index] = true;
        }
      });
    }
    this.adjustmentButton = [...this.adjustmentButton];
  }

  updateColor() {
    if (this.single[0].value > this.totalTime) {
      console.log('time over');
      //     document.getElementsByTagName('path')[0].style.fill = "red !important";
              /* commented to avoid error */
      (<HTMLElement><unknown>document.querySelector('mat-slider.total')).style.backgroundColor = "#AA0000";
      setTimeout(() => { document.getElementsByTagName('path')[0].style.fill = "red"; }, 1500);
      this.errorMessage = "time exceeding 100%";
    } else if (this.single[0].value < this.totalTime) {
              /* commented to avoid error */
      (<HTMLElement><unknown>document.querySelector('mat-slider.total')).style.backgroundColor = "lightgray";
      setTimeout(() => { (<HTMLElement><unknown>document.getElementsByTagName('path')[0]).style.fill = "#69f0ae"; }, 1200);
      this.errorMessage = "";
      console.log('need more');
    } else if (this.single[0].value == this.totalTime) {
      //      document.querySelector('mat-slider.total').style.backgroundColor = "#90ee90";
      /* commented to avoid error */
      (<HTMLElement><unknown>document.querySelector('mat-slider.total')).style.backgroundColor = "rgb(90, 164, 84)";
      setTimeout(() => {
        /* commented to avoid error */
        document.getElementsByTagName('path')[0].style.fill = "green";
        (<HTMLElement><unknown>document.querySelector('mat-slider.total > div > div.mat-slider-track-wrapper > div.mat-slider-track-fill')).style.backgroundColor = "green";
      }, 1200);
      this.errorMessage = "";
      console.log('match');
    }
  }

  minus(projectNo: number) {
    this.projects[projectNo].time = this.projects[projectNo].time - 0.25;
    if (this.projects[projectNo].time < 0) {
      this.projects[projectNo].time = 0;
    }
    this.projects = [...this.projects];
    
    this.single[0].value = this.countTotal();
    //    this.single[1].value = 8 - (this.value + this.value2 + this.value3);
    this.single[1].value = this.totalTime - this.countTotal();
    Object.assign(this, { single });
    this.updateChart();
    //    this.single[0].value = this.value + this.value2 + this.value3;
    //    this.single[1].value = 8 - (this.value + this.value2 + this.value3);
    this.single = [...this.single];

    console.log('this.single[0].value ' + this.single[0].value);

    this.checkIfNegative();
    if (this.projects[projectNo].time < 0) {
      this.isNegative = true;
    }
    this.updateColor();
    this.updateAdjustmentButton();
  }

  plus(projectNo: number) {
    this.projects[projectNo].time = this.projects[projectNo].time + 0.25;
    if (this.projects[projectNo].time > this.totalTime) {
      this.projects[projectNo].time = this.totalTime;
    }
    this.projects = [...this.projects];
//    this.single[0].value = this.projects[0].time + this.projects[1].time + this.projects[2].time;
    this.single[0].value = this.countTotal();
    //    this.single[1].value = 8 - (this.value + this.value2 + this.value3);
    this.single[1].value = this.totalTime - this.countTotal();
    Object.assign(this, { single });
    this.updateChart();
    //    this.single[0].value = this.value + this.value2 + this.value3;
    //    this.single[1].value = 8 - (this.value + this.value2 + this.value3);
    this.single = [...this.single];

    console.log('this.single[0].value ' + this.single[0].value);

    this.checkIfNegative();
    if (this.projects[projectNo].time < 0) {
      this.isNegative = true;
    }
    this.updateColor();
    this.updateAdjustmentButton();
  }

  countTotal() {
    var totalCount : number = 0;
    this.projects.forEach((value, index,array) => {
      totalCount += array[index].time; 
    });
    return totalCount;
  }

  adjust(projectNo: number) {
    //    var adjustmentValue  = this.single[0].value - (this.projects[0].time + this.projects[1].time + this.projects[2].time);
    //    var adjustmentValue  = 8 - (this.projects[0].time + this.projects[1].time);
//    this.projects[projectNo].time = this.projects[projectNo].time + this.totalTime - (this.projects[0].time + this.projects[1].time + this.projects[2].time);
    this.projects[projectNo].time = this.projects[projectNo].time + this.totalTime - this.countTotal();
    if (this.projects[projectNo].time < 0) {
      this.projects[projectNo].time = 0;
    }
    console.log('adjustment for project no ' + projectNo + ' should be ' + this.projects[projectNo].time);

    this.projects = [...this.projects];
//    this.single[0].value = this.projects[0].time + this.projects[1].time + this.projects[2].time;
    this.single[0].value = this.countTotal(); 
    //    this.single[1].value = 8 - (this.value + this.value2 + this.value3);
    this.single[1].value = this.totalTime - this.countTotal();
    Object.assign(this, { single });
    this.updateChart();
    //    this.single[0].value = this.value + this.value2 + this.value3;
    //    this.single[1].value = 8 - (this.value + this.value2 + this.value3);
    this.single = [...this.single];

    console.log('this.single[0].value ' + this.single[0].value);

    this.checkIfNegative();
    if (this.projects[projectNo].time < 0) {
      this.isNegative = true;
    }
    this.updateColor();
    this.updateAdjustmentButton();
  }

  checkIfNegative() {
    this.isNegative = false;
    this.projects.forEach((value, index, array) => {
      if (array[index].time < 0) {
        this.isNegative = true;
      }
    });
    return true;
  }

  removeActivity(projectNo: number) {
    this.projects.splice(projectNo, 1);
    this.projects = [...this.projects];
    this.checkIfNegative();
    this.single[0].value = this.countTotal(); 
    //    this.single[1].value = 8 - (this.value + this.value2 + this.value3);
    this.single[1].value = this.totalTime - this.countTotal();
    Object.assign(this, { single });
    this.updateChart();
    this.single = [...this.single];
    this.updateColor();
    this.updateAdjustmentButton();
  }

  resetProject(projectNo: number) {
    //    var adjustmentValue  = this.single[0].value - (this.projects[0].time + this.projects[1].time + this.projects[2].time);
    //    var adjustmentValue  = 8 - (this.projects[0].time + this.projects[1].time);
    this.projects[projectNo].time = 0;
    this.projects = [...this.projects];
    this.single[0].value = this.countTotal();
    //    this.single[1].value = 8 - (this.value + this.value2 + this.value3);
    this.single[1].value = this.totalTime - this.countTotal();
    Object.assign(this, { single });
    this.updateChart();
    //    this.single[0].value = this.value + this.value2 + this.value3;
    //    this.single[1].value = 8 - (this.value + this.value2 + this.value3);
    this.single = [...this.single];
    this.updateColor();
    this.updateAdjustmentButton();
  }

  addAll() {
    this.projects.forEach((value, index, array) => {
      if (this.countTotal() < this.totalTime) {
        array[index].time += 0.25;
      }
      this.projects = [...this.projects];
      this.single[0].value = this.countTotal();
      //    this.single[1].value = 8 - (this.value + this.value2 + this.value3);
      this.single[1].value = this.totalTime - this.countTotal();
      Object.assign(this, { single });
      this.updateChart();
      this.single = [...this.single];
      this.updateColor();
      this.updateAdjustmentButton();  
    });

  }

  substractAll() {
    this.projects.forEach((value, index, array) => {
      if (array[index].time > 0) {
        array[index].time -= 0.25;
      }
      this.projects = [...this.projects];
      this.single[0].value = this.countTotal();
      //    this.single[1].value = 8 - (this.value + this.value2 + this.value3);
      this.single[1].value = this.totalTime - this.countTotal();
      Object.assign(this, { single });
      this.updateChart();
      this.single = [...this.single];
      this.updateColor();
      this.updateAdjustmentButton();  
    });

  }


  resetAll() {
    this.projects.forEach((value, index, array) => {
      array[index].time = 0;
    });
    this.projects = [...this.projects];
    this.single[0].value = 0;
    this.single[1].value = this.totalTime;

    Object.assign(this, { single });
    this.updateChart();
    //    this.single[0].value = this.value + this.value2 + this.value3;
    //    this.single[1].value = 8 - (this.value + this.value2 + this.value3);
    this.single = [...this.single];
    this.errorMessage = "";
    this.updateColor();
    this.updateAdjustmentButton();
  }

  /*
    adjust3() {
      this.value3 = 8 - this.value - this.value2;
      this.single[0].value = this.value + this.value2 + this.value3;
      this.single[1].value = 8 - (this.value + this.value2 + this.value3);
      this.single = [...this.single];
      if (this.single[0].value > 8) {
        console.log('time over');
        document.getElementsByTagName('path')[0].style.fill = "red";
        this.errorMessage = "time exceeding 100%";
      } else {
        this.errorMessage = "";
      }
  
      if (this.value3 < 0) {
        console.log('time over');
        //     document.getElementsByTagName('path')[0].style.fill = "red !important";
        //       document.getElementsByTagName('mat-slider')[2].style.background-color = "red";
        //        document.querySelector('mat-slider.project3')[0].style.background = "red";
        this.warning3 = "exceeded";
        //       document.getElementsByTagName('mat-slider')[2].getElementsByClassName.   .style.fill = "red";
        //  setTimeout(() => { document.getElementsByTagName('path')[0].style.fill = "red"; }, 1500);
        //  this.errorMessage = "time exceeding 100%";
      } else {
        this.warning3 = "";
        //      document.getElementsByTagName('mat-slider')[2].style.background-color = "gray";
        // document.querySelector('mat-slider.project3')[0].style.background = "gray";
      }
  
    }
  */

  ngOnInit() {
    //    single = .value : 5;
    this.activityList = activities;
    this.projects = activities;
    console.log("activities count " + this.projects.length + " " + activities.length);
    activities.forEach((value, index, array) => {
      console.log("activities " + index + array[index].name);
      this.projects[index].time = 0;
    });
 //   this.projects.splice(3, 1); 
 //   this.projects.splice(2, 1); 

   /* only push the first activity */
//   this.projects.push(activities[0]);
//   this.projects[0].time = 0;

    this.projects = [...this.projects];

    this.max = this.totalTime;
    this.single[1].value = this.totalTime;
    this.adjustmentButton = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true,];
    /*    this.projects.forEach((value,index,array) => {
          this.adjustmentButton.push(true);
        });
        */
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {name: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.projects.push({ code: 'JAPXX', name: result, time: 0 });
      this.projects = [...this.projects];
      this.updateAdjustmentButton();
    });
  } 

}

export interface ProjectData {
  code: string;
  name: string;
  time: number;
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}