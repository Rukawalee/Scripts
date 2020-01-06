auto.waitFor();
// 自定义组件
var appName = "com.taobao.taobao";
var home = "com.taobao.tao.TBMainActivity";
// 活动页面
var actPage = "com.taobao.browser.BrowserActivity";
// 结果页面
var view = "android.view.View";
// 主要布局
var frameLayout = "android.widget.FrameLayout";
// 主要图片控件
var img = "android.widget.Image";
// 活动入口
var actIn = "活动入口{className:" + frameLayout + ",depth:3,desc:,indexInParent:4,clickable:true";
// 首页淘第二层
var homeTaoSec = "首页淘二层{className:" + frameLayout + ",depth:4,desc:,indexInParent:0,clickable:true";
// 集福气
var collectBtn = "集福气{className:" + img + ",depth:16,desc:,indexInParent:10,clickable:true";
// 首页按钮
var homeBtn = "首页按钮{className:" + frameLayout + ",depth:3,desc:首页,indexInParent:0,clickable:true";
// 浇灌福气
var water = "浇灌福气{className:" + view + ",depth:16,desc:,indexInParent:11,clickable:true";
// 首页标题
var homeTitle = "首页{text:首页";
// 签到
var signBtn = "去签到{text:去签到";
// 浏览
var browseBtn = "去浏览{text:去浏览";
// 换装
var replacer = "去换装{text:去换装";
// 去兑换
var trade = "去兑换{text:去兑换";
// 突然事件
var suddenText = "突然事件{text:立即查看,text:立即收下,text:去集福气";
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
                case "首页按钮":
                    homeBtn = content;
                    break;
            }
        }
        toast("使用定制组件");
    } else {
        saveConf();
        toast("使用默认组件");
    }
}

function start(){
    log("启动中..");
    sleep(1500);
    log("设备：设置常亮");
    loadConf();
}

function loadApp(appName) {
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
    isHome();
}

function isHome() {
    if (currentActivity() == home) {
        let hBtn = parseComponent(homeBtn).selected(false);
        if (hBtn.exists()) {
            log("状态：进入主页主界面");
            hBtn.findOne().click();
            sleep(1000);
        }
        let hTitle = parseComponent(homeTitle);
        // 如果不存在就回到顶部
        if(!hTitle.exists()){
            parseComponent(homeTaoSec).findOne().click();
            sleep(500);
        }
        hTitle = hTitle.selected(false);
        // 判断是否是主界面首页
        if (hTitle.exists()) {
            log("状态：进入主界面首页");
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
            let kv = attrs[i].split(":");
            switch(kv[0]){
                case "depth":
                    obj.depth(kv[1]);
                    break;
                case "indexInParent":
                    obj.indexInParent(kv[1]);
                    break;
                case "desc":
                    kv[1] == "" ? "" : obj.desc(kv[1]);
                    break;
                case "clickable":
                    obj.clickable(kv[1] == "true");
                    break;
            }
        }
    }
    return obj;
}

function parseAction(tar){
    return tar.split("{")[0];
}

function dealSudden(tar){
    let sud = tar.split("{");
    let suddens = sud[1].split(",");
    for(let i = 0; i < suddens.length; i++){
        let obj = parseComponent("突然事件{" + suddens[i]);
        if(obj.exists()){
            log("处理突然事件：" + suddens[i].split(":")[1]);
            obj.findOne().click();
        }
    }
}

function goAct() {
    sleep(1000);
    log("状态：查找活动入口组件..");
    let activity = parseComponent(actIn).findOne(8000);
    if (!isValid(activity, "种福果")) {
        log("提示：请手动进入活动页面");
    } else {
        log("状态：进入活动页面中..");
    }
    var subThread = timeout(8000, currentActivity(), "组件{集福气}不可见，请手动进入活动页");
    parseComponent(collectBtn).waitFor();
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
        switch(parseAction(tar)){
            case "去换装":
                sleep(12000);
                back();
                break;
            case "去兑换":
                sleep(2000);
                break;
            default:
                wait(26, textContains("已获得"),
                        textContains("已达上限"),
                        textContains("任务完成"),
                        textContains("任务已完成"),
                        findComponent(view, "", "已获得", "", ""),
                        findComponent(view, "", "已达上限", "", ""),
                        findComponent(view, "", "任务完成", "", ""),
                        findComponent(view, "", "任务已完成", "", ""),
                        findComponent(view, "", "本店今日已领", "", ""));
                if(isHome()){
                    goAct();
                    beginTask();
                }
                break;
        }
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
            if (currentActivity() == actPage) {
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
    notify();
    exit();
}

function beginTask(){
    dealSudden(suddenText);
    let collectObj = parseComponent(collectBtn);
    if(collectObj.exists()){
        collectObj.findOne().click();
        log("打开活动页..");
        sleep(3000);
    }
}

function main() {
    start();
    if(currentActivity() != actPage){
        loadApp(appName);
        goHome(home);
        goAct();
    }
    beginTask();
    sign(signBtn);
    doTask(browseBtn);
    doTask(replacer);
    doTask(trade);
    over();
}

console.show();
main();