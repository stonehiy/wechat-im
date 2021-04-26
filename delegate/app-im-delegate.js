import { getIMHandlerFactory } from "../libs/im-sdk/im-qmtt-factory";

export default class AppIMDelegate {
  constructor(app) {
    this._app = app;
  }

  onLaunch(options) {
    this.iIMHandler = getIMHandlerFactory;
  }

  onShow(options) {
    const globa = this._app.globalData;
    const userinfo = globa.userInfo;
    this.iIMHandler.createConnection({
      options: { url: "wx://127.0.0.1", clientId: userinfo.userId },
    });
  }

  onHide() {}

  getIMHandlerDelegate() {
    return this.iIMHandler;
  }
}
