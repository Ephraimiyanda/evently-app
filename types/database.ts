export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          name: string;
          description: string;
          date: string;
          time: string;
          location: string;
          type: 'physical' | 'virtual' | 'hybrid';
          theme: string;
          cover_image: string | null;
          budget: number;
          status: 'planning' | 'active' | 'completed' | 'cancelled';
          created_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          date: string;
          time: string;
          location: string;
          type: 'physical' | 'virtual' | 'hybrid';
          theme: string;
          cover_image?: string | null;
          budget?: number;
          status?: 'planning' | 'active' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          date?: string;
          time?: string;
          location?: string;
          type?: 'physical' | 'virtual' | 'hybrid';
          theme?: string;
          cover_image?: string | null;
          budget?: number;
          status?: 'planning' | 'active' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
          user_id?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          event_id: string;
          title: string;
          description: string;
          assigned_to: string;
          due_date: string;
          status: 'todo' | 'in-progress' | 'completed';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          category: string;
          created_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          title: string;
          description: string;
          assigned_to: string;
          due_date: string;
          status?: 'todo' | 'in-progress' | 'completed';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          category: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          title?: string;
          description?: string;
          assigned_to?: string;
          due_date?: string;
          status?: 'todo' | 'in-progress' | 'completed';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          category?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          event_id: string;
          title: string;
          amount: number;
          category: string;
          vendor: string | null;
          date: string;
          status: 'pending' | 'paid' | 'overdue';
          receipt: string | null;
          notes: string | null;
          created_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          title: string;
          amount?: number;
          category: string;
          vendor?: string | null;
          date: string;
          status?: 'pending' | 'paid' | 'overdue';
          receipt?: string | null;
          notes?: string | null;
          created_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          title?: string;
          amount?: number;
          category?: string;
          vendor?: string | null;
          date?: string;
          status?: 'pending' | 'paid' | 'overdue';
          receipt?: string | null;
          notes?: string | null;
          created_at?: string;
          user_id?: string;
        };
      };
      guests: {
        Row: {
          id: string;
          event_id: string;
          name: string;
          email: string;
          phone: string | null;
          category: 'general' | 'vip' | 'speaker' | 'volunteer' | 'staff';
          rsvp_status: 'pending' | 'accepted' | 'declined' | 'maybe';
          invited_at: string;
          responded_at: string | null;
          notes: string | null;
          user_id: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          name: string;
          email: string;
          phone?: string | null;
          category?: 'general' | 'vip' | 'speaker' | 'volunteer' | 'staff';
          rsvp_status?: 'pending' | 'accepted' | 'declined' | 'maybe';
          invited_at?: string;
          responded_at?: string | null;
          notes?: string | null;
          user_id: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          category?: 'general' | 'vip' | 'speaker' | 'volunteer' | 'staff';
          rsvp_status?: 'pending' | 'accepted' | 'declined' | 'maybe';
          invited_at?: string;
          responded_at?: string | null;
          notes?: string | null;
          user_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
