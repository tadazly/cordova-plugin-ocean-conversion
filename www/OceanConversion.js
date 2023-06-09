var exec = require('cordova/exec');

module.exports = {
    init(params, onSuccess, onError) {
        if (!params) {
            params = {};
        }
        exec(onSuccess, onError, 'OceanConversion', 'init', [params]);
    },

    onEventRegister(type, success, onSuccess, onError) {
        exec(onSuccess, onError, 'OceanConversion', 'onEventRegister', [type, success]);
    },

    onEventPurchase(type, name, id, num, channel, currency, success, price, onSuccess, onError) {
        exec(onSuccess, onError, 'OceanConversion', 'onEventPurchase', [type, name, id, num, channel, currency, success, price]);
    },

    onEventV3(event, params, onSuccess, onError) {
        exec(onSuccess, onError, 'OceanConversion', 'onEventV3', [event, params]);
    },

    onGameAddiction(event, onSuccess, onError) {
        exec(onSuccess, onError, 'OceanConversion', 'onEventV3', ["game_addiction", { origin_event: event }]);
    },

    setUserUniqueID(account, onSuccess, onError) {
        exec(onSuccess, onError, 'OceanConversion', 'setUserUniqueID', [account]);
    },

    testApi(params, callback) {
        var initParams = { channel: "testOcean", logEnable: true };
        if (params) {
            initParams = {
                channel: "testOcean",
                logEnable: true,
                ...params
            }
        }
        var _this = this;
        try {
            this.init(
                initParams,
                () => {
                    console.log("Ocean SDK init success");
                    _this.onEventRegister("wechat", true);
                    _this.onEventPurchase("product", "diamond", "product_1", 1, "alipay", "¥", true, 6);
                    _this.onGameAddiction("Event-MaMaMiAhh");
                    _this.onEventV3("purchase_item_clicked", { product_title: "PiPiAppleApplePi", duration: 200, history_bought: false });
                    
                    _this.setUserUniqueID("user1");
                    _this.onEventRegister("qq", true);
                    _this.onEventPurchase("product", "diamond", "product_1", 1, "qq", "¥", true, 6);
                    _this.onGameAddiction("Event-MaMaMiAhh");
                    _this.onEventV3("purchase_item_clicked", { product_title: "PiPiAppleApplePi", duration: 200, history_bought: false });
                    _this.setUserUniqueID(null);

                    _this.onEventRegister("qq", true);
                    _this.onEventPurchase("product", "diamond", "product_1", 1, "qq", "¥", true, 6);
                    _this.onGameAddiction("Event-MaMaMiAhh");
                    _this.onEventV3("purchase_item_clicked", { product_title: "PiPiAppleApplePi", duration: 200, history_bought: false });

                    _this.setUserUniqueID("user2");
                    _this.onEventRegister("apple", true);
                    _this.onEventPurchase("product", "diamond", "product_1", 1, "applePay", "¥", true, 6);
                    _this.onGameAddiction("Event-MaMaMiAhh");
                    _this.onEventV3("purchase_item_clicked", { product_title: "PiPiAppleApplePi", duration: 200, history_bought: true });
                    _this.setUserUniqueID(null);
                    
                    console.log("test api success ! ! !");
                    if (callback)
                        callback(true);
                },
                () => {
                    console.error("Ocean SDK init failed");
                    if (callback)
                        callback(false);
                }
            )
        } catch (err) {
            console.error("Ocean SDK init failed", err);
            if (callback)
                callback(false);
        }
    }
}