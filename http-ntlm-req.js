module.exports = function(RED) {
    function HttpNtlmReqNode(config) {
		var httpntlm = require('httpntlm');
		var fs = require('fs');
		
        RED.nodes.createNode(this, config);
        var node = this;
		
        this.name = config.name;
        this.url  = config.url;
        this.method  = config.method;
        this.authconf = RED.nodes.getNode(config.auth);
		var realURL = node.url
		
		var debug = false;

		var connData = {url: realURL, username: "", password: "", domain: "", workstation: ""}; 
		
		var requestFail = false, requestError = '';
		node.status({});

        try {
			node.on('input', function(msg) {
				var method = node.method;
				var retValue = "";
				if(msg.method !== undefined) {
					switch (msg.method) {
						case 'GET':
							method = '0';
						break;
						case 'POST':
							method = '1';
						break;
					}
				}
//node.warn('0 node.method ['+node.method+'] method ['+method+'] msg.method ['+msg.method+']');
				switch (method) {
					// GET
					case '0':
						realURL = this.url + msg.payload;
						switch (node.authconf.auth) {
							case '5':
								connData = {
									url: realURL, 
									username: node.authconf.user, 
									password: node.authconf.pass, 
									domain: node.authconf.doman, 
									workstation: ''}; 
							break;
							default: 
								connData = {url: realURL}; 
							break;
						}
						httpntlm.get(connData, function (err, res){
							node.status({});

							requestFail = false;
							requestError = '';
							if(res !== undefined && res.body !== undefined) {
								retValue = res.body;
								msg.payload = retValue;
								if(res.statusCode !== 200) { 
									requestFail = true; 
									requestError = 'Response from server: '+res.statusCode;
									node.status({fill: "red", shape: "dot", text: requestError});
									node.error(requestError, msg);
								}
							} else {
								node.status({fill: "red", shape: "dot", text: err.message});
								node.error(err.message, msg);
								//throw new Error('No body in response !');
							}
							//if(requestFail) throw new Error(requestError);
							node.send(msg);
						});	
					break;
					case '1':
						// POST
						realURL = this.url;
						connData.url = realURL; 
						var xml = msg.payload;						
						var postURL = this.url;
						switch (node.authconf.auth) {
							case '5':
								connData = {
										url: postURL, 
										username: node.authconf.user, 
										password: node.authconf.pass, 
										domain: node.authconf.doman, 
										workstation: '',
										body: xml,
										headers: { 'Content-Type': 'text/xml' }							
								}; 
							break;
							default: 
								connData = {url: realURL, body: xml, headers: { 'Content-Type': 'text/xml' }}; 
							break;
						}
							httpntlm.post(connData, function (err, res){
							node.status({});
								
							requestFail = false;
							requestError = '';

							if(res !== undefined && res.body !== undefined) {
								retValue = res.body;
								msg.payload = retValue;
								if(res.statusCode !== 200) { 
									requestFail = true; 
									requestError = 'Response from server: '+res.statusCode;
									/*
									if(retValue.indexOf('<faultstring>')>0){
										var addInfo = retValue.substring(retValue.indexOf('<faultstring>')+'<faultstring>'.length, retValue.indexOf('</faultstring>'));
										requestError += '\n'+ addInfo;
									}
									*/
									
									node.status({fill: "red", shape: "dot", text: requestError});
									node.error(requestError, msg);
								}
if(debug){
	fs.writeFile('POST_Result_'+node.name+'.json', JSON.stringify(res), function(){});	
	console.log(res);
	console.log(res.statusCode);
}
							} else {
								node.status({fill: "red", shape: "dot", text: err.message});
								node.error(err.message, msg);
if(debug){
	fs.writeFile('POST_Error_'+node.name+'.json', JSON.stringify(err), function(){});	
	console.log(err);
}	
								//throw new Error('No body in response !');
							}
							if(requestFail) {
								try {
									var convert = require('xml-js');
									var result = convert.xml2json(retValue, {compact: true, spaces: 4});
if(debug){
	fs.writeFile('POST_ErrorR_'+node.name+'.json', result, function(){});	
}
								} catch (err) {
									node.status({fill: "red", shape: "dot", text: err.message});
									node.error(err.message, msg);
								}	
							} 
							node.send(msg);
						});	
					break;
					default:
						node.status({fill: "red", shape: "dot", text: err.message});
						node.error('No method defined ! ['+postURL+']');
						//throw new Error('No method defined !');
					break;
				}
			});
        } catch (err) {
            node.status({fill: "red", shape: "dot", text: err.message});
            node.error(err.message, msg);
        }
    }
    RED.nodes.registerType("http-ntlm-req",HttpNtlmReqNode);
}
