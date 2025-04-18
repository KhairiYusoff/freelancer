export interface Profile {
  id: string;
  full_name: string | null;
  company_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: 'active' | 'completed' | 'on-hold';
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  client_id: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  number: string;
  status: 'draft' | 'sent' | 'paid';
  issue_date: string;
  due_date: string | null;
  amount: number;
  project_id: string | null;
  client_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}