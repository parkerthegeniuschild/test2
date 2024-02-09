export type Company = {
  id: number;
  name: string;
  type: string;
  usdot?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
};

export type Dispatcher = {
  id: number;
  company_id?: number;
  email?: string;
  firstname: string;
  lastname?: string;
  phone?: string;
  secondary_phone?: string;
};

export type Driver = {
  id: number;
  email?: string;
  firstname: string;
  lastname?: string;
  phone?: string;
  secondary_phone?: string;
};
