//Task ZU
function sumOfUnique(arr: number[]): number {
	let sum: number = 0;

	for (const num of arr) {
		if (arr.indexOf(num) === arr.lastIndexOf(num)) {
			sum += num;
		}
	}
	return sum;
}
console.log(sumOfUnique([1, 2, 3, 2]));
//TASK ZQ
// function findDuplicatesAtLeastTwo(arr: number[]): number[] {
//   const counts: Record<number, number> = {};
//   const result: number[] = [];

//   for (const num of arr) {
//     counts[num] = (counts[num] || 0) + 1;
//   }

//   for (const key in counts) {
//     if (counts[key] >= 2) {
//       result.push(Number(key));
//     }
//   }

//   return result;
// }

// console.log(findDuplicatesAtLeastTwo([1, 2, 3, 4, 5, 4, 3, 4]));

//console.log('NestJS test file ishladi!');
//Task ZL
// function stringKebab(str) {
//     return str.trim().toLowerCase().split(/\s+/).join('_')
// }

// console.log(stringKebab("i love Kebab"))

//Task ZM
// function reverseInteger(number) {
//    return Number(number.toString().split("").reverse().join(""));
// }
// console.log(reverseInteger(123456789));
// console.log(reverseInteger(1911));

//TASK ZO
// function areParenthesesBalanced(str: string): boolean {
//    let count = 0;

//    for (const char of str) {
//       if (char === "(") {
//          count++;
//       } else if (char === ")") {
//          count--;
//          if (count < 0) {
//             return false;
//          }
//       }
//    }
//    return count === 0;
// }

// console.log(areParenthesesBalanced("string()ichida(qavslar)soni()balansda"));

//Task ZP
// function countNumberAndLetters(str: string): { number: number; letter: number } {
//   let numbers = 0;
//   let letters = 0;

//   for (let ch of str) {
//     if (/[0-9]/.test(ch)) {
//       numbers++;
//     } else if (/[a-zA-Z]/.test(ch)) {
//       letters++;
//     }
//   }

//   return { number: numbers, letter: letters };
// }

// // Test
// console.log(countNumberAndLetters("string152%¥"));
