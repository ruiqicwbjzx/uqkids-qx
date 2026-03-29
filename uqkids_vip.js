// 小小优趣 (com.uyoung.uqkids) 共享 Token 脚本
// 原理：将所有发往 fastapi.ukids.cn 的请求中的 token 替换为 VIP 账号 token
// 服务器将按 VIP 账号返回真实会员数据
//
// ⚠️ 填入有效的 VIP 账号 token（登录后抓包 ucapp/getUser 请求的 token header）
const VIP_TOKEN = "NjZmNjcwMWM3ZjRhZWMxMDIwZjliZDliZTVjNzRjMzM0Nzg0MGU4MzBhNzlmZGEwZjY5ZDI1ZWIzODczZTI5ZmJjYzNmMjI2NGZmNzQxNjdmZDg2YWFhYzdiNGNlMDNl";

// ── 修改请求 header ──────────────────────────────────────────────────────────
let headers = $request.headers;

// 兼容大小写：token / Token / TOKEN
const tokenKey = Object.keys(headers).find(k => k.toLowerCase() === "token");

if (tokenKey) {
    headers[tokenKey] = VIP_TOKEN;
} else {
    // 不存在时直接注入
    headers["token"] = VIP_TOKEN;
}

$done({ headers });
