// const myName = "Shivam   ";
// const city = "  Lucknow ";

// function trueLength(value) {
//     return value.trim().length;
// }

// const func = trueLength(myName)
// console.log(func);

// const heroes = ['iron man', 'spiderman']

// const user = {
//     userFunc: function (name, age) {
//         this.name = name,
//             this.age = age
//         return this
//     },
//     len : function(value){
//         return value.trim().length
//     }
// }

// const funct = new user.userFunc("Shivam", 22)
// console.log(funct);
// Object.prototype.trueLength = len
// const

// let arr = [
//     {
//         name : "Shivam",
//         age : 22
//     },
//     {
//         name : "Akash",
//         age : 21,
//     },
//     {
//         name : "Devesh",
//         age : 23
//     }
// ]
// let newArr = []
// arr.forEach((user, i, arr)=> newArr.push(user.name = user.age))
// console.log(newArr);

const uri = "https://api.github.com/users/theshivamx19"

// fetch(uri).then(function(response){
//     return response.json()
// })
// .then(function(data){
//     console.log(data);
// })
// const fetchedData = async function (){
// const response = await fetch(uri)
// console.log(response);
// const data = await response.json()
// console.log(data);
// }()

// let num1 = "SDf547"
// let num2 = "SDf547"
// let nan1 = isNaN(num1)
// let nan2 = isNaN(num2)
// // console.log(num1 == num2);
// console.log(nan1 == nan2);
// console.log(isNaN(num1) == isNaN(num2));
// console.log(NaN == NaN);

// let str = "Shivam" + 'Maurya'

// console.log("Age is "+ 60);

// let num = 5
// let i = 1
// while(i<=10){
//     console.log(`${num} x ${i} = ${num * i}`);
//     i++
// }

// let num = 5
// let i = 1
// do {
//     console.log(num +"*"+i+"="+ num*i);
//     i++
// }
// while(i<=10)

// for(;;){       // Infinite loop

// }


// for (let i = 0; i <= 5; i++) {
//     console.log("\t");
//     for (let j = 0; j <= i; j++) {
//         console.log("*");
//     }
// }

// const str = 'Hello everyone, Shivam this side, i am going to tell you more about my company named as Shivam Industries'

// let newObj = {}

// for (let s of str) {
//     if(newObj[s]){
//         newObj[s] += 1
//     }
//     else {
//         newObj[s] = 1
//     }
// }
// console.log(newObj);

// const arr = ['hello', 'everyone', 'Shivam', 'this', 'side']

// const newArr = []

// const str = arr.toString().split(",").join(" ")
// console.log(str);
// const newObj = {}
// for(let s of str){
//     if(newObj[s]){
//         newObj[s] += 1
//     }
//     else {
//         newObj[s] = 1
//     }
// }
// console.log(newObj);

// const newArr = arr.map(item=>{
//     console.log(item.split("").join(" "));
//     return item.split("")

// })
// console.log(newArr);

// const filters = {
//     state: "state",
//     company: "company"
// }
// // console.log(Object.keys(filters))
// const filterKeys = Object.keys(filters).filter(key=> filters[key] !== undefined && filters[key]!== "")
// console.log(filterKeys);

// Function to calculate overdue days
function calculateOverdueDays(start_date, end_date) {
    // Convert start_date and end_date to Date objects
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    
    // Get the current date
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const difference = currentDate - endDate;

    // Check if the project is overdue
    if (difference > 0) {
        // Convert milliseconds to days
        const overdueDays = Math.ceil(difference / (1000 * 60 * 60 * 24));
        return overdueDays;
    } else {
        return 0; // Project is not overdue
    }
}

// Example usage
const start_date = '2023-12-01'; // Project start date
const end_date = '2024-02-25'; // Project end date

const overdueDays = calculateOverdueDays(start_date, end_date);
console.log("Overdue Days:", overdueDays-1);