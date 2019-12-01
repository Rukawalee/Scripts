var curr = "com.taobao.taobao";
var home = "com.taobao.tao.TBMainActivity";
var act = "android.widget.FrameLayout";
var view = "android.view.View";
var btn = "android.widget.Button";

function collectCoin(str) {
    var obj = textContains(str);
    if (obj.exists()) {
        log("状态：领取金币");
        log("状态：活动耗时0.5s");
        sleep(500);
        var rect = obj.findOne().bounds();
        click(rect.left, rect.top, rect.right, rect.bottom);
        log("状态：金币领取成功");
        sudden(text("开心收下"));
        sleep(1000);
    }
}

function sudden(obj) {
    log("状态：活动耗时2s");
    sleep(2000);
    if (obj.exists()) {
        log("状态：意外情况，已自动处理");
        obj.findOne().click();
    }
}

function doTask(str) {
    var obj = text(str);
    while (obj.exists()) {
        log("状态：执行任务" + str);
        obj.findOne().click();
        switch (str) {
            case "翻倍领取":
                toFind(view, "", "观看完成", "").waitFor();
                break;
            case "去浏览":
            case "去进店":
                var limit = 28;
                log("状态：预计完成任务需：" + limit + "s")
                while (true) {
                    sleep(2000);
                    limit -= 2;
                    log("状态：活动耗时2s，预计还需" + limit + "s");
                    if (limit <= 0 ||
                        textContains("任务完成").exists() ||
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
        log("提示：如页面快速跳转，请手动切换任务");
        toast("完成一个任务");
        back();
        sleep(3000);
        collectCoin();
    }
}

function dob() {
    collectCoin("上限");
    sleep(1000);
    if (text("翻倍领取").exists()) {
        log("准备：执行任务翻倍领取");
        doTask("翻倍领取");
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
        scrollUp();
        sleep(1000);
        toAct(act);
    }
}

function sign(str) {
    var obj = text(str);
    while (obj.exists()) {
        log("状态：执行任务" + str);
        log("状态：活动耗时1s");
        sleep(1000);
        obj.findOne().click();
        if (str == "去签到") {
            sleep(8000);
            tar = toFind(view, "", "马上签到", "");
            if (!tar.exists()) {
                tar = textContains("去完成");
                log("提示：目标任务请手动完成");
                notify();
                break;
            }
            tar.waitFor();
            tar.findOne().click();
            log("状态：活动耗时1.5s");
            sleep(1500);
            log("准备：返回至活动界面");
            back();
        }
        log("状态：签到完成");
        log("状态：活动耗时3.5s");
        sleep(3500);
    }
}

function toCollect() {
    dob();
    log("准备：进行活动任务");
    toFind(btn, 14, "", 5).findOne().click();
    log("状态：活动耗时3s");
    sleep(3000);
    log("准备：执行任务签到");
    sign("签到");
    dob();
    log("准备：执行任务去浏览");
    doTask("去浏览");
    dob();
    log("准备：执行任务去进店");
    doTask("去进店");
    dob();
    log("准备：执行任务去签到");
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
    log("状态：活动耗时1s");
    sleep(1000);
    while (currentActivity() != appHome) {
        log("状态：进入主界面中");
        back();
        log("状态：活动耗时2s");
        sleep(2000);
    }
    toAct(act);
}

function timeout(time, active) {
    return threads.start(function() {
        var id = setInterval(function() {
            if (currentActivity() == active) {
                log("等待超时，请手动点击{双11合伙人}活动界面");
                notify();
            } else {
                clearInterval(id);
            }
        }, time);
    });
}

function toAct(actIn) {
    log("准备：" + actIn);
    sleep(1000);
    log("状态：进入活动界面中");
    var subThread = timeout(8000, currentActivity());
    toFind(actIn, 3, "", 1).findOne().click();
    subThread.interrupt();
    log("状态：活动入口加载完成");
    log("状态：活动页面加载中");
    subThread = timeout(8000, currentActivity());
    textContains("上限").waitFor();
    subThread.interrupt();
    log("状态：已进入活动页面");
    toCollect();
}

function notify() {
    var times = 3;
    while (times-- > 1) {
        device.vibrate(30 + times * 6);
        sleep(128);
    }
}

function over() {
    log("设备：", "取消设备长亮");
    device.cancelKeepingAwake();
    log("状态：任务完成，震动通知");
    toast("任务已完成");
    log("提示：出现此通知表示完成任务" +
        "如果任务未完成，可多次尝试，" +
        "如果多次尝试后仍然出现表示不兼容");
}


function toFind(cls, depth, desc, indexInParent) {
    var obj = className(cls).clickable(true);
    if (depth != "") {
        obj = obj.depth(depth);
    }
    if (desc != "") {
        obj = obj.descContains(desc);
    }
    if (indexInParent != "") {
        obj = obj.indexInParent(indexInParent);
    }
    return obj;
}

function main() {
    log("Rukawalee");
    log("淘宝喵币自动完成通知");
    sleep(2000);
    log("提醒：即将自动领取喵币");
    loadApp(curr);
    notify();
    over();
    exit();
}
auto.waitFor();
console.show();
main();