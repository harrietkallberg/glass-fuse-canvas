
export interface CurveData {
  id: string;
  title: string;
  description: string;
  is_private: boolean;
  glass_type?: string;
  oven_type?: string;
  thickness?: string;
  project_type?: string;
  created_at: string;
  updated_at: string;
}

export interface CurveVersion {
  id: string;
  curve_id: string;
  version_number: number;
  name: string;
  is_current: boolean;
  selected_glass?: string;
  room_temp?: number;
  glass_layers?: string;
  glass_radius?: string;
  firing_type?: string;
  top_temp_minutes?: string;
  oven_type?: string;
  total_time?: number;
  notes?: string;
  materials?: string;
  tags?: string;
  created_at: string;
}
