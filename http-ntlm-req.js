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

		var connData = {url: realURL, username: "", password: "", domain: "", workstation: ""}; 

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
							// fs.writeFile('Result_GET_'+node.name, res.body, function(){});	
							
							if (res.body !== undefined ) {
								retValue = res.body;
								msg.payload = retValue;
							} else {
								node.status({fill: "red", shape: "dot", text: err.message});
								node.error(err.message, msg);
							}
							
							node.send(msg);
							
						});	
					break;
					case '1':
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
							
							// 11,11,2019 if empty result - NR crashed
							httpntlm.post(connData, function (err, res){

							//fs.writeFile('Result_POST_'+node.name, res.body, function(){});	

							if (res.body !== undefined ) {
								retValue = res.body;
								msg.payload = retValue;
							} else {
								node.status({fill: "red", shape: "dot", text: err.message});
								node.error(err.message, msg);
							}
							
							/*
							try {
								var convert = require('xml-js');
								var result = convert.xml2json(retValue, {compact: true, spaces: 4});
							} catch (err) {
								node.status({fill: "red", shape: "dot", text: err.message});
								node.error(err.message, msg);
							}	
        					*/
							node.send(msg);
							
						});	
						
					break;
					default:
						node.error('No method defined ! ['+postURL+']');
						throw new Error('No method defined !');
					break;
				}
/*
				node.warn('2 retValue '+retValue); // EMPTY RESULT
				msg.payload = retValue;
				node.send(msg);
*/				
			});
        } catch (err) {
            node.status({fill: "red", shape: "dot", text: err.message});
            node.error(err.message, msg);
        }
    }
    RED.nodes.registerType("http-ntlm-req",HttpNtlmReqNode);
}
