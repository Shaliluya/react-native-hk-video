#import <React/RCTConvert.h>
#import "RCTHKVideo.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTEventDispatcher.h>
#import <React/UIView+React.h>

static NSString *const statusKeyPath = @"status";
static NSString *const playbackLikelyToKeepUpKeyPath = @"playbackLikelyToKeepUp";
static NSString *const playbackBufferEmptyKeyPath = @"playbackBufferEmpty";
static NSString *const readyForDisplayKeyPath = @"readyForDisplay";
static NSString *const playbackRate = @"rate";
static NSString *const timedMetadata = @"timedMetadata";

@implementation RCTHKVideo
{
    
    //@property (weak, nonatomic) IBOutlet UIButton                     *playButton;
    //@property (weak, nonatomic) IBOutlet UITextField                 *realplayTextField;
    //@property (weak, nonatomic) IBOutlet UIButton *recordButton;
//     HVPPlayer                            *player;
//     BOOL                                  isPlaying;
//     BOOL                                  isRecording;
    NSString * uri;

  /* Required to publish events */
  RCTEventDispatcher *_eventDispatcher;
  
}

- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher
{
  if ((self = [super init])) {
    _eventDispatcher = eventDispatcher;
//    [[NSNotificationCenter defaultCenter] addObserver:self
//                                             selector:@selector(applicationWillResignActive:)
//                                                 name:UIApplicationWillResignActiveNotification
//                                               object:nil];
//
//    [[NSNotificationCenter defaultCenter] addObserver:self
//                                             selector:@selector(applicationDidEnterBackground:)
//                                                 name:UIApplicationDidEnterBackgroundNotification
//                                               object:nil];
//
//    [[NSNotificationCenter defaultCenter] addObserver:self
//                                             selector:@selector(applicationWillEnterForeground:)
//                                                 name:UIApplicationWillEnterForegroundNotification
//                                               object:nil];
  }

  return self;
}



- (void)applicationDidEnterBackground:(NSNotification *)notification
{
//  if (_playInBackground) {
//    // Needed to play sound in background. See https://developer.apple.com/library/ios/qa/qa1668/_index.html
////    [_playerLayer setPlayer:nil];
//  }
}

- (void)applicationWillEnterForeground:(NSNotification *)notification
{
//  [self applyModifiers];
//  if (_playInBackground) {
//    [_playerLayer setPlayer:_player];
//  }
}


@end
