import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { Expense } from '@/types';

export function useBudget() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const formattedExpenses: Expense[] = data.map((expense: any) => ({
        id: expense.id,
        eventId: expense.eventId,
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        vendor: expense.vendor || undefined,
        date: expense.date,
        status: expense.status,
        receipt: expense.receipt || undefined,
        notes: expense.notes || undefined,
      }));

      setExpenses(formattedExpenses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  const createExpense = async (expenseData: Omit<Expense, 'id'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from('expenses')
        .insert({
          event_id: expenseData.eventId,
          title: expenseData.title,
          amount: expenseData.amount,
          category: expenseData.category,
          vendor: expenseData.vendor || null,
          date: expenseData.date,
          status: expenseData.status,
          receipt: expenseData.receipt || null,
          notes: expenseData.notes || null,
          user_id: user.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const newExpense: Expense = {
        id: data.id,
        eventId: data.event_id,
        title: data.title,
        amount: data.amount,
        category: data.category,
        vendor: data.vendor || undefined,
        date: data.date,
        status: data.status,
        receipt: data.receipt || undefined,
        notes: data.notes || undefined,
      };

      setExpenses((prev) => [newExpense, ...prev]);
      return newExpense;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create expense';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.amount !== undefined) updateData.amount = updates.amount;
      if (updates.category !== undefined)
        updateData.category = updates.category;
      if (updates.vendor !== undefined) updateData.vendor = updates.vendor;
      if (updates.date !== undefined) updateData.date = updates.date;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.receipt !== undefined) updateData.receipt = updates.receipt;
      if (updates.notes !== undefined) updateData.notes = updates.notes;

      const { data, error: updateError } = await supabase
        .from('expenses')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      const updatedExpense: Expense = {
        id: data.id,
        eventId: data.event_id,
        title: data.title,
        amount: data.amount,
        category: data.category,
        vendor: data.vendor || undefined,
        date: data.date,
        status: data.status,
        receipt: data.receipt || undefined,
        notes: data.notes || undefined,
      };

      setExpenses((prev) =>
        prev.map((expense) => (expense.id === id ? updatedExpense : expense))
      );

      return updatedExpense;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update expense';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete expense';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getExpensesByEvent = (eventId: string) => {
    return expenses.filter((expense) => expense.eventId === eventId);
  };

  const getTotalSpent = (eventId: string) => {
    return expenses
      .filter((expense) => expense.eventId === eventId)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const getSpentByCategory = (eventId: string) => {
    const eventExpenses = expenses.filter(
      (expense) => expense.eventId === eventId
    );
    const categoryTotals: Record<string, number> = {};

    eventExpenses.forEach((expense) => {
      categoryTotals[expense.category] =
        (categoryTotals[expense.category] || 0) + expense.amount;
    });

    return categoryTotals;
  };

  return {
    expenses,
    loading,
    error,
    createExpense,
    updateExpense,
    deleteExpense,
    getExpensesByEvent,
    getTotalSpent,
    getSpentByCategory,
    refetch: fetchExpenses,
  };
}
