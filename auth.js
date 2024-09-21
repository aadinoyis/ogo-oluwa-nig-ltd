import {signIn, signUp} from './supabase.js';

// Sign In
const user_email = document.querySelector('#user_email')
const user_pass = document.querySelector('#user_pass')
const sign_in = document.querySelector('#sign_in')

sign_in.onclick = async () => {
  console.log(user_email.value, user_pass.value)
  await signIn(user_email, user_pass)
}

// Create Account
const first_name = document.querySelector('#first_name')
const last_name = document.querySelector('#last_name')
const reg_email = document.querySelector('#reg_email')
const reg_pass = document.querySelector('#reg_pass')
const confirm_pass = document.querySelector('#confirm_pass')
const create_account = document.querySelector('#create_account')

create_account.onclick = async () => {
  await signUp(reg_email.value, reg_pass.value)
}