// 小小优趣 (com.uyoung.uqkids) 全局 Token 替换脚本
// 原理：所有 *.ukids.cn 请求替换 token，登录/注册/短信等认证路径跳过
//
// ⚠️ VIP 账号 token（抓包获取）
const VIP_TOKEN = "NjZmNjcwMWM3ZjRhZWMxMDIwZjliZDliZTVjNzRjMzM0Nzg0MGU4MzBhNzlmZGEwZjY5ZDI1ZWIzODczZTI5ZmJjYzNmMjI2NGZmNzQxNjdmZDg2YWFhYzdiNGNlMDNl";

// 跳过登录 / 注册 / 短信 / token刷新 等认证路径，避免影响自己账号登录
const SKIP_PATTERNS = [
    /login/i, /logout/i, /register/i, /sms/i, /verif/i,
    /captcha/i, /refresh.*token/i, /token.*refresh/i, /auth/i
];

const url = $request.url;
if (SKIP_PATTERNS.some(p => p.test(url))) {
    $done({});
}

let headers = $request.headers;

// 兼容大小写：token / Token / TOKEN
const key = Object.keys(headers).find(k => k.toLowerCase() === "token");
if (key) {
    headers[key] = VIP_TOKEN;
} else {
    headers["token"] = VIP_TOKEN;
}

$done({ headers });
