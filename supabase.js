import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
// const { createClient } = supabase

//const database_pass = "4nYwqkyZAziJX2jT";
const supabaseUrl = "https://ujlsjsqhsizvvxhtmxff.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqbHNqc3Foc2l6dnZ4aHRteGZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU1MDcyMTUsImV4cCI6MjA0MTA4MzIxNX0.pjW1X20P3Ag1oMXWKpUTWFQCQTHXjnxU4npBq3qpjnk"
const supabase = createClient(supabaseUrl, supabaseKey)

export const figurize = (figure) => {
  return parseFloat(figure.replace(/,/g, ""))
}

const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email: 'example@email.com',
    password: 'example-password',
  })
}
const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
  email: 'example@email.com',
  password: 'example-password',
})

}
const signOut = async () => {
  const { error } = await supabase.auth.signOut()
}
const resetPass = async (password) => {
  const { data, error } = await supabase.auth.updateUser({
    password: new_password
  })
}
const recoverPass = async (email, password) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://example.com/update-password',
  })
}

const userChange = () => {
  supabase.auth.onAuthStateChange((event, session) => {
    setTimeout(async () => {
      // await on other Supabase function here
      // this runs right after the callback has finished
    }, 0)
  })
}


// SELECT
export const selectDb = async (prev, next) => {
  if (next !== null) {
    let { data: sales_transaction, error } = await supabase
      .from('sales_transaction')
      .select("*")
      .gte('date', prev)
      .lte('date', next)
      
      if (sales_transaction) {
        // console.log(sales_transaction)
        return sales_transaction
      }
      if (error) console.log(error)
      // .gt('column', 'Greater than')
      // .lt('column', 'Less than')

  }
  let { data: sales_transaction, error } = await supabase
    .from('sales_transaction')
    .select("*")
    .eq('date', prev)
    .single()
    
    if (sales_transaction) {
      // console.log(sales_transaction)
      return sales_transaction
    }
    if (error) {
      console.log(error)
      let data = {
        price: '0.00',
        closing: '0.00',
        opening: '0.00',
        litres: '0.00',
        amount: '0.00',
        expenses: '0.00',
        pos: '0.00',
        balance: '0.00',
        cash_at_hand: '0.00',
        cash_to_bank: '0.00',
        shortage: '0.00',
      }
      
      return data
    }
}

// INSERT
export const insertDb = async ({
  date,
  price,
  closing,
  opening,
  litres,
  amount,
  expenses,
  pos,
  balance,
  cash_at_hand,
  cash_to_bank,
  shortage
  }) => {
  try {
    const { data, error } = await supabase
      .from('sales_transaction')
      .upsert([
        {
          date: date,
          price: figurize(price),
          opening: figurize(opening),
          closing: figurize(closing),
          litres: figurize(litres),
          amount: figurize(amount),
          expenses: figurize(expenses),
          pos: figurize(pos),
          balance: figurize(balance),
          cash_at_hand: figurize(cash_at_hand),
          cash_to_bank: figurize(cash_to_bank),
          shortage: figurize(shortage)
           },
        ])
      .select()
      
      if (data) {
        alert('DATA UPDATED')
        return 'Done'
      }
      if (error) {
        alert('PLEASE, INSERT ALL DATA')
        return 'Failed'
      }
  } catch (e) {
    console.log(e)
  }
  
}
  
// UPDATE
const updateDb = async () => {
  const { data, error } = await supabase
    .from('sales_transaction')
    .update({ other_column: 'otherValue' })
    .eq('some_column', 'someValue')
    .select()
}
  
//DELETE
const deleteDb = async () => {
  const { error } = await supabase
    .from('sales_transaction')
    .delete()
    .eq('some_column', 'someValue')
}

// SUBSCRIBE TO ALL CHANGES
const channelsSub = () => {
  const all_channels = supabase.channel('custom-all-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'sales_transaction' },
      (payload) => {
        console.log('Change received!', payload)
      }
    )
    .subscribe()
  
  // SUBSCRIBE TO INSERT
  const ins_channels = supabase.channel('custom-insert-channel')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'sales_transaction' },
      (payload) => {
        console.log('Change received!', payload)
      }
    )
    .subscribe()
  
  // SUBSCRIBE TO UPDATE 
  const upd_channels = supabase.channel('custom-update-channel')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'sales_transaction' },
      (payload) => {
        console.log('Change received!', payload)
      }
    )
    .subscribe()
  
  // SUBSCRIBE TO DELETE
  const del_channels = supabase.channel('custom-delete-channel')
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'sales_transaction' },
      (payload) => {
        console.log('Change received!', payload)
      }
    )
    .subscribe()
  
  // SUBSCRIBE TO SPECIFIC ROW CHANGES
  const spf_channels = supabase.channel('custom-filter-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'sales_transaction', filter: 'some_column=eq.some_value' },
      (payload) => {
        console.log('Change received!', payload)
      }
    )
    .subscribe()
}
const all_channels = supabase.channel('custom-all-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'sales_transaction' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
  