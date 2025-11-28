// import { describe, it, expect, vi } from 'vitest'
// import * as supabaseServer from '../lib/supabase/server'

// // Mock Supabase to avoid real DB calls
// vi.mock('../lib/supabase/server', () => {
//   return {
//     createServerClient: () => ({
//       from: () => ({
//         select: () => ({
//           data: [{ id: 1, name: 'Test Event' }],
//           error: null
//         }),
//       }),
//     }),
//   }
// })

// describe('Supabase Server Client', () => {
//   it('returns mocked data successfully', async () => {
//     const client = supabaseServer.createServerClient()
//     const result = await client.from('events').select()

//     expect(result.data).toBeDefined()
//     expect(result.data[0].name).toBe('Test Event')
//   })
// })
