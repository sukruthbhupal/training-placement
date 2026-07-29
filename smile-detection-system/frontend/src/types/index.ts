export interface User {
  id: number
  name: string
  email: string
}

export interface DetectionItem {
  id: number
  filename: string
  confidence: number
  smile: boolean
  created_at: string
}

export interface DashboardData {
  total_uploads: number
  total_smiles: number
  average_confidence: number
  today_detections: number
  recent_activity: Array<{ filename: string; smile: boolean; confidence: number; created_at: string }>
}
