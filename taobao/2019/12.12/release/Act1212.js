auto.waitFor();
var appName = "com.taobao.taobao";
var appHome = "com.taobao.tao.TBMainActivity";
//定义活动组件
var act = "android.widget.FrameLayout,3,2,true"
var actView = "android.view.View";
var actHome = "com.taobao.browser.BrowserActivity";
//定义首页按钮
var homeClassName = "android.widget.FrameLayout";
var homeImageView = "android.widget.ImageView";
var home = homeClassName + ",4,0,true";
//定义conf文件路径
var confFile = files.getSdcardPath() + "/conf定制/" + device.device + "_" + device.release + ".conf";
//淘宝贝
var buyGoods = "340,1460,760,1700";
//找能量
var findEng = "300,1360,760,1420";

function loadConf(){
    log("执行：加载配置文件");
    if(!files.exists(confFile)){
        files.ensureDir(confFile);
        writeConf();
    }
    readConf();
    log("状态：加载配置完成")
}

function writeConf(){
    log("执行：写入配置文件");
    var writer = open(confFile, "w", "utf-8");
    writer.writeline("活动组件:" + act);
    writer.writeline("首页按钮:" + home);
    writer.writeline("淘宝贝:" + 340 + "," + 1460 + "," + 760 + "," + 1700);
    writer.writeline("找能量:" + 300 + "," + 1360 + "," + 760 + "," + 1420);
    writer.close();
}

function readConf(){
    log("执行：读取配置文件");
    var reader = open(confFile, "r", "utf-8");
    var line = null;
    while((line = reader.readline()) != null){
        var vals = line.split(":");
        switch(vals[0]){
            case "活动组件":
                act = vals[1];
                break;
            case "首页按钮":
                home = vals[1]
                break;
            case "淘宝贝":
                buyGoods = vals[1];
                break;
            case "找能量":
                findEng = vals[1];
                break;
            default:
                break;
        }
    }
    reader.close();
}

function parse(str){
    return str.split(",");
}

function loadApp(){
    log("Rukawalee-1212");
    sleep(2000);
    log("执行：设备设置长亮");
    device.keepScreenOn();
    launch(appName);
}

function goHome(){
    log("执行：进入首页");
    sleep(1500);
    while(currentActivity() != appHome){
        log("执行：进入主界面");
        back();
        sleep(2500);
    }
    isHome();
}

function isHome(){
    if(currentActivity() == appHome){
        //进入主界面
        var hBtn = className(homeClassName).desc("首页").selected(false);
        if(hBtn.exists()){
            log("执行：进入主页");
            hBtn.findOne().click();
            sleep(1500);
        }
        //进入活动主界面
        var hBtn2 = text("首页").selected(false);
        if(hBtn2.exists()){
            log("执行：进入页面主页");
            hBtn2.findOne().click();
            sleep(1500);
        }
        //确保正确的主界面
        var hBtn3 = findComponent(parse(home));
        var hBtn4 = className(homeImageView).desc("跳转到首页");
        if(hBtn4.exists()){
            log("执行：进入主页活动入口");
            hBtn3.findOne().click();
            sleep(1500);
        }
        return true;
    }
    return false;
}

function findComponent(vals){
    var tarClassName = vals[0];
    var tarDepth = vals[1];
    var tarIndexInParent =vals[2];
    var tarClickable = vals[3] == 'true';
    return className(tarClassName).depth(tarDepth).indexInParent(tarIndexInParent).clickable(tarClickable);
}

function goAct(){
    log("执行：查找活动入口");
    var actIn = findComponent(parse(act));
    if(actIn.exists()){
        actIn.findOne().click();
    }
    //3秒钟检测是否进入活动页面
    var id = setInterval(function (){
        log("状态：正在进入活动页");
        rectClick(parse(buyGoods));
        sleep(1500);
        rectClick(parse(findEng));
        sleep(1500);
        if(textContains("去浏览").exists()){
            clearInterval(id);
        }
    }, 3000);
}

function rectClick(vals){
    var left = vals[0];
    var top = vals[1];
    var right = vals[2];
    var bottom = vals[3];
    click(left, top, right, bottom);
}

function sign(){
    var obj = text("去签到");
    if(obj.exists()){
        obj.findOne().click();
        sleep(1500);
    }
}

function doTask(desc){
    log("执行：任务" + desc);
    var obj = textContains(desc);
    while(obj.exists()){
        obj.findOne().click();
        wait(24, text("任务完成"),
            text("今日已达上限"),
            className(actView).desc("任务完成"), 
            className(actView).desc("今日已达上限"));
        isHome() ? log("提示：请手动打开活动列表") : "";
        if(currentActivity() != actHome){
            back();
            sleep(3000);
        }
    }
}

function wait(limit){
    var condition = true;
    while(limit > 0 && condition){
        sleep(3000);
        limit -= 3;
        for(var i = 1; i < arguments.length; i++){
            if(arguments[i].exists()){
                condition = false;
                break;
            }
        }
        log("执行：任务耗时3秒");
    }
    log("状态：任务完成耗时：" + (24 - limit) + "秒");
}

function over(){
    log("执行：取消设备长亮");
    device.cancelKeepingAwake();
    device.vibrate(100);
    device.vibrate(100);
    log("状态：完成浏览任务");
}

function main(){
    console.show();
    setScreenMetrics(1080, 1920);
    /*loadApp();
    loadConf();
    goHome();
    goAct();*/
    sign();
    doTask("去浏览");
    doTask("去兑换");
    doTask("去搜索");
    doTask("去浏览");
}

main();