import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wfhxsujcolacbtsgnywt.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmaHhzdWpjb2xhY2J0c2dueXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxOTEyMTMsImV4cCI6MjA5OTc2NzIxM30.iMC2pL5EeBIzr8cglJgt-KlWdkt6VycbZ3OxE1v0sP0'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
