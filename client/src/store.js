
//store
//array of borrowers


const store = [
    {name: 'running shoes', quantity: 300, type: 'shoes'},
    {name: 'sleeping bag', quantity: 150, type: 'gear'},
    {name: 'bicycle helmet', quantity: 100, type: 'helmet'},
    {name: 'hiking backpack', quantity: 250, type: 'backpack'},
    {name: 'inflatable camping mattress', quantity: 100, type: 'mattress'},
]



const status =['pending', 'delivered', 'returned']


const lenders = [
    { name: 'Krishna Tripathi', type: 'gear', quantity: 20, date: new Date(), status: 'pending', dateDue: ''},
    { name: 'Abhishek Sharma', type: 'shoes', quantity: 20, date: new Date(), status: 'pending', dateDue: ''},
    { name: 'Kartik Chauhan', type: 'helmet', quantity: 20, date: new Date(), status: 'pending', dateDue: ''},
    { name: 'Jatin Singh', type: 'backpack', quantity: 20, date: new Date(), status: 'pending', dateDue: ''},
    { name: 'Raj Verma', type: 'shoes', quantity: 20, date: new Date(), status: 'pending', dateDue: ''}
]


const shoesLenders = lenders.filter(lender => lender.type === 'shoes');
const gearLenders = lenders.filter(lender => lender.type === 'gear');
const helmetLenders = lenders.filter(lender => lender.type === 'helmet');

let availableShoes = 0;
for (let lender of shoesLenders) {
  availableShoes += lender.quantity;
}


