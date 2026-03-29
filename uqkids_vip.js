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
    // 用户信息字段
    if ("vip"             in o) o.vip             = VIP_LEVEL;
    if ("svip"            in o) o.svip            = VIP_LEVEL;
    if ("vipEnd"          in o) o.vipEnd          = VIP_EXPIRE;
    if ("svipEnd"         in o) o.svipEnd         = VIP_EXPIRE;
    if ("vipEndTime"      in o) o.vipEndTime      = VIP_EXPIRE;
    if ("isVip"           in o) o.isVip           = 1;
    // 播放鉴权字段（previewDur=0 解除30s限制）
    if ("previewDur"      in o) o.previewDur      = 999999;
    if ("previewDuration" in o) o.previewDuration = 999999;
    if ("preview"         in o) o.preview         = 0;
    if ("paid"            in o) o.paid            = 1;
    if ("limitImmunit"    in o) o.limitImmunit    = 1;
    Object.keys(o).forEach(k => {
        if (o[k] && typeof o[k] === "object") patchVip(o[k]);
    });
}

// 记录 play 相关字段用于调试
let debugInfo = "";
function findPreviewFields(o, path) {
    if (!o || typeof o !== "object") return;
    ["previewDur","previewDuration","preview","paid","limitImmunit"].forEach(k => {
        if (k in o) debugInfo += path + "." + k + "=" + o[k] + " ";
    });
    Object.keys(o).forEach(k => {
        if (o[k] && typeof o[k] === "object") findPreviewFields(o[k], path + "." + k);
    });
}

const url = $request.url;
if (url.indexOf("coreapp/play") !== -1 || url.indexOf("getUser") !== -1) {
    findPreviewFields(obj, "");
    $notify("UQKids", url.split("/").slice(-2).join("/"), debugInfo || "无预览字段");
}

patchVip(obj);

$done({ body: JSON.stringify(obj) });
