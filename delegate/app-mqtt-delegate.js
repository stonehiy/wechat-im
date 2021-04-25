import mqttClinet from "../utils/mqttClinet";

export default class AppIMDelegate {
    constructor(app) {
        this._app = app;
    }

    onLaunch(options) {
        this.iIMHandler = getIMHandlerFactory;
    }

    onShow(options) {
        this.iIMHandler.createConnection({options: {url: 'ws://10.4.35.187:8001'}});
    }

    onHide() {

    }

    getIMHandlerDelegate() {
        return this.iIMHandler;
    }
}
