export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'physical' | 'virtual' | 'hybrid';
  theme: string;
  coverImage?: string;
  budget: number;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  category: 'general' | 'vip' | 'speaker' | 'volunteer' | 'staff';
  rsvpStatus: 'pending' | 'accepted' | 'declined' | 'maybe';
  invitedAt: string;
  respondedAt?: string;
  notes?: string;
  eventId: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: string;
  updatedAt: string;
  eventId: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  vendor?: string;
  date: string;
  status: 'pending' | 'paid' | 'overdue';
  receipt?: string;
  notes?: string;
  eventId: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  email: string;
  phone: string;
  website?: string;
  rating: number;
  notes?: string;
  services: string[];
  priceRange: string;
}

export interface AgendaItem {
  id: string;
  eventId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location?: string;
  speaker?: string;
  speakerBio?: string;
  type: 'session' | 'break' | 'networking' | 'meal' | 'activity';
}

export interface Photo {
  id: string;
  eventId: string;
  uri: string;
  caption?: string;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
}

export interface Ticket {
  id: string;
  eventId: string;
  type: string;
  price: number;
  quantity: number;
  sold: number;
  description: string;
  benefits: string[];
}

export interface Registration {
  id: string;
  eventId: string;
  ticketId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  qrCode: string;
  checkedIn: boolean;
  checkedInAt?: string;
  purchasedAt: string;
}
