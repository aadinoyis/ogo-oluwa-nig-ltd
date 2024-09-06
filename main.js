
import {insertDb, selectDb} from './supabase.js';

const print_page = document.querySelector('#print_page')
print_page.onclick = e => {
  window.print()
}

const formatDigits = (digits) => {
  const value = digits !== null ? digits.replace(/,/g, '') : '';
  const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return formattedValue;
}

const fromPeriod = document.querySelector('#fromPeriod')
const toPeriod = document.querySelector('#toPeriod')
const fromPeriodDisp = document.querySelector('#fromPeriodDisp')
const toPeriodDisp = document.querySelector('#toPeriodDisp')

const _nextPeriod = document.querySelector('#_nextPeriod')
const toggle_nextPeriod = document.querySelector('#toggle_nextPeriod')

let is_nextPeriod = false

toggle_nextPeriod.onclick = function (e) {
  if (is_nextPeriod) {
    toPeriod.value = null;
    nextData = null
    toPeriodDisp.innerHTML = 'DD/MM/YY';
    _nextPeriod.style.display = 'none'
    this.innerHTML = '&plus;'
    logDisplay()
    return is_nextPeriod = false
  }
  
  toPeriod.value = null;
  nextData = null
  toPeriodDisp.innerHTML = 'DD/MM/YY';
  _nextPeriod.style.display = 'block'
  this.innerHTML = '&minus;'
  logDisplay()
  return is_nextPeriod = true
}

let dateFormat = {
  weekday: 'short', 
  day: '2-digit', 
  month: 'long', 
  year: 'numeric'
}


fromPeriod.value = null;
fromPeriodDisp.innerHTML = 'DD/MM/YY'

toPeriod.value = null;
toPeriodDisp.innerHTML = 'DD/MM/YY'


let prevData = null
let nextData = null

// const formattedNumber = number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });


const displayData = (data) => {
  // console.log(data)
  // date: document.querySelector(''),
  document.querySelector('#price_yy').innerHTML = `&#8358; ${formatDigits(data.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}`
  document.querySelector('#closing_yy').innerHTML = formatDigits(data.closing.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
  document.querySelector('#opening_yy').innerHTML = formatDigits(data.opening.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
  document.querySelector('#litres_yy').innerHTML = formatDigits(data.litres.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
  document.querySelector('#amount_yy').innerHTML = `&#8358; ${formatDigits(data.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}`
  document.querySelector('#cash_at_hand_yy').innerHTML = `&#8358; ${formatDigits(data.cash_at_hand.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}`
  document.querySelector('#cash_to_bank_yy').innerHTML = `&#8358; ${formatDigits(data.cash_to_bank.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}`
  document.querySelector('#expenses_yy').innerHTML = `&#8358; ${formatDigits(data.expenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}`
  document.querySelector('#pos_yy').innerHTML = `&#8358; ${formatDigits(data.pos.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}`
  document.querySelector('#balance_yy').innerHTML = `&#8358; ${formatDigits(data.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}`
  document.querySelector('#shortage_yy').innerHTML = `&#8358; ${formatDigits(data.shortage.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))} &uarr;&darr;`
}

const logDisplay = () => {
  if (prevData !== null || nextData !== null) {
    if(prevData !== null && nextData === null) {
      displayData(prevData)
    }
    if(prevData !== null && nextData !== null) {
      let result = {
        price: '--',
        closing: '--',
        opening: '--',
        litres: 0.00,
        amount: 0.00,
        expenses: 0.00,
        pos: 0.00,
        balance: 0.00,
        cash_at_hand: 0.00,
        cash_to_bank: 0.00,
        shortage: 0.00,
      }
      for (let item of nextData) {
        result.litres += item.litres
        result.amount += item.amount
        result.expenses += item.expenses
        result.pos += item.pos
        result.balance += item.balance
        result.cash_at_hand += item.cash_at_hand
        result.cash_to_bank += item.cash_to_bank
        result.shortage += item.shortage
      }
      
      displayData(result)
    }
    
  } 
  if (prevData === null && nextData === null) {
  
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
    
    displayData(data)
  }
}
logDisplay()

fromPeriod.addEventListener('change', async e => {
  fromPeriodDisp.innerHTML = new Date(fromPeriod.value).toLocaleDateString('en-US', dateFormat)
  const data = await selectDb(fromPeriod.value, null)
  if (data) {
    prevData = data
    logDisplay()
  }
})

toPeriod.addEventListener('change', async e => {
  toPeriodDisp.innerHTML = new Date(toPeriod.value).toLocaleDateString('en-US', dateFormat)
  const data = await selectDb(fromPeriod.value, toPeriod.value)
  if (data) {
    nextData = data
    logDisplay()
  }
})



const create = document.querySelector('#create')
const createNew = document.querySelector('#createNew')
const header = document.querySelector('header')
const main = document.querySelector('main')

let opened = false;
create.addEventListener('click', e => {
  if (opened) {
    // slide down till it disapears
    createNew.style.height = '0'
    
    // change thw create text to '+'
    create.innerHTML = "&plus;"
    
    // bold background elements
    header.style.opacity = '1'
    main.style.opacity = '1'
    
    // set opened to false
    return opened = false
    
  } else {
    // slide up till 80% of screen height
    createNew.style.height = '85vh'
    
    // change thw create text to 'x'
    create.innerHTML = "&times;"
    
    // fade background elements
    header.style.opacity = '.3'
    main.style.opacity = '.3'
    
    // set opened to true
    return opened = true
    
  }
})







const calcSoldLitre = (closing, opening) => {
  let closingLitre = parseFloat(closing.replace(/,/g, ''));
  let openingLitre = parseFloat(opening.replace(/,/g, ''));
  let difference = closingLitre - openingLitre
  
  saleRecord.soldLitre.value = isNaN(difference) ? '--' : difference.toFixed(2)
  return saleRecord.soldLitre.value = formatDigits(saleRecord.soldLitre.value);
}

const calcSoldAmount = (litre, price) => {
  let soldLitre = parseFloat(litre.replace(/,/g, ''));
  let sellingPrice = parseFloat(price.replace(/,/g, ''));
  let product = soldLitre * sellingPrice 
  
  saleRecord.soldAmount.value = isNaN(product) ? '--' : product.toFixed(2)
  return saleRecord.soldAmount.value = formatDigits(saleRecord.soldAmount.value);
}

const calcBalance = (amount, expenses, pos) => {
  let saleAmount = parseFloat(amount.replace(/,/g, ''));
  let saleExpenses = parseFloat(expenses.replace(/,/g, ''));
  let salePos = parseFloat(pos.replace(/,/g, ''));
  
  let difference = saleAmount - saleExpenses - salePos 
  
  saleRecord.balance.value = isNaN(difference) ? '--' : difference.toFixed(2)
  return saleRecord.balance.value = formatDigits(saleRecord.balance.value);
}

const calcShortage = (balance, bankcash, handcash) => {
  let saleBalance = parseFloat(balance.replace(/,/g, ''));
  let bankCash = parseFloat(bankcash.replace(/,/g, ''));
  let handCash = parseFloat(handcash.replace(/,/g, ''));
  
  let difference = saleBalance - bankCash - handCash 
  
  saleRecord.shortage.value = isNaN(difference) ? '--' : difference.toFixed(2)
  return saleRecord.shortage.value = formatDigits(saleRecord.shortage.value);
}



const saleRecord = {
  sellingPeriod: document.querySelector('input[name=sellingPeriod]'),
  sellingPrice: document.querySelector('input[name=sellingPrice]'),
  closingLitre: document.querySelector('input[name=closingLitre]'),
  openingLitre: document.querySelector('input[name=openingLitre]'),
  soldLitre: document.querySelector('input[name=soldLitre]'),
  soldAmount: document.querySelector('input[name=soldAmount]'),
  handCash: document.querySelector('input[name=handCash]'),
  bankCash: document.querySelector('input[name=bankCash]'),
  expenses: document.querySelector('input[name=expenses]'),
  pos: document.querySelector('input[name=pos]'),
  balance: document.querySelector('input[name=balance]'),
  shortage: document.querySelector('input[name=shortage]'),
  saleValue: function (){
    return ({
      date: this.sellingPeriod.value,
      price: this.sellingPrice.value,
      closing: this.closingLitre.value,
      opening: this.openingLitre.value,
      litres: this.soldLitre.value,
      amount: this.soldAmount.value,
      cash_at_hand: this.handCash.value,
      cash_to_bank: this.bankCash.value,
      expenses: this.expenses.value,
      pos: this.pos.value,
      balance: this.balance.value,
      shortage: this.shortage.value,
    })
  }
}


const sellingPeriod = saleRecord.sellingPeriod.value = new Date().toISOString().split('T')[0]
const sellingPeriodDisp = document.querySelector('#sellingPeriodDisp')
sellingPeriodDisp.innerHTML = new Date(sellingPeriod).toLocaleDateString('en-US', dateFormat)

const submit = document.querySelector('#submit')

saleRecord.sellingPeriod.onchange = e => {
  sellingPeriodDisp.innerHTML = new Date(saleRecord.sellingPeriod.value).toLocaleDateString('en-US', dateFormat)
}

saleRecord.sellingPrice.onkeyup = e => {
  saleRecord.sellingPrice.value = formatDigits(saleRecord.sellingPrice.value)
  calcSoldAmount(saleRecord.soldLitre.value, saleRecord.sellingPrice.value)
  calcBalance(saleRecord.soldAmount.value, saleRecord.expenses.value, saleRecord.pos.value)
  calcShortage(saleRecord.balance.value, saleRecord.bankCash.value, saleRecord.handCash.value)
}

saleRecord.closingLitre.onkeyup = e => {
  saleRecord.closingLitre.value = formatDigits(saleRecord.closingLitre.value)
  calcSoldLitre(saleRecord.closingLitre.value, saleRecord.openingLitre.value)
  calcSoldAmount(saleRecord.soldLitre.value, saleRecord.sellingPrice.value)
  calcBalance(saleRecord.soldAmount.value, saleRecord.expenses.value, saleRecord.pos.value)
  calcShortage(saleRecord.balance.value, saleRecord.bankCash.value, saleRecord.handCash.value)
}

saleRecord.openingLitre.onkeyup = e => {
  saleRecord.openingLitre.value = formatDigits(saleRecord.openingLitre.value)
  calcSoldLitre(saleRecord.closingLitre.value, saleRecord.openingLitre.value)
  calcSoldAmount(saleRecord.soldLitre.value, saleRecord.sellingPrice.value)
  calcBalance(saleRecord.soldAmount.value, saleRecord.expenses.value, saleRecord.pos.value)
  calcShortage(saleRecord.balance.value, saleRecord.bankCash.value, saleRecord.handCash.value)
}

saleRecord.expenses.onkeyup = e => {
  saleRecord.expenses.value = formatDigits(saleRecord.expenses.value)
  calcBalance(saleRecord.soldAmount.value, saleRecord.expenses.value, saleRecord.pos.value)
  calcShortage(saleRecord.balance.value, saleRecord.bankCash.value, saleRecord.handCash.value)
}

saleRecord.pos.onkeyup = e => {
  saleRecord.pos.value = formatDigits(saleRecord.pos.value)
  calcBalance(saleRecord.soldAmount.value, saleRecord.expenses.value, saleRecord.pos.value)
  calcShortage(saleRecord.balance.value, saleRecord.bankCash.value, saleRecord.handCash.value)
}

saleRecord.bankCash.onkeyup = e => {
  saleRecord.bankCash.value = formatDigits(saleRecord.bankCash.value)
  calcShortage(saleRecord.balance.value, saleRecord.bankCash.value, saleRecord.handCash.value)
}

saleRecord.handCash.onkeyup = e => {
  saleRecord.handCash.value = formatDigits(saleRecord.handCash.value)
  calcShortage(saleRecord.balance.value, saleRecord.bankCash.value, saleRecord.handCash.value)
}



submit.onclick = async function (e) {
  // console.log(saleRecord.saleValue())
  this.classList.add('active')
  this.innerHTML = '...'
  const {
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
  } = saleRecord.saleValue()
  
  const response = await insertDb({
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
  })
  if(response) {
    this.classList.remove('active')
    this.innerHTML = `${response} &check;`
  }
}