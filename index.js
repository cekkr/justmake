#!/usr/bin/env node

// Riccardo Cecchini 2019 (rcecchini.ds@gmail.com)
// Install this with: npm install -g git+https://github.com/cekkr/make.js.git
// https://blog.developer.atlassian.com/scripting-with-node/

//don't use strict';

const fs = require('fs')
const readline = require('readline');
const { exec } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


///
/// Execution init
///
console.log("make.js - Riccardo Cecchini (rcecchini.ds@gmail.com)")

var cwd = process.cwd();
var makefile = cwd + "/Makefile.js";

if(!fs.existsSync(makefile)){
    rl.question("Makefile doesn't exists, do you want generate a new one? (n) ", (answer) => {
        answer = answer || "n";
        //console.log(`Thank you for your valuable feedback: ${answer}`);
        
        if(answer == 'y'){
            fs.writeFile('Makefile.js', '// Insert here commands\r\n', function (err) {
                if (err) throw err;
                console.log('Makefile.js is created successfully.');
                executeMakefile();
            }); 
        }
        else
            end();
    });
}
else
    executeMakefile();

///
/// Make functions
///

///
/// Steps
///
function generateMakefile(){
    // [...]
    executeMakefile();
}

function executeMakefile(){
    global.make = require("./make.js");
    console.log(global.make);
    
    //require(makefile);
    var makefileContent = fs.readFileSync(makefile, 'utf8');
    eval(makefileContent); //todo: handle errors
    main();
    
    end();
}

function end(){
    rl.close();
}