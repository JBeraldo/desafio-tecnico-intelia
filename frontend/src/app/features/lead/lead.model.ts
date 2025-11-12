export interface Lead {
    uuid?: string | null
    full_name:string | null
    birth_date:string | null
    email:string | null
    street: string | null
    street_number: number | null
    city: string | null
    postal_code: string | null
    state:string | null
    landline: string | null
    cellphone: string | null
    step?: number
}

export type LeadPersonal = Partial<Pick<Lead, 'full_name' | 'birth_date' | 'email' >>
export type LeadAddress = Partial<Pick<Lead, 'street' | 'street_number' | 'postal_code' | 'state' >>
export type LeadContact = Partial<Pick<Lead, 'landline' | 'cellphone' >>

export interface LeadStoreResponse{
    message:string
    uuid:string
}
export interface LeadGetResponse{
    message:string
    lead: Lead
}