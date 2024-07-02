# node-red-contrib-http-ntlm-req
Node-red nodes that allow users to send HTTP request with NTLM auth.

Added from: https://github.com/BetaAthe/node-red-contrib-http-ntlm-req

## Modifications
* Clean code
* Added payload as text or object
* Returning headers from ntlm request to receive
* Now only 4XX and 5XX status codes are marked as an error.

## Usage
To set up HTTP request, create a new auth config:
* Enter the URL address to the `URL` field. 
* Fill in the *Username*, *Password* and *Domain* if needed.

Then, set up the node:
* Set a name
* Optionally, set a URL. If not set, you must define msg.url with the URL.
* Select GET, POST or PUT method

Finally, you can add some msg variables:
* msg.url: Overwrites the URL of the node.
* msg.params: In all methods, it's going to be concatenated to the end of url (for example, given a url https://example.com and msg.params="?param1=1&amp;param2=2", the final URL is going to be https://example.com?param1=1&amp;param2=2). You don't need to set up msg.params if you are already using msg.url and viceversa, as the two values are simply concatenated. The only requirement is to have set the URL value in the config of the node, the msg.url or the msg.params.
* msg.headers: Dictionary of the headers to be sent. If you are sending any value via POST or PUT methods and you don't set the Content-type, it's going to be set up automatically for you as application/json.
* msg.payload: The body of the message in POST and PUT methods. It's stringified automatically, so your payload can be an object or a string.

The body of the response is going to be set at msg.payload as a string. You need to parse it, if needed, later :).