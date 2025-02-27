const everything = {
    "nodes": [
      {
        "letter": "signup",
        "x": 49,
        "y": 434,
        "human": "signup",
        "color": "#ffffff",
        "type": "box"
      },
      {
        "letter": "location",
        "x": 28,
        "y": 304,
        "human": "location",
        "color": "#ffffff",
        "type": "box"
      },
      {
        "letter": "legal_names",
        "x": 114,
        "y": 202,
        "human": "legal_names",
        "color": "#ffffff",
        "type": "box"
      },
      {
        "letter": "birth_and_citizenship",
        "x": 289,
        "y": 127,
        "human": "birth_and_citizenship",
        "color": "#ffffff",
        "type": "box"
      },
      {
        "letter": "eligibility",
        "x": 197,
        "y": 348,
        "human": "eligibility",
        "color": "#ffffff",
        "type": "box"
      },
      {
        "letter": "attributes",
        "x": 480,
        "y": 54,
        "human": "attributes",
        "color": "#ffffff",
        "type": "box"
      },
      {
        "letter": "addresses",
        "x": 373,
        "y": 333,
        "human": "addresses",
        "color": "#ffffff",
        "type": "box"
      },
      {
        "letter": "photo_id",
        "x": 767,
        "y": 57,
        "human": "photo_id",
        "color": "#ffffff",
        "type": "box"
      },
      {
        "letter": "name_match",
        "x": 1119,
        "y": 453,
        "human": "name_match",
        "color": "#ffffff",
        "type": "box"
      },
      {
        "letter": "scheduler",
        "x": 1250,
        "y": 318,
        "human": "scheduler",
        "color": "#ffffff",
        "type": "box"
      },
      {
        "letter": "summary",
        "x": 1239,
        "y": 30,
        "human": "summary",
        "color": "#ffffff",
        "type": "box"
      },
      {
        "letter": "online_renew_summary",
        "x": 1451,
        "y": 124,
        "human": "online_renew_summary",
        "color": "#ffffff",
        "type": "box"
      },
      {
        "letter": "payment",
        "x": 1058,
        "y": 166,
        "human": "payment",
        "color": "#ffffff",
        "type": "box"
      },
      {
        "letter": "dashboard_renewal_pending",
        "x": 1872,
        "y": 259,
        "human": "dashboard_renewal_pending",
        "color": "#ffffff",
        "type": "box"
      },
      {
        "letter": "dashboard_preenrollment_complete",
        "x": 1855,
        "y": 70,
        "human": "dashboard_preenrollment_complete",
        "color": "#ffffff",
        "type": "box"
      },
      {
        "letter": "dashboard_renew_appointment",
        "x": 1652,
        "y": 404,
        "human": "dashboard_renew_appointment",
        "color": "#ffffff",
        "type": "box"
      },
      {
        "letter": "renewal",
        "x": 99,
        "y": 65,
        "human": "renewal",
        "color": "#ffffff",
        "type": "box"
      },
      {
        "letter": "citizenship_doc",
        "x": 648,
        "y": 176,
        "human": "citizenship_doc",
        "color": "#ffffff",
        "type": "box"
      },
      {
        "letter": "TEST_YES_NO_1",
        "x": 554,
        "y": 394,
        "human": "TEST_YES_NO_1",
        "color": "#deecac",
        "type": "diamond"
      }
    ],
    "connections": [
      {
        "from": "signup",
        "to": "location",
        "type": "normal"
      },
      {
        "from": "location",
        "to": "legal_names",
        "type": "normal"
      },
      {
        "from": "legal_names",
        "to": "renewal",
        "type": "normal"
      },
      {
        "from": "renewal",
        "to": "birth_and_citizenship",
        "type": "normal"
      },
      {
        "from": "birth_and_citizenship",
        "to": "eligibility",
        "type": "normal"
      },
      {
        "from": "eligibility",
        "to": "attributes",
        "type": "normal"
      },
      {
        "from": "attributes",
        "to": "addresses",
        "type": "normal"
      },
      {
        "from": "photo_id",
        "to": "name_match",
        "type": "normal"
      },
      {
        "from": "name_match",
        "to": "scheduler",
        "type": "normal"
      },
      {
        "from": "scheduler",
        "to": "payment",
        "type": "normal"
      },
      {
        "from": "payment",
        "to": "summary",
        "type": "normal"
      },
      {
        "from": "summary",
        "to": "online_renew_summary",
        "type": "normal"
      },
      {
        "from": "online_renew_summary",
        "to": "dashboard_renew_appointment",
        "type": "normal"
      },
      {
        "from": "dashboard_renew_appointment",
        "to": "dashboard_renewal_pending",
        "type": "normal"
      },
      {
        "from": "dashboard_renewal_pending",
        "to": "dashboard_preenrollment_complete",
        "type": "normal"
      },
      {
        "from": "citizenship_doc",
        "to": "photo_id",
        "type": "normal"
      },
      {
        "from": "attributes",
        "to": "TEST_YES_NO_1",
        "type": "normal"
      },
      {
        "from": "TEST_YES_NO_1",
        "to": "citizenship_doc",
        "type": "yes"
      },
      {
        "from": "TEST_YES_NO_1",
        "to": "name_match",
        "type": "no"
      }
    ]
  }

let dependencies = {} 
everything.nodes.forEach((node)=> { 
    let children = []
    dependencies[node.human] = [] 
    everything.connections.forEach((connected)=> { 
        if ( connected.from === node.human ) {
            let obj = {
                "type":connected.type,
                "to":connected.to
            }
            dependencies[node.human].push(obj)
        }
    })
})
console.log( dependencies)
