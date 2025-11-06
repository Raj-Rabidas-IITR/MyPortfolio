export interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: 'pending' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
