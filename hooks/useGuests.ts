import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { Guest } from '@/types';

export function useGuests() {
  const { user } = useAuth();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGuests = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('guests')
        .select('*')
        .eq('user_id', user.id)
        .order('invited_at', { ascending: false });

      if (fetchError) throw fetchError;

      const formattedGuests: Guest[] = data.map((guest: any) => ({
        id: guest.id,
        eventId: guest.event_id,
        name: guest.name,
        email: guest.email,
        phone: guest.phone || undefined,
        category: guest.category,
        rsvpStatus: guest.rsvp_status,
        invitedAt: guest.invited_at,
        respondedAt: guest.responded_at || undefined,
        notes: guest.notes || undefined,
      }));

      setGuests(formattedGuests);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch guests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, [user]);

  const createGuest = async (guestData: Omit<Guest, 'id' | 'invitedAt'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from('guests')
        .insert({
          event_id: guestData.eventId,
          name: guestData.name,
          email: guestData.email,
          phone: guestData.phone || null,
          category: guestData.category,
          rsvp_status: guestData.rsvpStatus,
          responded_at: guestData.respondedAt || null,
          notes: guestData.notes || null,
          user_id: user.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const newGuest: Guest = {
        id: data.id,
        eventId: data.event_id,
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        category: data.category,
        rsvpStatus: data.rsvp_status,
        invitedAt: data.invited_at,
        respondedAt: data.responded_at || undefined,
        notes: data.notes || undefined,
      };

      setGuests((prev) => [newGuest, ...prev]);
      return newGuest;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create guest';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateGuest = async (id: string, updates: Partial<Guest>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.category !== undefined)
        updateData.category = updates.category;
      if (updates.rsvpStatus !== undefined)
        updateData.rsvp_status = updates.rsvpStatus;
      if (updates.respondedAt !== undefined)
        updateData.responded_at = updates.respondedAt;
      if (updates.notes !== undefined) updateData.notes = updates.notes;

      const { data, error: updateError } = await supabase
        .from('guests')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      const updatedGuest: Guest = {
        id: data.id,
        eventId: data.event_id,
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        category: data.category,
        rsvpStatus: data.rsvp_status,
        invitedAt: data.invited_at,
        respondedAt: data.responded_at || undefined,
        notes: data.notes || undefined,
      };

      setGuests((prev) =>
        prev.map((guest) => (guest.id === id ? updatedGuest : guest))
      );

      return updatedGuest;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update guest';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteGuest = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('guests')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      setGuests((prev) => prev.filter((guest) => guest.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete guest';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getGuestsByEvent = (eventId: string) => {
    return guests.filter((guest) => guest.eventId === eventId);
  };

  const sendInvitation = async (guestId: string, method: 'email' | 'sms') => {
    try {
      setLoading(true);
      // Simulate sending invitation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`Invitation sent via ${method} to guest ${guestId}`);
    } catch (err) {
      setError('Failed to send invitation');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    guests,
    loading,
    error,
    createGuest,
    updateGuest,
    deleteGuest,
    getGuestsByEvent,
    sendInvitation,
    refetch: fetchGuests,
  };
}
