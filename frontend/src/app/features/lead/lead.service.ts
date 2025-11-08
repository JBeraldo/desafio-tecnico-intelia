import { inject, Injectable } from '@angular/core';
import { Lead } from './lead.model';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from '../storage/storage.service';

@Injectable({ providedIn: 'root' })
export class LeadService {
    protected leadSubject = new BehaviorSubject<Lead|null>(null)
    private storage = inject(StorageService)
    lead$ = this.leadSubject.asObservable()

    store(lead:Lead ){
        this.storage.store(lead)
        console.log(lead)
    }

    get(){
        let lead = this.storage.get()
        this.leadSubject.next(lead)    
    }
}
