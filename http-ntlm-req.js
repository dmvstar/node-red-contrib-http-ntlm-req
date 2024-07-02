module.exports = function (RED) {
	function HttpNtlmReqNode(config) {
		var httpntlm = require('httpntlm');

		RED.nodes.createNode(this, config);
		const node = this;

		const resetStatus = () => node.status({});
		const raiseError = (text, msg) => {
			node.status({ fill: "red", shape: "dot", text: text });
			node.error(text, msg);
		};

		node.name = config.name;
		node.url = config.url;
		node.method = config.method;
		node.authconf = RED.nodes.getNode(config.auth);

		resetStatus();

		node.on('input', function (msg) {
			const requestCallback = (err, res) => {
				resetStatus();
				//console.log("[requestCallback]", res)
				if (res !== undefined && res.body !== undefined) {
					//msg.payload = JSON.parse(res.body);
					msg.payload = res.body;
					msg.headers = res.headers || {}; // return headers
					if (res.statusCode >= 400) {
						raiseError('Response from server: ' + res.statusCode, msg);
					}
				} else {
					raiseError(err.message, msg);
				}

				node.send(msg);
			};

			var params = (typeof msg.params === 'undefined') ? "" : msg.params;
			var url = (typeof msg.url === 'undefined') ? node.url : msg.url;

			const connData = {
				username: node.authconf.user,
				password: node.authconf.pass,
				domain: node.authconf.doman,
				workstation: '',
				headers: (typeof msg.headers === 'undefined') ? {} : msg.headers
			};

			switch (parseInt(node.method)) {
				case 0: // GET
					{
						connData.url = url + params;
						httpntlm.get(connData, requestCallback);
						break;
					}
				case 1: // POST
					{
						connData.url = url + params;
						if (msg.payload !== undefined) {
							//console.log(msg.payload);
							//connData.body =  JSON.stringify(msg.payload);
							connData.body = (typeof msg.payload === 'object') ? JSON.stringify(msg.payload) : msg.payload;							
							connData.headers['Content-Type'] = (typeof connData.headers['Content-Type'] === 'undefined') ? 'application/json' : connData.headers['Content-Type'];
						}
						httpntlm.post(connData, requestCallback);
						break;
					}
				case 2: // PUT
					{
						connData.url = url + params;
						if (msg.payload !== undefined) {
							//connData.body = JSON.stringify(msg.payload);
							connData.body = (typeof msg.payload === 'object') ? JSON.stringify(msg.payload) : msg.payload;
							connData.headers['Content-Type'] = (typeof connData.headers['Content-Type'] === 'undefined') ? 'application/json' : connData.headers['Content-Type'];
						}
						httpntlm.put(connData, requestCallback);
						break;
					}
				default:
					{
						raiseError('No method defined!', msg);
						break;
					}
			}
		});
	}

	RED.nodes.registerType("http-ntlm-req", HttpNtlmReqNode);
}
