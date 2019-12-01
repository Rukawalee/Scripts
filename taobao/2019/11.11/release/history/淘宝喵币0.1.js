//手机淘宝双11刷喵铺 
//兼容安卓6.0 1080*1920屏
//做了一部分优化，添加任务完成通知
auto.waitFor();
var height = device.height;
var width = device.width;
toast("\n设备宽" + width + "\n" + "设备高" + height + "\n" + "手机型号" + device.model + "\n安卓版本" + device.release);
if (height == 1920) { //设置屏幕高度
    setScreenMetrics(1080, 1920);
} else if (height == 2340) {
    setScreenMetrics(1080, 2340);
} else if (height == 2160) {
    setScreenMetrics(1080, 2160);
}
device.keepScreenOn();
work();
//开始工作
function work() {
    app.launchApp("手机淘宝");
    toast("打开淘宝");
    sleep(8700);
    toast("准备进入活动页");
    click(540, 1165, 1054, 1436); //进入活动页
    sleep(12800);
    toast("准备进行任务");
    click(808, 1592, 1025, 1817)
    sleep(4000);
    sign("签到");
    go("去浏览");
    go("去进店");
    sign("去签到");
    device.cancelKeepingAwake();
    notify();
}
//执行签到
function sign(str) {
    var obj = text(str);
    while (obj.exists()) {
        toast("准备" + str);
        sleep(2500);
        obj.findOne().click();
        if (str == "去签到") {
            sleep(8000);
            click(689,1666,916,1735);
            back();
        }
        toast("签到成功");
        sleep(2500);
    }
}
//执行任务
function go(str) {
    var obj = text(str);
    while (obj.exists()) {
        obj.findOne().click();
        toast("准备" + str);
        //等待任务时间
        sleep(22800);
        toast("完成一个任务");
        back();
        sleep(2500);
    }
}
//执行通知
function notify() {
    var times = 3;
    while (times-- > 1) {
        device.vibrate(30 + times * 6);
        sleep(128);
    }
    toast("任务完成！");
}