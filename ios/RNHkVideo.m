#import "RNHkVideo.h"
//#import <HikVideoPlayer/HVPConfigure.h>

@implementation RNHkVideo

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

//RCT_EXPORT_METHOD(hkInit:(BOOL) isLog)
//{
//    [HVPConfigure initWithAppkey:nil];
//    [HVPConfigure setLogEnabled:isLog];
//}

@end
