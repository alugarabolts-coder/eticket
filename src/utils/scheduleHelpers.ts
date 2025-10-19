import { supabase } from '../lib/supabase';

export interface ClassInfo {
  class: string;
  price: number;
  available_seats: number;
}

export interface ScheduleUpdate {
  ship_id?: string;
  departure_port_id?: string;
  arrival_port_id?: string;
  departure_time?: string;
  arrival_time?: string;
  duration_minutes?: number;
  classes?: ClassInfo[];
  status?: string;
}

export async function updateScheduleSafely(
  scheduleId: string,
  updates: ScheduleUpdate
) {
  try {
    if (updates.classes) {
      for (const classInfo of updates.classes) {
        if (!classInfo.class || typeof classInfo.price !== 'number' || typeof classInfo.available_seats !== 'number') {
          throw new Error('Invalid class data format');
        }
      }
    }

    const { data, error } = await supabase
      .from('schedules')
      .update(updates)
      .eq('id', scheduleId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error updating schedule:', error);
    return { data: null, error };
  }
}

export async function createSchedule(scheduleData: {
  ship_id: string;
  departure_port_id: string;
  arrival_port_id: string;
  departure_time: string;
  arrival_time: string;
  duration_minutes: number;
  classes: ClassInfo[];
  status?: string;
}) {
  try {
    if (!scheduleData.classes || scheduleData.classes.length === 0) {
      scheduleData.classes = [
        { class: 'Economy', price: 350000, available_seats: 600 },
        { class: 'Business', price: 550000, available_seats: 200 },
        { class: 'VIP', price: 850000, available_seats: 50 }
      ];
    }

    for (const classInfo of scheduleData.classes) {
      if (!classInfo.class || typeof classInfo.price !== 'number' || typeof classInfo.available_seats !== 'number') {
        throw new Error('Invalid class data format');
      }
    }

    const { data, error } = await supabase
      .from('schedules')
      .insert({
        ...scheduleData,
        status: scheduleData.status || 'scheduled'
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error creating schedule:', error);
    return { data: null, error };
  }
}

export function validateClassesData(classes: any): ClassInfo[] | null {
  if (!Array.isArray(classes)) {
    console.error('Classes must be an array');
    return null;
  }

  const validClasses: ClassInfo[] = [];

  for (const item of classes) {
    if (
      typeof item === 'object' &&
      item !== null &&
      typeof item.class === 'string' &&
      typeof item.price === 'number' &&
      typeof item.available_seats === 'number'
    ) {
      validClasses.push({
        class: item.class,
        price: item.price,
        available_seats: item.available_seats
      });
    } else {
      console.error('Invalid class item:', item);
      return null;
    }
  }

  return validClasses;
}

export const DEFAULT_CLASSES: ClassInfo[] = [
  { class: 'Economy', price: 350000, available_seats: 600 },
  { class: 'Business', price: 550000, available_seats: 200 },
  { class: 'VIP', price: 850000, available_seats: 50 }
];
