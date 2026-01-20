
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        from: () => ({
            select: () => ({
                eq: () => ({
                    single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
                    order: () => Promise.resolve({ data: [], error: new Error('Supabase not configured') }),
                }),
                order: () => Promise.resolve({ data: [], error: new Error('Supabase not configured') }),
            }),
        }),
        storage: {
            from: () => ({
                product: () => ({
                    upload: () => Promise.resolve({ error: new Error('Supabase not configured') }),
                    getPublicUrl: () => ({ data: { publicUrl: '' } }),
                }),
                getPublicUrl: () => ({ data: { publicUrl: '' } }),
            }),
        },
    } as any
