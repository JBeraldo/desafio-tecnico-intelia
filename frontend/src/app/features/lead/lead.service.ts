import { inject, Injectable } from '@angular/core'
import { Lead, LeadGetResponse, LeadStoreResponse } from './lead.model'
import {
    throwError,
    BehaviorSubject, catchError, Observable, tap
} from 'rxjs'
import { StorageService } from '../storage/storage.service'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../enviroments/enviroment'
import { ViaCepResponse } from '../../shared/shared.types'

@Injectable({ providedIn: 'root' })
export class LeadService {
    protected leadSubject = new BehaviorSubject<Lead | null>(null)
    private storage = inject(StorageService)
    private http = inject(HttpClient)
    private url = environment.apiHost
    uuid = this.storage.getKey('uuid')
    lead$ = this.leadSubject.asObservable()

    store(lead: Lead): Observable<LeadStoreResponse> {
        return this.http.post<LeadStoreResponse>(`${this.url}/lead`, lead).pipe(tap(
            (response) => {
                this.uuid = response.uuid
                this.storage.storeKey('uuid', this.uuid)
                this.leadSubject.next({ ...lead, uuid: this.uuid })
            }
        ))
    }

    update(lead: Lead): Observable<Partial<Omit<LeadStoreResponse, 'uuid'>>> {
        return this.http.put<Partial<Omit<LeadStoreResponse, 'uuid'>>>(`${this.url}/lead`, lead).pipe(
            tap(() => this.leadSubject.next(lead))
        )
    }

    get(): Observable<LeadGetResponse> {
        return this.http.get<LeadGetResponse>(`${this.url}/lead/${this.uuid}`)
            .pipe(catchError((err) => {
                this.storage.removeKey('uuid')
                return throwError(() => err)
            }),
        tap((response) => this.leadSubject.next(response.lead)))
    }

    searchCep(cep: string): Observable<ViaCepResponse> {
        return this.http.get<ViaCepResponse>(`https://viacep.com.br/ws/${cep}/json/`)
    }
}
