# Cordova巨量广告转化SDK插件
# cordova-plugin-ocean-conversion

## 一、说明

### Cordova项目接入巨量广告转化安卓端SDK（v6.16.9）

- [巨量转化SDK文档](https://bytedance.feishu.cn/docx/doxcnjAFo7iUImEIq9DuA7Tr69g)
- [火山SDK文档](https://www.volcengine.com/docs/6287/65802)
- [应用管理中心分包SDK集成说明文档](https://bytedance.feishu.cn/docs/doccnWHO1ZOWn3YrZVblvoEw4th#)


### SDK版本
- Android
    - RangersAppLog-Lite-cn:6.16.9  Applog 上报组件
    - AppConvert:1.3.2.1            商业化转化组件
    - humesdk@1.0.0.aar             分包SDK
- iOS 
    - [libBDASignalSDK@1.0.3](https://bytedance.larkoffice.com/docx/CgYBdVzoBogND2xv7PhcSfFNnyc)

## 二、接入流程
### 1.在项目中安装插件

- 安装时使用的 OCEAN_APPID 需要在[根据文档自行申请](https://bytedance.feishu.cn/docx/doxcnjAFo7iUImEIq9DuA7Tr69g)

1. 通过npm安装
``` shell
cordova plugin add cordova-plugin-ocean-conversion --variable OCEAN_APPID=7758258
```

2. 通过git链接安装
``` shell
cordova plugin add https://github.com/tadazly/cordova-plugin-ocean-conversion.git --variable OCEAN_APPID=7758258
```

3. 通过本地路径安装
``` shell
cordova plugin add /local/path/to/cordova-plugin-ocean-conversion --variable OCEAN_APPID=7758258
```

- 本地插件调试开发（改插件代码时可以用）

首先将插件clone到本地，然后使用本地路径方式安装并传入 --link 参数，会将插件目录中的代码链接至项目
``` shell
cordova plugin add /local/path/to/cordova-plugin-ocean-conversion --variable OCEAN_APPID=7758258 --link
```

### 2.项目配置
- Android
    - 无需额外配置,若装完插件使用cordova build failed,可以用android studio打开项目并执行rebuild project.

### 3.使用方式

插件对象可以在js代码中使用[Ocean](https://github.com/tadazly/cordova-plugin-ocean-conversion/blob/main/plugin.xml#L13)或者[cordova.plugins.OceanConversion](https://github.com/tadazly/cordova-plugin-ocean-conversion/blob/main/plugin.xml#L14)调用

### 4.通过巨量的数据检测
若只是为了通过巨量的数据检测,直接调用Ocean.testApi()即可,会执行init并调用必传的关键埋点.

### 5.渠道号读取
1. 同步读取
2. 不需要初始化，HumeSDK做了缓存，第⼀次读取时间为10ms以内，第⼆次读取速度会 特别快。
3. 读取渠道号后即可通过sdk采集上报

### 6.坑
    - 巨量没有设备白名单，所以联调同一台设备可能会收不到事件。
    - 如需要和热云sdk一起用，建议先初始化巨量，再初始化热云。


## 四、API使用说明

### 1.初始化SDK

初始化参数说明：
- appId默认使用安装插件时的OCEAN_APPID参数，不推荐从js传入。
``` typescript
    type initParameters = {
        appId?: string,
        /** 渠道信息，请注意不能为空 */
        channel: string,
        /**
         * 设置数据上送地址
         * @default UriConstants.DEFAULT
         */
        uriConfig?: number,
        /**
         * 建议关停获取IMEI（出于合规考虑）
         * @default false
         */
        imeiEnable?: boolean,
        /**
         * 全埋点开关
         * @default false
         */
        autoTrackEnabled?: boolean,
        /**
         * 日志
         * @default false
         */
        logEnable?: boolean,
        /**
         * 加密开关
         * @default true
         */
        encryptAndCompress?: boolean,
        /**
         * 设备的mac地址采集
         * @default false
         */
        macEnable?: boolean,
        /**
         * 心跳事件（时长统计）必传事件
         * 请在仔细阅读文档后设置，或者保持默认开启
         * @default true
         */
        enablePlay?: boolean,
        /**
         * 设备的OAID信息采集默认开启
         * @default true
         */
        oaidEnabled?: boolean,
        /**
         * 设备的 GAID 采集默认关闭
         * @default false
         */
        gaidEnabled?: boolean,
        /**
         * 设备的 ICCID 采集默认开启
         * @default true
         */
        iccIdEnable?: boolean,
        /**
         * 设备的 SN 采集默认开启
         * @default true
         */
        serialNumberEnable?: boolean,
        /**
         * 设备的运营商信息默认采集
         * @default true
         */
        operatorInfoEnabled?: boolean
    }
```

``` typescript
const initParams: initParameters = {
    // 你的配置...
    channel: 'test',
};
Ocean.init(
    initParams,
    () => {/** on Success **/},
    (err) => {/** on Error **/}
);
```

### 2.注册（必传埋点）
内置事件: “注册” ，属性：注册方式，是否成功，属性值为：wechat ，true

``` typescript
Ocean.onEventRegister("wechat", true);
```

### 3.支付（必传埋点）
内置事件 “支付”，属性：商品类型，商品名称，商品ID，商品数量，支付渠道，币种，是否成功（必传），金额（必传）

付费金额单位为元
``` typescript
Ocean.onEventPurchase("gift","flower", "008",1, "wechat","¥", true, 1);
```

### 4.关键行为上报

``` typescript
Ocean.onGameAddiction("原始事件名称");
```

### 5.自定义埋点事件
用户行为日志采用事件（event） + 属性（params）形式，一个事件可以对应多个属性，具体埋点可根据各业务方需求而定，下面是一个视频点击事件和它的两个属性的举例：

``` typescript
Ocean.onEventV3("video_play_clicks", {video_title:"Lady Gaga", duration: 20});
```

### 6.设置用户唯一标识（可选）
UserUniqueId作为用户的唯一的标识，传入此值可以以用户为单位进行统计，如果不传此id，则以设备为单位进行统计（如果以设备为单位统计，当用户换设备之后，数据统计平台就认为是两个统计单位）。通常接入方可以以业务方平台登陆的userId作为UserUniqueId传入（注，当用户登出的时候请把UserUniqueId置为null，否则SDK不知道用户已经登出，仍然将统计结果计算在该用户身上）。

``` typescript
Ocean.setUserUniqueID("YourUserAccountId");
```

### 7.安卓分包SDK获取渠道号
如果获取不到返回空字符串''
``` typescript
Ocean.getChannel(
    channel => console.log(channel)
)
```

### 8.测试接口
[内部实现](https://github.com/tadazly/cordova-plugin-ocean-conversion/blob/main/www/OceanConversion.js#L31)
``` typescript
Ocean.testApi(
    {}, 
    result => console.log(result)
)
```