auto.waitFor();
// 自定义组件
var appName = "com.taobao.taobao";
var home = "com.taobao.tao.TBMainActivity";
// 活动页面
var actPage = "com.taobao.browser.BrowserActivity";
// 结果页面
var view = "android.view.View";
// 活动入口
var actIn = "活动入口{className:android.widget.FrameLayout,depth:11,desc:,indexInParent:8,clickable:false";
// 首页淘第二层
var homeTaoSec = "首页淘二层{className:android.widget.FrameLayout,depth:9,desc:,indexInparent:0,clickable:true";
// 集福气
var collectBtn = "集福气{className:android.widget.Image,depth:20,desc:,indexInparent:8,clickable:true";
// 首页标题
var homeTitle = "首页{text:首页";
// 签到
var signBtn = "去签到{text:去签到";
// 浏览
var browseBtn = "去浏览{text:去浏览";
// 配置文件路径
var confFile = files.getSdcardPath() + "/Conf定制/" + device.model + "_" + device.release + ".conf";

function saveConf() {
    files.ensureDir(confFile);
    let writer = open(confFile, "w", "utf-8");
    writer.writeline(actIn);
    writer.writeline(homeTaoSec);
    writer.writeline(collectBtn);
    writer.flush();
    writer.close();
    toast("定制信息保存至" + confFile);
}

function loadConf() {
    if (files.exists(confFile)) {
        let reader = open(confFile, "r", "utf-8");
        let content = "";
        while ((content = reader.readline()) != null) {
            let vals = content.split("{");
            switch(vals[0]){
                case "活动入口":
                    actIn = content;
                    break;
                case "首页淘二层":
                    homtTaoSec = content;
                    break;
                case "集福气":
                    collectBtn = content;
                    break;
            }
        }
        toast("使用定制组件");
    } else {
        saveConf();
        toast("使用默认组件");
    }
}

function loadApp(appName) {
    log("启动中..");
    sleep(1500);
    log("设备：设置常亮");
    device.keepScreenOn();
    log("运行：手机淘宝");
    launch(appName);
    log("准备：手机淘宝主界面..");
    goHome(home);
}

function goHome(appHome) {
    sleep(1500);
    while (currentActivity() != appHome) {
        log("状态：进入主界面中..");
        back();
        sleep(2500);
    }
    // isHome();
}

function isHome() {
    if (currentActivity() == home) {
        let hBtn = parseComponent(homeBtn).selected(false);
        if (hBtn.exists()) {
            log("状态：进入主页首页");
            hBtn.findOne().click();
            sleep(1000);
        }
        var hTitle = text("首页").selected(false);
        if (hTitle.exists()) {
            log("状态：进入首页主页");
            hTitle.findOne().click();
            sleep(500);
        }
        return true;
    }
    return false;
}

function parseComponent(str){
    let component = str.split("{");
    log("解析组件：" + component[0]);
    let attrs = component[1].split(",");
    let attr = attrs[0].split(":");
    // 判断是否为文本信息
    let obj = null;
    if("text" == attr[0]){
        obj = textContains(attr[1]);
    } else {
        obj = className(attr[1]);
        for (let i = 1; i < attrs.length; i++) {
            const kv = attrs[i].split(":");
            obj.parseMap(kv[0], kv[1]);
        }
    }
    return obj;
}

function parseMap(str1, str2){
    switch(str1){
        case "depth":
            return depth(str2);
        case "indexInParent":
            return indexInParent(str2);
        case "desc":
            return desc(str2);
        case "clickable":
            return clickable(str2 == "true");
    }
}

function goAct() {
    sleep(1500);
    log("状态：查找活动入口组件..");
    var actIn = findComponent(actCom, actDepth, "", actIndexInParent, true).findOne(8000);
    if (!isValid(actIn, "双11合伙人")) {
        log("提示：请手动进入活动页面");
    } else {
        log("状态：进入活动页面中..");
        log("提示：如进错页面，请检查组件");
    }
    var subThread = timeout(8000, currentActivity(), "组件{上限}不可见，请手动进入活动页");
    textContains("上限").waitFor();
    subThread.interrupt();
    log("状态：已进入活动页面");
}

function findComponent(cls, depth, desc, indexInParent, clickable) {
    var obj = className(cls);
    if (depth != "") {
        obj = obj.depth(depth);
    }
    if (desc != "") {
        obj = obj.descContains(desc);
    }
    if (indexInParent != "") {
        obj = obj.indexInParent(indexInParent);
    }
    if (clickable != "") {
        obj = obj.clickable(clickable);
    }
    return obj;
}

function doTask(tar) {
    var obj = parseComponent(tar);
    while (obj.exists()) {
        obj.findOne().click();
        wait(26, textContains("已获得"),
                textContains("已达上限"),
                textContains("任务完成"),
                textContains("任务已完成"),
                findComponent(view, "", "已获得", "", ""),
                findComponent(view, "", "已达上限", "", ""),
                findComponent(view, "", "任务完成", "", ""),
                findComponent(view, "", "任务已完成", "", ""));
        log("状态：完成一个任务");
        if (currentActivity() != actPage) {
            back();
            log("状态：缓冲耗时3s");
            sleep(3000);
        }
    }
}

function sign(tar) {
    var obj = parseComponent(tar);
    while (obj.exists()) {
        sleep(1000);
        obj.findOne().click();
        log("状态：完成签到");
        sleep(3000);
    }
}

function rectClick(obj) {
    click(obj.left, obj.top, obj.right, obj.bottom);
}

function wait(limit) {
    log("状态：预估任务完成" + limit + "s");
    var condition = true;
    while (limit > 0 && condition) {
        sleep(2000);
        limit -= 2;
        for (var i = 1; i < arguments.length; i++) {
            if (arguments[i].exists()) {
                condition = false;
                break;
            }
        }
        log("状态：活动耗时2s，预估还需" + limit + "s");
    }
}

function isValid(component, info) {
    if (component == null) {
        log("提示：{" + info + "}组件已失效，请重新定制");
        notify();
        return false;
    } else {
        component.click();
    }
    return true;
}

function timeout(limit, active, tip) {
    return threads.start(function() {
        var id = setInterval(function() {
            if (currentActivity() == active) {
                log("等待超时，" + tip);
                notify();
            } else {
                clearInterval(id);
            }
        }, limit)
    });
}

function notify() {
    var times = 3;
    while (times-- > 1) {
        device.vibrate(30 + times * 6);
        sleep(128);
    }
}

function over() {
    log("设备：取消常亮");
    device.cancelKeepingAwake();
    log("提示：如任务未完成，请多次尝试！");
    exit();
}

function main() {
    log("设备：设置常亮");
    device.keepScreenOn();
    sign(signBtn);
    doTask(browseBtn);
    over();
}

console.show();
main();