var home = "com.taobao.tao.TBMainActivity";
var act = "com.taobao.browser.BrowserActivity";
var actCom = "android.widget.FrameLayout";
var actDepth = 3;
var actIndexInParent = 1;
var taskBtn = "android.widget.Button";
var taskDepth = 14;
var taskIndexInParent = 5;
var view = "android.view.View";
var searchHome = "com.taobao.search.searchdoor.SearchDoorActivity";
var editText = "android.widget.EditText";
var editDepth = 2;
var editIndexInParent = 0;
var homeBtn = actCom;
var homeDepth = 4;
var homeIndexInParent = 0;
var confFile = files.getSdcardPath() + "/喵币定制/" + device.model + "_" + device.release + ".conf";

function loadConf() {
    if (files.exists(confFile)) {
        var reader = open(confFile, "r", "utf-8");
        var content = "";
        while ((content = reader.readline()) != null) {
            var values = content.split("：");
            var vs = values[1].split(",");
            switch (values[0]) {
                case "双11合伙人":
                    actCom = vs[0];
                    actDepth = vs[1];
                    actIndexInParent = vs[2];
                    break;
                case "领喵币":
                    taskBtn = vs[0];
                    taskDepth = vs[1];
                    taskIndexInParent = vs[2];
                    break;
                case "搜索页搜索框":
                    editText = vs[0];
                    editDepth = vs[1];
                    editIndexInParent = vs[2];
                    break;
                case "首页按钮":
                    homeBtn = vs[0];
                    homeDepth = vs[1];
                    homeIndexInParent = vs[2];
                    break;
            }
        }
        toast("使用定制组件");
    } else {
        toast("不存在定制文件");
    }
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

function test(component, tip){
    if(component.exists()){
        log("测试：" + component.findOne().bounds());
        log("提示：请查看" + tip + "是否位于上面坐标");
    } else {
        log("测试：未找到组件" + tip + "，定制失败");
    }
}

function main(){
    console.show();
    loadConf();
    switch(currentActivity()){
        case home:
            var actIn = findComponent(actCom, actDepth, "", actIndexInParent, true);
            var homePage = findComponent(homeBtn, homeDepth, "", homeIndexInParent, true).selected(true);
            test(actIn, "{双11合伙人}");
            test(homePage, "{淘}首页第二层");
            break;
        case act:
            var upLimit = textContains("上限");
            test(upLimit, "{上限}");
            var task = findComponent(taskBtn, taskDepth, "", taskIndexInParent, true);
            test(task, "{领喵币}");
            break;
        case searchHome:
            var edit = findComponent(editText, editDepth, "", editIndexInParent, true);
            test(edit, "{搜索页搜索框}");
            break;
    }
}

auto.waitFor();
main();