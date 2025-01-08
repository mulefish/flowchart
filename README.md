# repo
https://github.com/mulefish/flowchart

# run the force directed graph 
step1: node server.js   
step2: http://localhost:3000/

# TODO: 
1: Convert to SVG because svg simply looks better than CANVAS
2: The Stop Animation butto is too busy - ought to divorce its 2 functions 
3: In 'letter' mode ( see 'Toggle Node Display' ) there ought to be an associated table to show which letter means what file 

# What are the buttons? 
The 'Stop Animation' will A: stop the movement and B: write the convert state to localstorage 
The 'Load State' will read localstorage and overwrite the current state with whatever state was in localstorage 
The 'Toggle Node Display' will toggle because 'full names' and 'letters' 



# Screenshot - letters
![letters](ss_with_letters.png)

# Screenshot - text
![text](ss_with_text.png)
