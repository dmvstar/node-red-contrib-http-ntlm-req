module.exports = function (RED) {
    function HttpNtlmReqConfig(n) {
        RED.nodes.createNode(this, n);
        this.user = n.user;
        this.pass = n.pass;
        this.doman = n.doman;
    }

    RED.nodes.registerType("http-ntlm-req-config", HttpNtlmReqConfig);
}