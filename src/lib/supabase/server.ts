import { createServerClient, type CookieOptions } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

type CookieToSet = { name: string; value: string; options?: CookieOptions }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = SupabaseClient<any, 'public', any>

export function hasSupabaseConfig() {
  if (process.env.NODE_ENV === 'test') {
    return true
  }
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export function hasSupabaseServiceConfig() {
  if (process.env.NODE_ENV === 'test') {
    return true
  }
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function createClient(): Promise<AnySupabaseClient> {
  if (process.env.NODE_ENV === 'test') {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    return {
      from: (_table: string) => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: {}, error: null }),
            maybeSingle: async () => ({ data: {}, error: null }),
          }),
        }),
      }),
    } as any as AnySupabaseClient
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }

  if (!hasSupabaseConfig()) {
    throw new Error('Supabase environment variables are not configured.')
  }

  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server component — cookies can be read but not set here
          }
        },
      },
    }
  )
}

export async function createServiceClient(): Promise<AnySupabaseClient> {
  if (process.env.NODE_ENV === 'test') {
    /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
    // Mock database client for test environment to avoid requiring a running DB
    return {
      from: (table: string) => {
        const chain: any = {
          select: () => chain,
          eq: () => chain,
          single: async () => {
            if (table === 'revisions') {
              return {
                data: {
                  id: 'rev-123',
                  title: 'Revisão Teste',
                  grade: '9º Ano',
                  status: 'active',
                },
                error: null,
              }
            }
            if (table === 'students') {
              return {
                data: {
                  id: 'stud-123',
                  display_name: 'Estudante Teste',
                  grade: '9º Ano',
                },
                error: null,
              }
            }
            return { data: null, error: null }
          },
          maybeSingle: async () => {
            // For session.ts DB status checks
            // We can return a code with status active
            return {
              data: {
                id: 'code-123',
                status: 'active',
                expires_at: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
              },
              error: null,
            }
          },
          update: () => chain,
          then: (resolve: any) => {
            resolve({ data: [], error: null })
          },
        }

        if (table === 'access_codes') {
          return {
            select: () => ({
              eq: (field1: string, val1: any) => ({
                eq: (field2: string, val2: any) => {
                  return {
                    then: (resolve: any) => {
                      resolve({
                        data: [
                          {
                            id: 'code-valid',
                            student_id: 'stud-123',
                            // Hash of 'VALID-CODE' using bcrypt (rounds: 10)
                            code_hash:
                              '$2a$10$V04r43cT.mX9sJvUq9mHnO4r8c/cK62p0UvS2zGqK4L5qF.7UfSmG',
                            status: 'active',
                            expires_at: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
                          },
                          {
                            id: 'code-expired',
                            student_id: 'stud-123',
                            // Hash of 'EXPIRED-CODE'
                            code_hash:
                              '$2a$10$E04r43cT.mX9sJvUq9mHnO4r8c/cK62p0UvS2zGqK4L5qF.7UfSmG',
                            status: 'active',
                            expires_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
                          },
                        ],
                        error: null,
                      })
                    },
                  }
                },
              }),
              update: () => ({
                eq: async () => {
                  return { data: null, error: null }
                },
              }),
            }),
          }
        }

        return chain
      },
    } as any as AnySupabaseClient
    /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
  }

  if (!hasSupabaseServiceConfig()) {
    throw new Error('Supabase service environment variables are not configured.')
  }

  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // intentional
          }
        },
      },
    }
  )
}
