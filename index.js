#!/usr/bin/env node

// Riccardo Cecchini 2019 (rcecchini.ds@gmail.com)
// Install this with: npm install -g git+https://github.com/cekkr/make.js.git
// https://blog.developer.atlassian.com/scripting-with-node/

//don't use strict';

const fs = require('fs')
const readline = require('readline');
const moment = require('moment');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = require('colors');

const utils = require('./utils.js');


console.log("justmake - cekkr@GitHub 2019\r\n");

///
/// Read and manage CLI arguments
///
var acceptedArguments = {
    'setCompilerPath': 'Force compilation using the specified application',
    'make': "Force via CLI a value of parameter of 'make' object (Example: jsmake -make.out 'myApplication')"
}

function listAcceptedArguments(){
    console.log('Accepted parameters:'.bold);
    for(var p in acceptedArguments){
        console.log(p + ':\r\n\t', acceptedArguments[p]);
    }
    
    console.log();
}

var cliArguments = {entryFunction: 'start'};
for(var a=2; a<process.argv.length; a++){
    var arg = process.argv[a];
    
    if(!arg.startsWith('-')) {
         var prevArg = process.argv[a-1]; 
        
        if(!prevArg.startsWith('-'))
            cliArguments.entryFunction = arg;
        else 
            utils.forceSetProperty(cliArguments, prevArg.substr(1), arg);
    }
    else {
        if(!arg.startsWith('--')) {
            var p = arg.substr(1).split('.')[0];
            var argProp = acceptedArguments[p];
            if(!argProp){
                console.log(('Error! Parameter \'' + p + '\' doesn\'t exists').red.bold);
                listAcceptedArguments();
                process.exit(0);
            }
        }
        else {
            // todo: Is a flag
        }
    }
}
    
///
/// Execution init
///
var cwd = process.cwd();
var makefile = cwd + "/Makefile.js";

if(!fs.existsSync(makefile)){
    rl.question("Makefile.js doesn't exists, do you want generate a new one? (y) ", (answer) => {
        answer = answer || "y";
        //console.log(`Thank you for your valuable feedback: ${answer}`);
        
        if(answer == 'y'){
            
            let makefileInit = fs.readFileSync(__dirname+"/Makefile.init.js", 'utf8');
            makefileInit = makefileInit.replace("%INFO%", moment().format('MMMM Do YYYY, h:mm a'));
            
            fs.writeFile('Makefile.js', makefileInit, function (err) {
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
/// Steps
///

function executeMakefile(){
    global.make = require("./make.js");
    make.init(cliArguments);
    
    var makefileContent = fs.readFileSync(makefile, 'utf8');
    eval(makefileContent); 

    utils.overwriteObject(make, cliArguments.make); // Force CLI parameters 
    
    eval(cliArguments.entryFunction+'()');
    
    end();
}

function end(){
    console.log();
    rl.close();
}