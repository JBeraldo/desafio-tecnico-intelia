export interface Lead {
    fullName:string | null
    birthDate:string | null
    email:string | null
    street: string | null
    street_number: number | null
    postal_code: string | null
    state:string | null
    landline: string | null
    cellphone: string | null
}

export type LeadPersonal = Partial<Pick<Lead, 'fullName' | 'birthDate' | 'email' >>
export type LeadAddress = Partial<Pick<Lead, 'street' | 'street_number' | 'postal_code' | 'state' >>
export type LeadContact = Partial<Pick<Lead, 'landline' | 'cellphone' >>