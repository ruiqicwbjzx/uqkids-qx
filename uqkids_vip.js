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

// 移除 CDN URL 中的 end= 时间限制（playUrl 是 base64 编码的 CDN URL）
function removeEndParam(b64) {
    if (!b64 || typeof b64 !== "string") return b64;
    try {
        let decoded = atob(b64);
        if (decoded.indexOf("end=") === -1) return b64;
        const before = decoded;
        // 移除 &end=xxx 或 ?end=xxx
        decoded = decoded.replace(/&end=\d+/g, "").replace(/\?end=\d+&/g, "?").replace(/\?end=\d+$/g, "");
        if (decoded === before) return b64;
        const patched = btoa(decoded);
        $notify("UQKids CDN", "end= 已移除", before.substring(before.indexOf("end="), before.indexOf("end=") + 12));
        return patched;
    } catch(e) {
        return b64;
    }
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
    // CDN playUrl 移除 end= 时间限制
    if ("playUrl"         in o && o.playUrl) o.playUrl = removeEndParam(o.playUrl);
    // 播放鉴权字段
    if ("previewDur"      in o) o.previewDur      = 999999;
    if ("previewDuration" in o) o.previewDuration = 999999;
    if ("preview"         in o) o.preview         = 0;
    if ("paid"            in o) o.paid            = 1;
    if ("limitImmunit"    in o) o.limitImmunit    = 1;
    Object.keys(o).forEach(k => {
        if (o[k] && typeof o[k] === "object") patchVip(o[k]);
    });
}

patchVip(obj);

$done({ body: JSON.stringify(obj) });
