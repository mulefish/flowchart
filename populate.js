// let example = {
//     "nodes": [
//       {
//         "letter": "a",
//         "x": 764,
//         "y": 266,
//         "human": "a",
//         "color": "#ffffff",
//         "type": "box",
//         "ancestor": "",
//         "target": ""
//       }
//     ],
//     "connections": []
//   }

const nodes = [
  "home",
  "disclosures",
  "signin",
  "password_reset",
  "signin",
  "signup",
  "account_details",
  "associate_to_account",
  "end_flow_dashboard",
  "continue_enrollment_flow",
  "continue_renewal_flow",
  "reprint_notice",
  "location",
  "legalnames",
  "birth_and_citizenship",
  "eligibility",
  "attributes",
  "address",
  "payment",
  "photo_citizen",
  "photo_lpr",
  "summary_online",
  "citizen_docs",
  "name_check",
  "add_linking_doc",
  "schedule",
  "summary_appointment",
];

function getRandomNumber() {
  return Math.floor(Math.random() * (600 - 20 + 1)) + 20;
}

const output = {
  nodes: [],
  connections: [],
};
nodes.forEach((value) => {
  const obj = {
    letter: value,
    x: getRandomNumber(),
    y: getRandomNumber(),
    human: value,
    color: "#ffffff",
    type: "box",
    ancestor: "",
    target: "",
  };
  output["nodes"].push(obj)
});
console.log( JSON.stringify( output, null, 2 ))