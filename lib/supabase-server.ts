import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Server-side client with service role key for admin operations
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey)

// Check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

// Database types
export interface Message {
  id: string
  created_at: string
  user_message: string
  bot_response: string
}

export interface ParkingSpace {
  id: string
  title: string
  description: string
  address: string
  price_per_hour: number
  price_per_day: number
  price_per_month: number
  total_spaces: number
  booked_spaces: number
  latitude: number
  longitude: number
  amenities: string[]
  images: string[]
  created_at: string
}

export interface Booking {
  id: string
  user_id: string
  space_id: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  vehicle_registration?: string
  vehicle_type: string
  start_time: string
  end_time: string
  total_price: number
  status: string
  commerce_layer_order_id?: string
  commerce_layer_customer_id?: string
  commerce_layer_market_id?: string
  stripe_payment_intent_id?: string
  payment_status?: string
  confirmed_at?: string
  sku?: string
  duration_type?: string
  created_at: string
}
