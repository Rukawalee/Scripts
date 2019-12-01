var curr = "com.taobao.taobao";
var home = "com.taobao.tao.TBMainActivity";
var act = "android.widget.FrameLayout";
var view = "android.view.View";

function collectCoin(str) {
    var obj = textContains(str);
    if (obj.exists()) {
        log("状态：领取金币");
        log("等待：0.5s");
        sleep(500);
        var rect = obj.findOne().bounds();
        click(rect.left, rect.top, rect.right, rect.bottom);
        log("状态：已经领取");
        sudden(text("开心收下"));
        sleep(1000);
    }
}

function sudden(obj) {
    log("等待：2s");
    sleep(2000);
    if (obj.exists()) {
        log("状态：意外情况，进行处理");
        obj.findOne().click();
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
                    log("状态：刷新时间2s");
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
                signTo(toFind(view, "", "签到领喵币", ""));
                isHome();
                break;
            default:
                sleep(22800);
                break;
        }
        log("提示：如果页面快速跳转，请手动切换下一个任务");
        toast("完成一个任务");
        back();
        sleep(3000);
        collectCoin();
    }
}

function signTo(obj) {
    if (obj.exists()) {
        log("状态：签到领喵币");
        var rect = obj.findOne().bounds();
        click(rect.left, rect.top, rect.right, rect.bottom);
        sleep(2000);
    }
}

function isHome() {
    if (currentActivity() == home) {
        log("准备：重新进入活动页");
        toAct(act);
    }
}

function sign(str) {
    var obj = text(str);
    while (obj.exists()) {
        log("状态：" + str);
        log("等待：1s");
        sleep(1000);
        obj.findOne().click();
        if (str == "去签到") {
            sleep(5000);
            tar = toFind(view, "", "马上签到", "");
            if (!tar.exists()) {
                tar = textContains("去完成");
                log("状态：目标任务请手动完成");
                notify();
                break;
            }
            tar.waitFor();
            tar.findOne().click();
            log("等待：1.5s");
            sleep(1500);
            log("准备：返回活动界面");
            back();
        }
        log("状态：签到完成");
        log("等待：3.5s");
        sleep(3500);
    }
}

function toCollect() {
    log("准备：翻倍金币获取");
    doTask("翻倍领取");
    log("准备：进行活动任务");
    toFind(view, 14, "", 5).findOne().click();
    log("等待：3s");
    sleep(3000);
    log("准备：进行签到");
    sign("签到");
    log("准备：进行去浏览");
    doTask("去浏览");
    log("准备：进行去进店");
    doTask("去进店");
    log("准备：进行去签到");
    sign("去签到");
}

function loadApp(appName) {
    log("准备：" + appName);
    sleep(1000);
    log("设备：设置长亮");
    device.keepScreenOn();
    log("运行：" + appName);
    launch(appName);
    log("准备：" + home);
    toHome(home);
}

function toHome(appHome) {
    log("等待：1s");
    sleep(1000);
    while (currentActivity() != appHome) {
        log("状态：进入主界面中");
        back();
        log("等待：2s");
        sleep(2000);
    }
    toAct(act);
}

function timeout(time, active) {
    var id = setInterval(function() {
        if (currentActivity() == active) {
            log("等待超时，请手动进入活动界面");
        }
        clearInterval(id);
    }, time);
}

function toAct(actIn) {
    log("准备：" + actIn);
    sleep(1000);
    log("状态：进入活动界面中");
    timeout(8000, currentActivity());
    toFind(actIn, 3, "", 2).findOne().click();
    log("状态：活动控件加载完成");
    log("状态：活动页面加载中");
	timeout(8000, currentActivity());
    textContains("上限").waitFor();
    log("状态：已进入活动页面");
    toCollect();
}

function notify() {
    log("设备：", "取消设备长亮");
    device.cancelKeepingAwake();
    log("状态：任务完成，发出通知");
    var times = 3;
    while (times-- > 1) {
        device.vibrate(30 + times * 6);
        sleep(128);
    }
    toast("任务已完成");
    log("提示：出现此通知表示完成任务" +
        "如果任务未完成，可多次尝试，" +
        "如果多次尝试后仍然出现表示不兼容");
}

function toFind(cls, depth, desc, indexInParent) {
    log("准备：类" + cls);
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
    log("状态：类" + cls + "加载完成");
    return obj;
}

function main() {
    log("开发者：Rukawalee");
    log("淘宝双11喵币自动完成通知提醒");
    sleep(3000);
    log("提醒：即将进入自动领取喵币");
    loadApp(curr);
    notify();
    exit();
}
auto.waitFor();
console.show();
main();