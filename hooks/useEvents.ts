import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { Event } from '@/types';

export function useEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const formattedEvents: Event[] = data.map((event: any) => ({
        id: event.id,
        name: event.name,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        type: event.type,
        theme: event.theme,
        coverImage: event.cover_image || undefined,
        budget: event.budget,
        status: event.status,
        createdAt: event.created_at,
        updatedAt: event.updated_at,
      }));

      setEvents(formattedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const createEvent = async (
    eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from('events')
        .insert({
          name: eventData.name,
          description: eventData.description,
          date: eventData.date,
          time: eventData.time,
          location: eventData.location,
          type: eventData.type,
          theme: eventData.theme,
          cover_image: eventData.coverImage || null,
          budget: eventData.budget,
          status: eventData.status,
          user_id: user.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const newEvent: Event = {
        id: data.id,
        name: data.name,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.location,
        type: data.type,
        theme: data.theme,
        coverImage: data.cover_image || undefined,
        budget: data.budget,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setEvents((prev) => [newEvent, ...prev]);
      return newEvent;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create event';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined)
        updateData.description = updates.description;
      if (updates.date !== undefined) updateData.date = updates.date;
      if (updates.time !== undefined) updateData.time = updates.time;
      if (updates.location !== undefined)
        updateData.location = updates.location;
      if (updates.type !== undefined) updateData.type = updates.type;
      if (updates.theme !== undefined) updateData.theme = updates.theme;
      if (updates.coverImage !== undefined)
        updateData.cover_image = updates.coverImage;
      if (updates.budget !== undefined) updateData.budget = updates.budget;
      if (updates.status !== undefined) updateData.status = updates.status;

      const { data, error: updateError } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      const updatedEvent: Event = {
        id: data.id,
        name: data.name,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.location,
        type: data.type,
        theme: data.theme,
        coverImage: data.cover_image || undefined,
        budget: data.budget,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setEvents((prev) =>
        prev.map((event) => (event.id === id ? updatedEvent : event))
      );

      return updatedEvent;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update event';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete event';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
  };
}
