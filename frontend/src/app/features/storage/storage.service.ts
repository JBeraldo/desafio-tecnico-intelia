import { Injectable } from '@angular/core';
import { Lead } from '../lead/lead.model';

@Injectable({ providedIn: 'root' })
export class StorageService {

    store(lead:Lead ){
        localStorage.setItem('lead_data',JSON.stringify(lead))
    }

    get():Lead | null {
        let leadObject = localStorage.getItem('lead_data')
        if (leadObject) {
            return JSON.parse(leadObject) as Lead
        }

        return null
    }
}
