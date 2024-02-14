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
const fetchedData = async function (){
const response = await fetch(uri)
console.log(response);
const data = await response.json()
console.log(data);
}()