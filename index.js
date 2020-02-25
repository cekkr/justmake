#!/usr/bin/env node

// Riccardo Cecchini 2019 (rcecchini.ds@gmail.com)
// Install this with: npm install -g git+https://github.com/cekkr/make.js.git
// https://blog.developer.atlassian.com/scripting-with-node/

//don't use strict';

const fs = require('fs')
const readline = require('readline');
const moment = require('moment');
const colors = require('colors');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const pjson = require('./package.json');
const utils = require('./utils.js');

const title = "justmake "+ pjson.version +" - cekkr@GitHub 2019\r\n";
const motto = 'Javascript for compilation';

console.log(title);


///
/// Read and manage CLI arguments
///

var acceptedArguments = {
    'setCompilerPath': 'Force compilation using the specified application',
    'make': "Force via CLI a value of parameter of 'make' object (Example: jsmake -make.out 'myApplication')"
};

var acceptedFlags = {
    'verbose' : 'Activate verbose mode',
    'help': 'Get command infos'
};

var shortcuts = {
    'h': 'help'
};

var reservedEntryFunctions = [
    'init'
];


function listAcceptedArguments(){
    console.log('Accepted parameters:');
    for(var p in acceptedArguments){
        console.log('-'+p.underline + ':\r\n\t', acceptedArguments[p]);
    }
    
    console.log('\r\nAccepted flags:');
        for(var f in acceptedFlags){
        console.log('--'+f.underline + ':\r\n\t', acceptedFlags[f]);
    }
    
    console.log();
}

///
/// Scan CLI arguments
///

global.cliArguments = {entryFunction: 'start'};

for(var a=2; a<process.argv.length; a++){
    
    var arg = process.argv[a];
    
    if(!arg.startsWith('-')) { // Is value
         var prevArg = process.argv[a-1]; 
        
        if(!prevArg.startsWith('-') || prevArg.startsWith('--'))
            cliArguments.entryFunction = arg;
        else 
            utils.forceSetProperty(cliArguments, prevArg.substr(1), arg);
    }
    else { // Is key
        var key = utils.removeRecursevlyFirstChar(arg);
        
        if(arg.startsWith('--')) 
            utils.forceSetProperty(cliArguments, key, true);
                
        var argProp = acceptedArguments[key] || acceptedFlags[key];
        console.log(key, argProp);
        if(!argProp){
            console.log(('Error! Parameter \'' + key + '\' doesn\'t exists').red.bold);
            listAcceptedArguments();
            process.exit(0);
        }
    }
}

if(cliArguments.help){
    listAcceptedArguments();
    
    process.exit(0);
}

    
///
/// Execution init
///
var efi = reservedEntryFunctions.indexOf(cliArguments.entryFunction);

if(efi === undefined){
    makeJsExec();
}
else {
    console.log('Reserved function execution!');
}

///
/// Execution functions
///

function makeJsExec(){

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
    else {
        executeMakefile();
    }
    
}

///
/// Steps
///

function executeMakefile(){
    global.make = require("./make.js");
    make.init(cliArguments);
    
    var makefileContent = fs.readFileSync(makefile, 'utf8');
    eval(makefileContent); 

    utils.overwriteObject(make, cliArguments.make); // Force CLI parameters 
    
    // todo: Manage jsonData
    
    eval(cliArguments.entryFunction+'()');
    
    end();
}

function end(){
    console.log();
    rl.close();
}