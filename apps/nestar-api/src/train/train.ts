//console.log('NestJS test file ishladi!');
//Task ZL
function stringKebab(str) {
    return str.trim().toLowerCase().split(/\s+/).join('_')
}

console.log(stringKebab("i love Kebab"))