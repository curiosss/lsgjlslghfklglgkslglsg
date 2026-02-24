export interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
  label: string;
  is_active: boolean;
}

export interface CreateTimeSlotRequest {
  start_time: string;
  end_time: string;
  label: string;
  is_active?: boolean;
}

export interface UpdateTimeSlotRequest {
  start_time?: string;
  end_time?: string;
  label?: string;
  is_active?: boolean;
}
