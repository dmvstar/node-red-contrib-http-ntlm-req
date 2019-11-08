module.exports = function (RED) {
    function HttpNtlmReqConfig(n) {
        RED.nodes.createNode(this, n);
        this.auth = n.auth;
        this.user = n.user;
        this.pass = n.pass;
        this.key = n.key;
        this.cert = n.cert;
        this.token = n.token;
        this.doman = n.doman;
    }
    RED.nodes.registerType("http-ntlm-req-config", HttpNtlmReqConfig);
}