#import "OceanConversionCordovaPlugin.h"
#import "BDASignalManager.h"
#import "BDASignalDefinitions.h"

@implementation OceanConversionCordovaPlugin

static NSDictionary *launchOptions;

// 监听并获取launchOptions
+ (void)load {
	[[NSNotificationCenter defaultCenter] addObserver:self
											 selector:@selector(handleAppLaunch:)
												 name:UIApplicationDidFinishLaunchingNotification
											   object:nil];
}

+ (void)handleAppLaunch:(NSNotification *)notification {
	launchOptions = notification.userInfo;
}


- (void)init:(CDVInvokedUrlCommand *_Nonnull)command
{
	NSObject *obj = [command.arguments objectAtIndex:0];
	if (![obj isEqual:[NSNull null]]) {
		BOOL oaidEnabled = [[obj valueForKey:@"oaidEnabled"] boolValue]; // 修正变量类型
		if (oaidEnabled) {
			[BDASignalManager enableIdfa:YES];
		}
	}
	// 上报冷启动事件
	[BDASignalManager didFinishLaunchingWithOptions:launchOptions connectOptions:nil];
	
	CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)onEventRegister:(CDVInvokedUrlCommand *_Nonnull)command
{
	// 上报注册事件
	[BDASignalManager trackEssentialEventWithName:kBDADSignalSDKEventRegister params:@{
	}];
}

- (void)onEventPurchase:(CDVInvokedUrlCommand *_Nonnull)command
{
	int num = [[command.arguments objectAtIndex:3] intValue];
	// 上报付费事件
	[BDASignalManager trackEssentialEventWithName:kBDADSignalSDKEventPurchase params:@{
		@"pay_amount" : @(num) // 修正为 NSNumber，确保正确赋值
	}];
}

- (void)onEventV3:(CDVInvokedUrlCommand *_Nonnull)command
{
	NSString *event = [[command.arguments objectAtIndex:0] stringValue];
	NSObject *obj = [command.arguments objectAtIndex:1];

	NSDictionary *params;
	if ([obj isKindOfClass:[NSDictionary class]]) {
		params = (NSDictionary *)obj; // 直接转换
	} else {
		params = @{}; // 默认空字典，防止崩溃
	}

	// 上报自定义事件
	[BDASignalManager trackEssentialEventWithName:event params:params];
}

- (void)setUserUniqueID:(CDVInvokedUrlCommand *_Nonnull)command
{
	if (command.arguments.count == 0 || [command.arguments objectAtIndex:0] == [NSNull null]) {
		[BDASignalManager registerWithOptionalData:@{
			 kBDADSignalSDKUserUniqueId : @"",
		 }];
		return;
	}

	NSString *account = [[command.arguments objectAtIndex:0] stringValue];

	[BDASignalManager registerWithOptionalData:@{
		kBDADSignalSDKUserUniqueId : account ?: @"",  // 确保传入非空字符串
	}];
}

- (void)getChannel:(CDVInvokedUrlCommand *_Nonnull)command
{
	CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@""];
	[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

@end
