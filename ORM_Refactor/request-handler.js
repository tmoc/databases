var messages = require('./messages.js');

/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

var handleRequest = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */
  //console.log('request is ', request);
  console.log("Serving request type " + request.method + " for url " + request.url);

  var headers = defaultCorsHeaders;
  var baseURL = request.url.split('?')[0];

  //cool move
  //create object keys that actually match the request methods
  //and are tied to the appropriate functions
  var handleMethod = {"/classes/room1": {POST: handlePost,
                                         OPTIONS: handleOptions,
                                         GET: handleGet},
                      "/classes/messages": {POST: handlePost,
                                            OPTIONS: handleOptions,
                                            GET: handleGet}
                     };


  //now just invoke the function at the correct key.  wammo
  if (handleMethod[baseURL]){
    handleMethod[baseURL][request.method](request,response);
  } else {
    handle404(response);
  }

};



/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Credentials": "true",
  // needed for authentication code to work with Parse. Not needed for this version of the app.
  // "Access-Control-Allow-Headers": "X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept, x-parse-application-id, x-parse-rest-api-key",
  "Access-Control-Allow-Headers":  "Content-Type, Accept",
  "Access-Control-Max-Age": 10 // Seconds.
};
//orig "content-type, accept"
//"X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept"

var handle404 = function(response){

  var statusCode = 404;

  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "text/plain";

  /* .writeHead() tells our server what HTTP status code to send back */
  response.writeHead(statusCode, headers);

  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/
  response.end(JSON.stringify('URL not found...'));


};


var handlePost = function(request,response){

  var postData = '';
  var statusCode = 201;

  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "text/plain";

  request.on("data",function(chunk){
    postData += chunk;
  });

  request.on("end", function(){
    var message = JSON.parse(postData);
    messages.createMessage(message, function(){
      response.writeHead(statusCode, headers);
      response.end();
    });
  });

};

var handleOptions = function(request, response){

  var statusCode = 200;

  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "text/plain";

  /* .writeHead() tells our server what HTTP status code to send back */
  response.writeHead(statusCode, headers);

  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/
  response.end();

};

var handleGet = function(request, response){

  messages.getMessages(function(messageObjs){
    var statusCode = 200;

    /* Without this line, this server wouldn't work. See the note
     * below about CORS. */
    var headers = defaultCorsHeaders;

    headers['Content-Type'] = "application/json";

    /* .writeHead() tells our server what HTTP status code to send back */
    response.writeHead(statusCode, headers);

    /* Make sure to always call response.end() - Node will not send
     * anything back to the client until you do. The string you pass to
     * response.end() will be the body of the response - i.e. what shows
     * up in the browser.*/
    response.end(JSON.stringify(messageObjs));
  });


};


module.exports = {handler: handleRequest};
