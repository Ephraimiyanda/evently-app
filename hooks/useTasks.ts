import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { Task } from '@/types';

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const formattedTasks: Task[] = data.map((task: any) => ({
        id: task.id,
        eventId: task.event_id,
        title: task.title,
        description: task.description,
        assignedTo: task.assigned_to,
        dueDate: task.due_date,
        status: task.status,
        priority: task.priority,
        category: task.category,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
      }));

      setTasks(formattedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const createTask = async (
    taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from('tasks')
        .insert({
          event_id: taskData.eventId,
          title: taskData.title,
          description: taskData.description,
          assigned_to: taskData.assignedTo,
          due_date: taskData.dueDate,
          status: taskData.status,
          priority: taskData.priority,
          category: taskData.category,
          user_id: user.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const newTask: Task = {
        id: data.id,
        eventId: data.event_id,
        title: data.title,
        description: data.description,
        assignedTo: data.assigned_to,
        dueDate: data.due_date,
        status: data.status,
        priority: data.priority,
        category: data.category,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined)
        updateData.description = updates.description;
      if (updates.assignedTo !== undefined)
        updateData.assigned_to = updates.assignedTo;
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.priority !== undefined)
        updateData.priority = updates.priority;
      if (updates.category !== undefined)
        updateData.category = updates.category;

      const { data, error: updateError } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      const updatedTask: Task = {
        id: data.id,
        eventId: data.event_id,
        title: data.title,
        description: data.description,
        assignedTo: data.assigned_to,
        dueDate: data.due_date,
        status: data.status,
        priority: data.priority,
        category: data.category,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );

      return updatedTask;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getTasksByEvent = (eventId: string) => {
    return tasks.filter((task) => task.eventId === eventId);
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    getTasksByEvent,
    refetch: fetchTasks,
  };
}
