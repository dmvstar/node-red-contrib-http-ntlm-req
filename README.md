# node-red-contrib-http-ntlm-req
Node-red nodes that allow users to send HTTP request with NTLM auth.


##Usages
To set up HTTP request, create a new auth config:
* Enter the URL address to the `URL` field. 
* Select `Auth` method, the default would be set to None.
* Fill in *Username*, *Password*, *Client Key*, *Client Certificate*, *Token* if needed.

You can also feed in parameters and overwrite configs with an injected msg: 
* You can have `msg.method` to overwrite the methot (GET POST).
