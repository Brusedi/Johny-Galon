import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { AppSettings } from "../app-setting";
import { of } from 'rxjs';



@Injectable()
export class AppSettingsService {
  getSettings(): Observable<AppSettings> {
    let settings = new AppSettings();
    return of<AppSettings>(settings);
  }
}