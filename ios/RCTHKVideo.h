#import <React/RCTView.h>
#import <HikVideoPlayer/HVPError.h>
#import <HikVideoPlayer/HVPPlayer.h>

@class RCTEventDispatcher;

@interface RCTHKVideo : UIView <HVPPlayerDelegate>


@property (nonatomic, copy) RCTBubblingEventBlock onVideoError;
@property (nonatomic, copy) RCTBubblingEventBlock onChange;

- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher NS_DESIGNATED_INITIALIZER;


@end
