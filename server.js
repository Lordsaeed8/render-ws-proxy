js

import http from "http";
import httpProxy from "http-proxy";

const VPS_HOST = "142.93.234.167";
const VPS_PORT = 59199;
const WS_PATH = "/api/v1/content";

const proxy = httpProxy.createProxyServer({
  target: 'http://${VPS_HOST}:${VPS_PORT}',
  ws: true,
  changeOrigin: true
});

const server = http.createServer((req, res) => {
  if (!req.url.startsWith(WS_PATH)) {
    res.writeHead(200, {Content-Type": "text/plain"});
    res.end("OK");
    return;
  }

  proxy.web(req, res);
});

server.on("upgrade", (req, socket, head) => {
  if(!req.url.startsWith(WS_PATH)) {
    socket.destroy();
    return;
  }
  proxy.ws(req, socket, head);
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, "0.0.0.0", () => {
  console.log('Proxy listening on ${PORT}, forwarding WS ${WS_PATH} to http://${VPS_HOST}:${VPS_PORT}');
});
