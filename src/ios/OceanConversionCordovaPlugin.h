#import <Cordova/CDV.h>

@interface OceanConversionCordovaPlugin : CDVPlugin

@property (nonatomic, strong, nullable) NSString *IDFA;

- (void)init:(CDVInvokedUrlCommand *_Nonnull)command;
- (void)onEventRegister:(CDVInvokedUrlCommand *_Nonnull)command;
- (void)onEventPurchase:(CDVInvokedUrlCommand *_Nonnull)command;
- (void)onEventV3:(CDVInvokedUrlCommand *_Nonnull)command;
- (void)setUserUniqueID:(CDVInvokedUrlCommand *_Nonnull)command;
- (void)getChannel:(CDVInvokedUrlCommand *_Nonnull)command;

@end
