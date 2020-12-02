//
//  HVPConfigure.h
//  HikVideoPlayer
//
//  Created by westke on 2018/9/13.
//

#import <Foundation/Foundation.h>

@interface HVPConfigure : NSObject

+ (void)initWithAppkey:(NSString *)appKey;

// 是否开启日志，建议调试时开启，发布时关闭
+ (void)setLogEnabled:(BOOL)enabled;

+ (instancetype)new NS_UNAVAILABLE;

- (instancetype)init NS_UNAVAILABLE;

@end
