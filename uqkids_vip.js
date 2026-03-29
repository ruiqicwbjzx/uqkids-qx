// 小小优趣 (com.uyoung.uqkids) VIP 响应修改脚本
// 原理：保持自己的 token 不变，拦截服务器响应并将 vip 字段改为 SVIP
// 不影响登录状态

const VIP_EXPIRE = "2099-12-31 23:59:59";
// isVip 逻辑: user.vip.intValue == 1 才返回 true，设 2 不生效
const VIP_LEVEL  = 1;

let body = $response.body;
let obj;

try {
    obj = JSON.parse(body);
} catch (e) {
    // 非 JSON 响应直接放行
    $done({});
}

let patched = false;

function patchVip(o) {
    if (!o || typeof o !== "object") return;
    if ("vip"        in o) { o.vip        = VIP_LEVEL; patched = true; }
    if ("svip"       in o) { o.svip       = VIP_LEVEL; patched = true; }
    if ("vipEnd"     in o) { o.vipEnd     = VIP_EXPIRE; patched = true; }
    if ("svipEnd"    in o) { o.svipEnd    = VIP_EXPIRE; patched = true; }
    if ("vipEndTime" in o) { o.vipEndTime = VIP_EXPIRE; patched = true; }
    if ("isVip"      in o) { o.isVip      = 1;          patched = true; }
    Object.keys(o).forEach(k => {
        if (o[k] && typeof o[k] === "object") patchVip(o[k]);
    });
}

patchVip(obj);

// 调试通知：显示命中的 URL 和是否有 vip 字段被修改
$notify("UQKids VIP", $request.url, patched ? "✅ vip 字段已修改" : "⚠️ 未发现 vip 字段，原样放行");

$done({ body: JSON.stringify(obj) });
