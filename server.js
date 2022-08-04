// Variable declarations
const http = require("http"), // Imports http module
  fs = require("fs"),
  url = require("url");

http
  .createServer((request, response) => { // 'createServer' comes from http module and creates new server
    let addr = request.url, // Assigns url to addr variable
      q = url.parse(addr, true), // Previous url results are added to a new variable 'q'
      filePath = ""; // Empty string allows for file path storage. 

    fs.appendFile( // Allows for tracking when url's are visited. 
      "log.txt",
      "URL: " + addr + "\nTimestamp: " + new Date() + "\n\n",
      (err) => { // Catching errors
        if (err) {
          console.log(err);
        } else {
          console.log("Added to log."); 
        }
      }
    );

    if (q.pathname.includes("documentation")) { // Checks to see if 'q' includes the word documentation
      filePath = __dirname + "/documentation.html"; // If documentation is present file path becomes a complete path
    } else { // Documentation is not found within 'q'
      filePath = "index.html"; // Directs back to 'index.html' since documentation was not present
    }

    fs.readFile(filePath, (err, data) => { // Grabs file from server 
      if (err) {
        throw err;
      }

      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(data);
      response.end();
    });
  })
  .listen(8080); // Listens for response on port 8080
console.log("My test server is running on Port 8080.");
