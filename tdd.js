


const main = 
{
  "country": "United States of America",
  "street": "first",
  "address2": "second",
  "city": "three",
  "stateOrProvince": "Iowa",
  "postalCode": "11111"
}

const res = {
  "country": "dkd",
  "street": "",
  "address2": "",
  "city": "",
  "stateOrProvince": "",
  "postalCode": ""
}



const prev = {"country":"ddd","street":"","address2":"","city":"","stateOrProvince":"","postalCode":""}


const main_values = Object.values(main) 
console.log( main_values )


const res_values = Object.values(res).filter(val => val !== '').length
console.log( "lenth? " + res_values )


