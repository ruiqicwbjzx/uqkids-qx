// 小小优趣 (com.uyoung.uqkids) VIP 响应修改脚本
// 原理：保持自己的 token 不变，拦截服务器响应并将 vip 字段改为 SVIP
// 不影响登录状态

const VIP_EXPIRE = "2099-12-31 23:59:59";
const VIP_LEVEL  = 2; // 0=无 1=VIP 2=SVIP

let body = $response.body;
let obj;

try {
    obj = JSON.parse(body);
} catch (e) {
    $done({});
}

function patchVip(o) {
    if (!o || typeof o !== "object") return;
    if ("vip"        in o) o.vip        = VIP_LEVEL;
    if ("svip"       in o) o.svip       = VIP_LEVEL;
    if ("vipEnd"     in o) o.vipEnd     = VIP_EXPIRE;
    if ("svipEnd"    in o) o.svipEnd    = VIP_EXPIRE;
    if ("vipEndTime" in o) o.vipEndTime = VIP_EXPIRE;
    if ("isVip"      in o) o.isVip      = 1;
    if ("paid"       in o) o.paid       = 0;
    Object.keys(o).forEach(k => {
        if (o[k] && typeof o[k] === "object") patchVip(o[k]);
    });
}

if (obj && obj.data) patchVip(obj.data);

$done({ body: JSON.stringify(obj) });
