const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export async function testSupabaseConnection() {
  try {
    const response = await fetch(`${url}/auth/v1/settings`, {
      method: 'GET',
      headers: {
        apikey: key
      }
    })

    console.log('Supabase HTTP status:', response.status)

    if (response.ok) {
      console.log('SUCCESS: Supabase is responding!')
    } else {
      console.log('Supabase response:', await response.text())
    }
  } catch (error) {
    console.error('Connection failed:', error)
  }
}
