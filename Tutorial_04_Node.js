/** @desc The HTTP interfaces in Node.js are designed to support many features of the protocol which have been traditionally difficult to use.
 *        In particular, large, possibly chunk-encoded, messages. The interface is careful to never buffer entire requests or responses, so the user is able to stream data.*/
const http = require("http");

/** @desc The url module provides utilities for URL resolution and parsing. */
const url = require("url");

/** @desc The path module provides utilities for working with file and directory paths. */
const path = require("path");

/** @desc The fs module enables interacting with the file system in a way modeled on standard POSIX functions. */
const fs = require("fs");

/** @desc The process object provides information about, and control over, the current Node.js process.
 *        The process.argv property returns an array containing the command-line arguments passed when the Node.js process was launched.
 *	      The first element will be process.execPath. See process.argv0 if access to the original value of argv[0] is needed.
 *	      The second element will be the path to the JavaScript file being executed.
 *	      The remaining elements will be any additional command-line arguments. */
const port = process.argv[2] || 8888;

/** @desc Create a local server to receive data from */
const server = http.createServer((req, res) => {
    /** @desc pathname is the path section of the URL, that comes after the host and before the query, including the initial slash if present.
     *        -> Example: http://localhost:8888/WebContent/index.html => /WebContent/index.html */
    const uri = url.parse(req.url).pathname;

    /** @desc The process.cwd() method is an inbuilt application programming interface of the process module
     *        which is used to get the current working directory of the node.js process.
     *  	  -> Example: C:\...
     * 	  The path.join() method joins the specified path segments into one path.
     *  	  -> Example: C:\...\WebContent\index.html */
    let filename = path.join(process.cwd(), uri);

    /** @desc The fs.stat() method is used to return information about the given file or directory.
     * 	  It returns an fs.Stat object which has several properties and methods to get details about the file or directory. */
    fs.stat(filename, (err, stats) => {
        if (err) {
            /** @desc If registered errors exist, show error output in frontend */
            res.writeHead(404, {
                "Content-Type": "text/plain"
            });
            res.write("404 Not Found");
            res.end();
            return;
        }

        /** @desc The stats.isDirectory() method is an inbuilt application programming interface of the fs.Stats class
         *        which is used to check whether fs.Stats object describes a file system directory or not. */
        if (stats.isDirectory()) {
            filename += "/index.html";
        }

        /** @desc Asynchronously reads the entire contents of a file. */
        fs.readFile(filename, "binary", (err, file) => {
           if (err) {
               /** @desc If registered errors exists, show error output in frontend */
               res.writeHead(500, {
                   "Content-Type": "text/plain"
               });
               res.write(err + "\n");
               res.end();
               return;
           }

            /** @desc Write your binary read file "../index.html" into the frontend */
            res.writeHead(200);
            res.write(file, "binary");
            res.end();
        });
    });
});

/** @desc Starts the HTTP server listening for connections. */
server.listen(parseInt(port, 10));

console.log("Static file server running at \n => http://localhost:" + port + "/\nCTRL + C to shutdown");
