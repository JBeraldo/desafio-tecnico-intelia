import { Injectable } from '@angular/core';
import { Lead } from '../lead/lead.model';

@Injectable({ providedIn: 'root' })
export class StorageService {

    storeLead(lead:Lead ){
        localStorage.setItem('lead_data',JSON.stringify(lead))
    }

    getLead():Lead | null {
        let leadObject = localStorage.getItem('lead_data')
        if (leadObject) {
            return JSON.parse(leadObject) as Lead
        }

        return null
    }

    storeKey(key:string,data:string ){
        localStorage.setItem(key,data)
    }

    getKey(key:string):string| null {
        return localStorage.getItem(key)
    }
    removeKey(key:string)
    {
        localStorage.removeItem(key)
    }
}
