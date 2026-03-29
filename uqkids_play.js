// 小小优趣 播放鉴权响应修改脚本
// 修改 coreapp/play/video|audio 接口响应中的预览限制字段
// previewDur=0 → 不限时; preview=0 → 非预览; paid=1 → 已购

let body = $response.body;
let obj;

try {
    obj = JSON.parse(body);
} catch (e) {
    $done({});
}

function patchPlay(o) {
    if (!o || typeof o !== "object") return;
    if ("previewDur"      in o) o.previewDur      = 0;
    if ("previewDuration" in o) o.previewDuration  = 0;
    if ("preview"         in o) o.preview          = 0;
    if ("paid"            in o) o.paid             = 1;
    if ("limitImmunit"    in o) o.limitImmunit     = 1;
    Object.keys(o).forEach(k => {
        if (o[k] && typeof o[k] === "object") patchPlay(o[k]);
    });
}

patchPlay(obj);

$done({ body: JSON.stringify(obj) });
