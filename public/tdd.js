   const negative = "negative"
        const positive = "positive"
        const neutral = "neutral"
        const dashed = 'dashed'
        const other = "other"
        const user = "user"
        const biodata = "biodata"
        const docselection="docselection"
        const scheduler="scheduler"
        const payment="payment"
        const box="box"
        const circle="circle"
        const diamond="diamond"




// Graph Data
        const names = {};
        names["home"] = { letter:"a", text: "Home/Landing Page", shape:box, group:other, children: [] };
        names["disclosures"] = { letter:"b", text: "Disclosures", shape:box, group:other,children: [] };
        names["signin"] = { letter:"c", text: "Sign In",  shape:box, group:user,children: [] };
        names["password"] = { letter:"d", text: "Password Reset", shape:box,  group:user,children: [] };
        names["MFA"] = { letter:"e", text: "MFA",  shape:box, group:user,children: [] };
        names["signup"] = { letter:"f", text: "Sign Up",  shape:box, group:user,children: [] };
        names["account"] = { letter:"g", text: "Account Details", shape:box, group:user, children:[]};
        names["associate"] = { letter:"h", text: "Associate to account", shape:box, group:user, children:[]};
        names["existing"] = { letter:"i", text: "Existing enrollment in Snow?", shape:diamond, group:user, children:[]};
        names["STA"] = { letter:"j", text: "STA Lookup", shape:diamond, group:other, children:[]};
        names["ARS"] = { letter:"k", text: "Active Renewal in Snow", shape:diamond, group:other, children:[]};
        names["AES"] = { letter:"l", text: "Active Enrollment in Snow", shape:diamond, group:other, children:[]};
        names["EtR"] = { letter:"m", text: "Eligible to renew", shape:diamond, group:other, children:[]};
        names["CLSS"] = { letter:"n", text: "Continue from last saved step", shape:box, group:other, children:[]};
        names["EFD"] = { letter:"o", text: "End flow/dashboard", shape:box, group:other, children:[]};
        names["PFR"] = { letter:"p", text: "Prompt for renewal", shape:diamond, group:other, children:[]};
        names["PEC"] = { letter:"q", text: "Pre Enrollment Complete", shape:diamond, group:other, children:[]};
        names["CfLSEF"] = { letter:"r", text: "Continue from last saved enrollment flow", shape:box, group:other, children:[]};
        names["RR"] = { letter:"s", text: "Reprint required", shape:diamond, group:other, children:[]};
        names["RRN"] = { letter:"t", text: "Reprint required notice", shape:box, group:other, children:[]};
        names["CaoNC"] = { letter:"u", text: "Citizen and/or name change", shape:diamond, group:other, children:[]};
        names["LF"] = { letter:"v", text: "Location Finder", shape:box, group:scheduler, children:[]};
        names["LN"] = { letter:"x", text: "Legal Name", shape:box, group:biodata, children:[]};
        names["BaC"] = { letter:"y", text: "Birth and Citizenship", shape:box, group:biodata, children:[]};
        names["Eligibility"] = { letter:"z", text: "Eligibility", shape:box, group:biodata, children:[]};
        names["Enrollment"] = { letter:"ab", text: "Enrollment?", shape:diamond, group:other, children:[]};
        names["Attributes"] = { letter:"ac", text: "Attributes", shape:diamond, group:biodata, children:[]};
        names["Address"] = { letter:"ad", text: "Address?", shape:diamond, group:biodata, children:[]};
        names["OR"] = { letter:"ae", text: "Online renewal", shape:diamond, group:other, children:[]};
        names["Payment"] = { letter:"af", text: "Payment", shape:box, group:payment, children:[]};
        names["CoLPR"] = { letter:"ag", text: "Citizen or LPR", shape:diamond, group:docselection, children:[]};
        names["PID_LPR"] = { letter:"ah", text: "PhotoId (LPR)", shape:box, group:docselection, children:[]};
        names["PID_Citizen"] = { letter:"ai", text: "PhotoId (Citizen)", shape:box, group:docselection, children:[]};
        names["ListA"] = { letter:"aj", text: "List A?", shape:diamond, group:docselection, children:[]};
        names["CD"] = { letter:"ak", text: "Citizen Docs", shape:box, group:docselection, children:[]};
        names["NC"] = { letter:"al", text: "Name check", shape:box, group:docselection, children:[]};
        names["PicIdMatch"] = { letter:"am", text: "Photo ID and citizenship match", shape:diamond, group:docselection, children:[]};
        names["Scheduler"] = { letter:"an", text: "Scheduler", shape:box, group:scheduler, children:[]};
        names["ALD"] = { letter:"ao", text: "Add linking docs", shape:box, group:docselection, children:[]};
        names["LtENC"] = { letter:"ap", text: "Link to Enrollment Name complete?", shape:diamond, group:docselection, children:[]};
        names["ASP"] = { letter:"aq", text: "Appointment summary screen", shape:diamond, group:other, children:[]};
        names["EFD3"] = { letter:"ar", text: "End flow/dashboard", shape:diamond, group:other, children:[]};
        names["OSS"] = { letter:"as", text: "Online summary screen", shape:diamond, group:other, children:[]};
        names["home"].children = [{id:"disclosures", mood:neutral}];
        names["disclosures"].children = [{id:"signin", mood:neutral}];
        names["signin"].children = [{id:"password", mood:neutral},{id:"MFA", mood:neutral},{id:"signup", mood:dashed}];
        names["signup"].children = [{id:"account", mood:neutral}];
        names["account"].children = [{id:"existing", mood:neutral}]
        names["existing"].children = [{id:"signin", mood:negative}, {id:"associate", mood:positive}]
        names["MFA"].children = [{id:"STA", mood:neutral}]
        names["STA"].children = [{id:"ARS", mood:positive},{id:"AES", mood:negative}]
        names["ARS"].children = [{id:"EtR", mood:negative},{id:"CLSS", mood:positive}]
        names["EtR"].children = [{id:"EFD", mood:negative},{id:"PFR", mood:positive}]
        names["PFR"].children = [{id:"EFD", mood:negative}, {id:"RR", mood:positive}]
        names["AES"].children = [{id:"PEC", mood:positive}]
        // names["PEC"].children = [{id:"CfLSEF", mood:negative},{id:"EFD2", mood:positive}]
        names["PEC"].children = [{id:"CfLSEF", mood:negative},{id:"EFD", mood:positive}]
        names["RR"].children = [{id:"RRN", mood:positive}, {id:"CaoNC", mood:negative}]
        names["RRN"].children = [{id:"LF", mood:neutral}]
        names["CaoNC"].children = [{id:"LF", mood:positive}]
        names["LF"].children = [{id:"LN", mood:neutral}]
        names["LN"].children = [{id:"BaC", mood:neutral}]
        names["BaC"].children = [{id:"Eligibility", mood:neutral}]
        names["Eligibility"].children = [{id:"Enrollment", mood:neutral}]
        names["Enrollment"].children = [{id:"Address", mood:negative},{id:"Attributes", mood:positive}]
        names["Attributes"].children = [{id:"Address", mood:neutral}]
        names["Address"].children = [{id:"OR", mood:neutral}]
        names["OR"].children = [{id:"Payment", mood:positive},{id:"CoLPR", mood:positive} ]
        names["Payment"].children = [{id:"OSS", mood:neutral}  ]
        names["OSS"].children = [{id:"EFD3", mood:neutral}  ]
        names["CoLPR"].children = [{id:"PID_LPR", mood:neutral},{id:"PID_Citizen", mood:neutral} ]
        names["PID_Citizen"].children = [{id:"ListA", mood:neutral} ]
        names["ListA"].children = [{id:"CD", mood:negative} ]
        names["CD"].children = [{id:"NC", mood:neutral} ]
        names["NC"].children = [{id:"PicIdMatch", mood:neutral} ]
        names["PicIdMatch"].children = [{id:"Scheduler", mood:positive}, {id:"ALD", mood:negative} ]
        names["ALD"].children = [{id:"LtENC", mood:neutral} ]
        names["LtENC"].children = [{id:"Scheduler", mood:positive}  ]
        names["Scheduler"].children = [{id:"ASP", mood:neutral}  ]
        names["ASP"].children = [{id:"EFD3", mood:neutral}  ]


// Just to get a 'sense' of this graph's complexity
function dfs(node, visited = new Set(), counter = { count: 0 }) {
    if (visited.has(node)) return;
    visited.add(node);
    counter.count++;
    counter.count += names[node].children.length 
    // console.log(`Node: ${node}, Children: ${names[node].children.map(child => child.id).join(', ')}`);
    	
    names[node].children.forEach(child => {
        dfs(child.id, visited, counter);
    });

    return counter.count;
}

// Start DFS from the "home" node and print the totdal number of nodes visited
let totalNodes = dfs("home");
console.log(`Total nodes visited: ${totalNodes}`);



