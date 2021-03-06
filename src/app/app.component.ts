import {
  Component,
  ViewChild,
} from '@angular/core';
import { CSVRecord } from './model/CSVRecord';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('csvReader', { static: false }) csvReader: any;

  fileName!: string;
  files_: any;
  isUploading: boolean = false;
  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'age',
    'position',
    'mobile',
  ];

  public records: any[] = [];

  uploadListener($event: any): void {
    this.files_ = $event.srcElement.files;

    if (this.isValidCSVFile(this.files_[0])) {
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
        this.fileName = input.files[0].name;
        this.isUploading = true;
        let headersRow = this.getHeaderArray(csvRecordsArray);

        this.records = this.getDataRecordsArrayFromCSVFile(
          csvRecordsArray,
          headersRow.length
        );
      };

      reader.onerror = function () {
        console.log('Error is occured while reading file!');
      };
    } else {
      alert('Please import valid .csv file.');
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvCollection = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let currentRecord = (<string>csvRecordsArray[i]).split(',');
      if (currentRecord.length == headerLength) {
        let csvRecord: CSVRecord = new CSVRecord();
        csvRecord.id = currentRecord[0].trim();
        csvRecord.firstName = currentRecord[1].trim();
        csvRecord.lastName = currentRecord[2].trim();
        csvRecord.age = currentRecord[3].trim();
        csvRecord.position = currentRecord[4].trim();
        csvRecord.mobile = currentRecord[5].trim();
        csvCollection.push(csvRecord);
      }
    }
    return csvCollection;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith('.csv');
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.csvReader.nativeElement.value = '';
    this.records = [];
  }

  reset() {
    this.csvReader.nativeElement.value = '';
    this.records = [];
    this.fileName = '';
    this.isUploading = false;
  }
}
