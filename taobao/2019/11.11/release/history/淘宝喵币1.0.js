var curr = "com.taobao.taobao";
var home = "com.taobao.tao.TBMainActivity";
var act = "android.widget.FrameLayout";
var view = "android.view.View";

function collectCoin(str) {
    var obj = textContains(str);
    if (obj.exists()) {
        log("状态：", "领取金币");
        log("渲染：", "0.5s");
        sleep(500);
        var rect = obj.findOne().bounds();
        log("准备：", "领取");
        click(rect.left, rect.top, rect.right, rect.bottom);
        log("渲染：", "2.5s");
        sleep(2500);
    }
}

function doTask(str) {
    collectCoin("上限");
    var obj = text(str);
    while (obj.exists()) {
        log("状态：" + str);
        obj.findOne().click();
        switch (str) {
            case "翻倍领取":
                toFind(view, "", "观看完成", "").waitFor();
                break;
            case "去浏览":
            case "去进店":
                while (true) {
                    log("状态：", "刷新时间2s");
                    sleep(2000);
                    if (textContains("任务完成").exists() ||
                        textContains("已获得").exists() ||
                        textContains("已达上限").exists() ||
                        toFind(view, "", "已获得", "").exists() ||
                        toFind(view, "", "任务完成", "").exists() ||
                        toFind(view, "", "已达上限", "").exists()) {
                        break;
                    }
                }
                if (currentActivity() == home) {
                    log("准备：", "重新进入活动页");
                    toAct(act);
                    toCollect();
                }
                break;
            default:
                sleep(22800);
                break;
        }
        toast("完成一个任务");
        back();
        sleep(2000);
        collectCoin();
    }
}

function sign(str) {
    var obj = text(str);
    while (obj.exists()) {
        log("状态：" + str);
        log("渲染：", "1s");
        sleep(1000);
        obj.findOne().click();
        if (str == "去签到") {
            tar = toFind(view, "", "马上签到", "");
            if (!tar.exists()) {
                tar = textContains("去完成");
                log("状态：", "目标任务请自行完成");
                notify();
                break;
            }
            tar.waitFor();
            tar.findOne().click();
            log("渲染：", "1.5s");
            sleep(1500);
            log("准备：", "返回活动界面");
            back();
        }
        log("状态：", "签到完成");
        log("渲染：", "3.5s");
        sleep(3500);
    }
}

function toCollect() {
    log("准备：", "翻倍金币获取");
    doTask("翻倍领取");
    log("准备：", "执行活动");
    toFind(view, 14, "", 5).findOne().click();
    log("渲染：", "3s");
    sleep(3000);
    log("准备：", "进行签到");
    sign("签到");
    log("准备：", "进行去浏览");
    doTask("去浏览");
    log("准备：", "进行去进店");
    doTask("去进店");
    log("准备：", "进行去签到");
    sign("去签到");
}

function loadApp(appName) {
    log("准备：", appName);
    sleep(1000);
    log("设备：", "设置长亮");
    device.keepScreenOn();
    log("运行：", appName);
    launch(appName);
    log("准备：", home);
    toHome(home);
}

function toHome(appHome) {
    log("渲染：", "1s");
    sleep(1000);
    while (currentActivity() != appHome) {
        log("状态：", "进入主界面中");
        back();
        log("渲染：", "2s");
        sleep(2000);
    }
    log("渲染：", "1s");
    sleep(1000);
}

function toAct(actIn) {
    log("准备：", actIn);
    log("渲染：", "1s");
    sleep(1000);
    log("渲染：", "进入活动界面中");
    toFind(actIn, 3, "", 2).findOne().click();
    log("状态：", "页面加载中");
    textContains("上限1").waitFor();
}

function notify() {
    log("设备：", "取消设备长亮");
    device.cancelKeepingAwake();
    log("状态：", "任务完成，等待通知");
    var times = 3;
    while (times-- > 1) {
        device.vibrate(30 + times * 6);
        sleep(128);
    }
    toast("任务已完成");
}

function toFind(cls, depth, desc, indexInParent) {
    log("准备：", cls);
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
    log("状态：", cls + "加载完成");
    return obj;
}

function main() {
    log("开发者：", "Rukawalee");
    log("状态：", "淘宝双11喵币自动完成通知提醒");
    sleep(3000); 
    log("Rukawa提醒：", "即将进入自动领取喵币");
    loadApp(curr);
    toAct(act);
    toCollect();
    notify();
    exit();
}
auto.waitFor();
console.show();
main();