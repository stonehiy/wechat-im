import {getIMHandlerFactory} from "../libs/im-sdk/im-qmtt-factory";

export default class AppIMDelegate {
    constructor(app) {
        this._app = app;
    }

    onLaunch(options) {
        this.iIMHandler = getIMHandlerFactory;
    }

    onShow(options) {
        this.iIMHandler.createConnection({options: {url: 'wx://127.0.0.1'}});
    }

    onHide() {

    }

    getIMHandlerDelegate() {
        return this.iIMHandler;
    }
}
