import { inject, Injectable } from '@angular/core';
import { Lead, LeadGetResponse, LeadStoreResponse } from './lead.model';
import { throwError,
BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment';

@Injectable({ providedIn: 'root' })
export class LeadService {
    protected leadSubject = new BehaviorSubject<Lead|null>(null)
    private storage = inject(StorageService)
    private http = inject(HttpClient)
    private url = environment.apiHost
    lead$ = this.leadSubject.asObservable()

    private store(lead:Lead ): Observable<LeadStoreResponse>{
        return this.http.post<LeadStoreResponse>(`${this.url}/lead`,lead).pipe(tap(
            (response) => {
                this.storage.storeKey('uuid',response.uuid)
            }
        ))
    }

    private update(lead:Lead ): Observable<Partial<Omit<LeadStoreResponse, 'uuid'>>>{
        return this.http.put<Partial<Omit<LeadStoreResponse, 'uuid'>>>(`${this.url}/lead`,lead)
    }

    updateUser(leadData:Lead): Observable<Partial<Omit<LeadStoreResponse, 'uuid'>>>{
        let lead = {
            ...leadData,
            uuid: this.storage.getKey('uuid')
        }
        this.leadSubject.next(lead)

        if(lead.uuid){
            return this.update(lead)
        }
        else{
            return this.store(lead)
        }
    }

    get() {
        let uuid = this.storage.getKey('uuid')
        if(uuid){
            this.http.get<LeadGetResponse>(`${this.url}/lead/${uuid}`)
            .pipe(catchError((err)=> {
                this.storage.removeKey('uuid')
                return throwError(()=>err)
            }))
            .subscribe((response) => this.leadSubject.next(response.lead))
        }
    }
}
