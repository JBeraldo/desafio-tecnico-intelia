import { Injectable } from '@angular/core';
import { Lead } from './lead.model';

@Injectable({ providedIn: 'root' })
export class LeadService {

    store(lead:Lead ){
        console.log(lead)
    }
}
