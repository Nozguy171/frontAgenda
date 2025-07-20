export interface Prospect {
  id: number;
  name: string;
  phone: string;
  observation: string;
  status: 'pending' | 'no-response';
}

export const mockProspects: Prospect[] = [
  { id: 1, name: 'Juan Pérez', phone: '555-1234', observation: 'Interesado en demo', status: 'pending' },
  { id: 2, name: 'María López', phone: '555-5678', observation: 'No contestó llamada', status: 'no-response' },
  { id: 3, name: 'Carlos Ruiz', phone: '555-9012', observation: 'Agendó cita', status: 'pending' },
    { id: 4, name: 'Juan Pérez', phone: '555-1234', observation: 'Interesado en demo', status: 'pending' },
  { id: 5, name: 'María López', phone: '555-5678', observation: 'No contestó llamada', status: 'no-response' },
  { id: 6, name: 'Carlos Ruiz', phone: '555-9012', observation: 'Agendó cita', status: 'pending' },
    { id: 7, name: 'Juan Pérez', phone: '555-1234', observation: 'Interesado en demo', status: 'pending' },
  { id: 8, name: 'María López', phone: '555-5678', observation: 'No contestó llamada', status: 'no-response' },
  { id: 9, name: 'Carlos Ruiz', phone: '555-9012', observation: 'Agendó cita', status: 'pending' },
];
