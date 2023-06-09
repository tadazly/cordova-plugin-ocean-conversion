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
        exec(onSuccess, onError, 'OceanConversion', 'onEventV3', ["game_addiction", {origin_event: event}]);
    },

    setUserUniqueID(account, onSuccess, onError) {
        exec(onSuccess, onError, 'OceanConversion', 'setUserUniqueID', [account]);
    },
}