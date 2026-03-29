// 小小优趣 播放接口 Token 替换脚本
// 仅用于 coreapp/play/ 请求，服务端返回完整内容 URL（非30s预览）
const VIP_TOKEN = "NjZmNjcwMWM3ZjRhZWMxMDIwZjliZDliZTVjNzRjMzM0Nzg0MGU4MzBhNzlmZGEwZjY5ZDI1ZWIzODczZTI5ZmJjYzNmMjI2NGZmNzQxNjdmZDg2YWFhYzdiNGNlMDNl";

let headers = $request.headers;
const key = Object.keys(headers).find(k => k.toLowerCase() === "token");
if (key) {
    headers[key] = VIP_TOKEN;
} else {
    headers["token"] = VIP_TOKEN;
}

$done({ headers });
