import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();
  private navigationLoading = false;

  constructor() {}

  setLoading(loading: boolean): void {
    console.log(loading);
    this.navigationLoading = loading;
    this.loadingSubject.next(loading);
  }

  startLoading(): void {
    this.setLoading(true);
  }

  stopLoading(): void {
    this.setLoading(false);
  }

  isLoading(): boolean {
    return this.navigationLoading;
  }
}
