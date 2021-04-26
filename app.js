//app.js
import AppIMDelegate from "./delegate/app-im-delegate";

const sysInfo  = wx.getSystemInfoSync()
const platform =sysInfo.platform
console.log(platform);
if("devtools" != platform){
    console = {
        log: function () {},
        dir: function () {},
        info: function () {},
        debug: function () {},
        // warn: function () {},
        // error: function () {},
        time: function () {},
        timeEnd: function () {}
    };
}


App({
    globalData: {
        userInfo: {},
    },
    getIMHandler() {
        return this.appIMDelegate.getIMHandlerDelegate();
    },
    onLaunch(options) {
        this.appIMDelegate = new AppIMDelegate(this);
        this.appIMDelegate.onLaunch(options);
       
    },
    onHide() {
        this.appIMDelegate.onHide();
    },
    onShow(options) {
        this.appIMDelegate.onShow(options);
    }
});