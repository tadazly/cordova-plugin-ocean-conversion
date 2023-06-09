package com.tadazly.oceanconversion;

import android.app.Activity;
import android.app.Application;
import android.util.Log;

import com.bytedance.applog.AppLog;
import com.bytedance.applog.InitConfig;
import com.bytedance.applog.game.GameReportHelper;
import com.bytedance.applog.util.UriConstants;

import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONException;
import org.json.JSONObject;

public class OceanConversionCordovaPlugin extends CordovaPlugin {
    public final static String LOG_TAG = "plugin.Ocean";
    private static String APP_ID;
    private Activity yourApp;

    // 用于标记是否初始化过Sdk
    private static boolean hasInitSdk = false;

    @Override
    protected void pluginInitialize() {
        super.pluginInitialize();
        // 从配置中获取appId，参考对应的plugin.xml文件
        APP_ID = webView.getPreferences().getString("OCEAN_APPID", "");
        yourApp = cordova.getActivity();
        Log.d(LOG_TAG, "Ocean Cordova Plugin initialize");
    }

    @Override
    public boolean execute(String action, CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        Log.d(LOG_TAG, "Ocean Plugin Action:" + action);
        if (action.equals("init")) {
            return this.init(args, callbackContext);
        }
        if (!hasInitSdk) {
            Log.e(LOG_TAG, "Ocean SDK not Init !");
            callbackContext.error("Ocean SDK not Init ! Please Call init First !");
            return true;
        }
        if (action.equals("onEventRegister")) {
            return this.onEventRegister(args, callbackContext);
        }
        else if (action.equals("onEventPurchase")) {
            return this.onEventPurchase(args, callbackContext);
        }
        else if (action.equals("onEventV3")) {
            return this.onEventV3(args, callbackContext);
        }
        else if (action.equals("setUserUniqueID")) {
            return this.setUserUniqueID(args, callbackContext);
        }
        return false;
    }

    private boolean init(CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        if (hasInitSdk) {
            callbackContext.success();
            return true;
        }

        Application app = yourApp.getApplication();
         if (app == null) {
            callbackContext.error("Cannot get current Application");
            return true;
        }

        JSONObject initParams = args.getJSONObject(0);
        if (initParams != null) {
            String appId = APP_ID;
            String channel = "oceanengine";
            int urlConfig = UriConstants.DEFAULT;
            boolean imeiEnable = false;
            boolean autoTrackEnabled = false;
            boolean logEnable = false;
            boolean macEnable = false;
            boolean encryptAndCompress = true;
            boolean enablePlay = true;
            boolean oaidEnabled = true;
            if (initParams.has("appId")) {
                appId = initParams.getString("appId");
            }
            if (initParams.has("channel")) {
                channel = initParams.getString("channel");
            }
            if (initParams.has("urlConfig")) {
                urlConfig = initParams.getInt("urlConfig");
            }
            if (initParams.has("imeiEnable")) {
                imeiEnable = initParams.getBoolean("imeiEnable");
            }
            if (initParams.has("autoTrackEnabled")) {
                autoTrackEnabled = initParams.getBoolean("autoTrackEnabled");
            }
            if (initParams.has("logEnable")) {
                logEnable = initParams.getBoolean("logEnable");
            }
            if (initParams.has("macEnable")) {
                macEnable = initParams.getBoolean("macEnable");
            }
            if (initParams.has("encryptAndCompress")) {
                encryptAndCompress = initParams.getBoolean("encryptAndCompress");
            }
            if (initParams.has("enablePlay")) {
                enablePlay = initParams.getBoolean("enablePlay");
            }
            if (initParams.has("oaidEnabled")) {
                oaidEnabled = initParams.getBoolean("oaidEnabled");
            }
            final InitConfig config = new InitConfig(appId, channel);
            config.setUriConfig(urlConfig);
            config.setImeiEnable(imeiEnable);
            config.setAutoTrackEnabled(autoTrackEnabled);
            config.setLogEnable(logEnable);
            config.setMacEnable(macEnable);
            config.setEnablePlay(enablePlay);
            config.setOaidEnabled(oaidEnabled);
            AppLog.setEncryptAndCompress(encryptAndCompress);
            AppLog.init(app, config, yourApp);
            hasInitSdk = true;
            callbackContext.success();
        } else {
            callbackContext.error("Please give initParams");
        }
        return true;
    }

    private boolean onEventRegister(CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        String registerType = args.getString(0);
        Boolean success = args.getBoolean(1);
        if (registerType != null && registerType.length() > 0) {
            GameReportHelper.onEventRegister(registerType, success);
            callbackContext.success();
        } else {
            callbackContext.error("Please give registerType");
        }
        return true;
    }

    private boolean onEventPurchase(CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        String type = args.getString(0);
        String name = args.getString(1);
        String id = args.getString(2);
        int num = args.getInt(3);
        String channel = args.getString(4);
        String currency = args.getString(5);
        boolean success = args.getBoolean(6);
        int price = args.getInt(7);
        if (name != null && name.length() > 0) {
            GameReportHelper.onEventPurchase(type, name, id, num, channel, currency, success, price);
            callbackContext.success();
        } else {
            callbackContext.error("Wrong purchase params");
        }
        return true;
    }

    private boolean onEventV3(CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        String event = args.getString(0);
        JSONObject params = args.getJSONObject(1);
        if (event != null && event.length() > 0) {
            AppLog.onEventV3(event, params);
            callbackContext.success();
        } else {
            callbackContext.error("Please give event");
        }
        return true;
    }

    private boolean setUserUniqueID(CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        String account = args.getString(0);
        if (account != null && account.length() > 0) {
            AppLog.setUserUniqueID(account);
            callbackContext.success();
        } else {
            AppLog.setUserUniqueID(null);
            callbackContext.success();
        }
        return true;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (hasInitSdk) {

        }
    }
}