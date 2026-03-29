// 小小优趣 (com.uyoung.uqkids) VIP 响应修改脚本
// 原理：修改 getUser/getUserSVip 响应，伪造 VIP 状态
// 不依赖外部 token，不影响自己账号登录
//
// checkProductDate: 内部会拼接 " 23:59:59"，所以这里只填日期
const VIP_EXPIRE = "2099-12-31";
const VIP_LEVEL  = 1;  // isVip 只判断 == 1

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
    Object.keys(o).forEach(k => {
        if (o[k] && typeof o[k] === "object") patchVip(o[k]);
    });
}

patchVip(obj);

$notify("UQKids VIP", $request.url, "✅ 脚本已运行");

$done({ body: JSON.stringify(obj) });
