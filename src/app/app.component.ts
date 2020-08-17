import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'usn-formatter';
  listUSNs: string[];

  constructor(private toastr: ToastrService) { }

  usnForm = new FormGroup({
    usns: new FormControl('', [Validators.required]),
    output: new FormControl('')
  })

  get formControls() {
    return this.usnForm.controls;
  }

  clear() {
    this.usnForm.controls.usns.setValue('');
    this.usnForm.controls.output.setValue('');
  }

  format() {
    this.listUSNs = [];
    const regex1 = /[0-9][a-zA-Z]{2,}\d{2,}[a-zA-Z]{2,}\d{2,}/g;
    const regexSpecies = /[0-9][a-zA-Z]{2,}\d{2,}[a-zA-Z]{2,}/g;

    let temp = this.usnForm.controls.usns.value;
    temp = temp.replace(/\s/g, ''); // removing spaces
    let speciesHead = temp.match(regex1);
    let speciesTail = temp.split(regex1).slice(1,);

    let index = 0;

    speciesHead.forEach(element => {
      this.listUSNs.push(element);
      let speciesPrefix = element.match(regexSpecies);
      let citizens = this.removeItemAll(speciesTail[index].split(","), "");
      index++;
      citizens.forEach(citizen => {
        this.listUSNs.push(speciesPrefix + citizen);
      });
    });

    // console.log(listUSNs);
    this.usnForm.controls.output.setValue(this.listUSNs);
  }

  removeItemAll(arr, value) {
    var i = 0;
    while (i < arr.length) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
  }

  copy() {
    if (this.usnForm.controls.output.value.length < 1) {
      this.toastr.error('Format the string to copy', 'Nothing to Copy!');
    }
    else {
      navigator.clipboard.writeText(this.listUSNs.join('\n'));
      this.toastr.success('Available from your clipboard', 'Copied!')
    }
  }

  async formatAndCopy() {
    await this.format();
    await this.copy();
  }
}
