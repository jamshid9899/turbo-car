//console.log('NestJS test file ishladi!');
//Task ZL
// function stringKebab(str) {
//     return str.trim().toLowerCase().split(/\s+/).join('_')
// }

// console.log(stringKebab("i love Kebab"))

//Task ZM
function reverseInteger(number) {
   return Number(number.toString().split("").reverse().join(""));
}
console.log(reverseInteger(123456789));
console.log(reverseInteger(1911));