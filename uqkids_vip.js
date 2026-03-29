// 小小优趣 (com.uyoung.uqkids) 精准 Token 替换脚本
// 原理：仅在 getUser / getUserSVip / user/attr 请求中替换 token header
// 服务器返回会员账号的真实 VIP 数据，不影响自己账号的登录状态
//
// ⚠️ VIP 账号 token（抓包获取）
const VIP_TOKEN = "NjZmNjcwMWM3ZjRhZWMxMDIwZjliZDliZTVjNzRjMzM0Nzg0MGU4MzBhNzlmZGEwZjY5ZDI1ZWIzODczZTI5ZmJjYzNmMjI2NGZmNzQxNjdmZDg2YWFhYzdiNGNlMDNl";

let headers = $request.headers;

// 兼容大小写：token / Token / TOKEN
const key = Object.keys(headers).find(k => k.toLowerCase() === "token");
if (key) {
    headers[key] = VIP_TOKEN;
} else {
    headers["token"] = VIP_TOKEN;
}

$done({ headers });
