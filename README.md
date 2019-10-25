# justmake
### **A NodeJS based make tool CLI**
![](https://i.ibb.co/L5MMC7b/justmake-transparent.png)

## How to install
> npm install -g justmake

## How to launch
With commands `$ justmake` or `$ jsmake` 

On **Windows** is necessary launch the application in [Cygwin][id/name] environment

[id/name]: https://www.cygwin.com/

## How to use
Reach in your console the location of your project
> ~/ $ cd Projects/HelloC

And then launch justmake
> ~/Projects/HelloC $ jsmake 

At the first launch it will ask you if you want generate automatically a new Makefile.js

> Makefile doesn't exists, do you want generate a new one? (y)
 
Just press Enter for create it. 

## Makefile.js
By default Makefile.js default file is an example of a C project

You could launch a Makefile.js function in your console just writing the name of the function as arguments. It executes by default the 'start' function.
> $ jsmake functionName 

### Example 
```javascript
// Set current language
make.setLanguage('C');

make.entryFile = "main.c"; // main file path
make.out = "vv"; // output file name

// Compile secondary objects in 'build' folder (Default: false)
make.useBuildFolder(true); 

// Set flags
make.flags = "-std=c99 -Wall -Wextra -pedantic -Wno-pointer-arith -Wno-unused-result -Wno-unused-parameter -g -O3 -D_GNU_SOURCE";
make.addFlags("-lpcre -ltermbox -llua5.3"); // Dynamic libraries (it appends them to make.flags property)

make.include("."); // Includes .h files in root directory
// make.include(["example1/include", "example2/include" ]); // It appends new paths

// compileObjects - Syntax examples:
// libs/mylib.c		Compile the file mylib.c in libs directory
// *.c 				Compile all .c files in the root directory of the project
// */*.c.cpp 		Compile all .c and .cpp files recursively
// libs/*/*			Compile all files recursively in "libs" directory
// 
// You could use the function more times
// It excludes automatically the entry point file
make.compileObjects("*/*.h"); 


function start() {
    make.compile();
}

function clear() {
	make.clear();
}


```

## CLI arguments
You could force some parameters using jsmake arguments
> $ jsmake -setCompilerPath '/particular/path/crossgcc'

## Supported compilers and languages
### Languages:
- C
- C++

### Compilers:
- CC 
- GCC

Edit compilersSettings.js for adding new compilers and languages

## Authors
cekkr @ Riccardo Cecchini (rcecchini.ds@gmail.com)