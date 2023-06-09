declare namespace Tracking {
    /** 初始化参数 */
    type initParameters = {
        appId?: string,
        /** 渠道信息，请注意不能为空 */
        channel: string,
        /**
         * 设置数据上送地址
         * @default UriConstants.DEFAULT
         */
        uriConfig?: string,
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
         * 心跳事件（时长统计）
         * 请在仔细阅读文档后设置，或者保持默认开启
         * @default true
         */
        enablePlay?: boolean,
        /**
         * 设备的OAID信息采集默认开启
         * @default true
         */
        oaidEnabled?: boolean
    }

    /**
     * 初始化sdk。
     * 为确保合规，集成SDK后，会在获得用户授权之后进行SDK的初始化并开始采集信息，请确保您采集用户信息前已得到用户的授权。
     * @param params 
     * @param onSuccess 
     * @param onError 
     */
    function init(params: initParameters, onSuccess?: ()=> void, onError?: (err: string) => void): void;

    /**
     * 内置事件: “注册”
     * @param type 注册方式
     * @param success 是否成功
     * @example Ocean.onEventRegister("wechat", true);
     */
    function onEventRegister(type: string, success: boolean): void;

    /**
     * 内置事件 “支付”
     * @param type 商品类型
     * @param name 商品名称
     * @param id 商品ID
     * @param num 商品数量
     * @param channel 支付渠道
     * @param currency 币种
     * @param success 是否成功
     * @param price 金额
     * @example Ocean.onEventPurchase("gift","flower", "008",1, "wechat","¥", true, 1);
     */
    function onEventPurchase(type: string, name: string, id: string, num: number, channel: string, currency: string, success: boolean, price: number): void;

    /**
     * 关键行为上报
     * @param event 原始事件名称
     * @example Ocean.onGameAddiction("原始事件名称");
     */
    function onGameAddiction(event: string): void;

    /**
     * 自定义埋点事件。
     * 用户行为日志采用事件（event） + 属性（params）形式，一个事件可以对应多个属性，具体埋点可根据各业务方需求而定，下面是一个视频点击事件和它的两个属性的举例：
     * @param event 事件名称
     * @param params 属性
     * @example Ocean.onEventV3("video_play_clicks", {video_title:"Lady Gaga", duration: 20});
     */
    function onEventV3(event: string, params: Object): void;

    /**
     * 设置用户唯一标识（可选） 
     * UserUniqueId作为用户的唯一的标识，传入此值可以以用户为单位进行统计，如果不传此id，则以设备为单位进行统计
     * （如果以设备为单位统计，当用户换设备之后，数据统计平台就认为是两个统计单位）。
     * 通常接入方可以以业务方平台登陆的userId作为UserUniqueId传入
     * （注，当用户登出的时候请把UserUniqueId置为null，否则SDK不知道用户已经登出，仍然将统计结果计算在该用户身上）。
     * @param account 设置您自己的账号体系ID或设备ID, 并保证其唯一性 ！
     * @example Ocean.setUserUniqueID("YourUserAccountId");
     */
    function setUserUniqueID(account: string);
}