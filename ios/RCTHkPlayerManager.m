//
//  RCTHkPlayerManager.m
//  RNHksdk
//
//  Created by admin on 2019/10/8.
//  Copyright © 2019 Facebook. All rights reserved.
//
@import Photos;

#import <Toast/Toast.h>
#import "RCTHkPlayerManager.h"
#import <React/RCTBridge.h>
#import <Foundation/Foundation.h>
#import <HikVideoPlayer/HVPError.h>
#import <HikVideoPlayer/HVPPlayer.h>
#import "RCTHKVideo.h"

static NSTimeInterval const kToastDuration = 1;

@interface RCTHKPlayerManager () <HVPPlayerDelegate>

@property ( nonatomic,strong)  RCTHKVideo                     *playView;
@property (weak, nonatomic)  UIActivityIndicatorView     *indicatorView;
//@property (weak, nonatomic) IBOutlet UIButton                     *playButton;
//@property (weak, nonatomic) IBOutlet UITextField                 *realplayTextField;
//@property (weak, nonatomic) IBOutlet UIButton *recordButton;
@property (nonatomic, strong) HVPPlayer                            *player;
@property (nonatomic, assign) BOOL                                  isPlaying;
@property (nonatomic, assign) BOOL                                  isRecording;
@property (nonatomic, copy) NSString                             *recordPath;
@property (nonatomic, copy) NSString                             *uri;
@property (nonatomic, copy) NSString                             *mode;
@property (nonatomic, copy) NSString                             *startDate;
@property (nonatomic, copy) NSString                             *endDate;

@end

@implementation RCTHKPlayerManager
//{
//    UIView  *playView;
//    UIActivityIndicatorView *indicatorView;
//    HVPPlayer   *player;
//    BOOL    _isPlaying;
//    BOOL    _isRecording;
//    NSString    *recordPath;
//}

RCT_EXPORT_MODULE(HKPlayer);

@synthesize bridge = _bridge;

- (UIView *)view
{
    self.playView = [[RCTHKVideo alloc] initWithEventDispatcher:self.bridge.eventDispatcher];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(applicationWillResignActive) name:UIApplicationWillResignActiveNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(applicationDidBecomeActive) name:UIApplicationDidBecomeActiveNotification object:nil];
    
    return self.playView;
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_CUSTOM_VIEW_PROPERTY(mode, NSString, RCTHKVideo){
    NSString *mode = [RCTConvert NSString:json];
    //    view.mapType = [mapType intValue];
    self.mode= mode;
  
}

RCT_EXPORT_VIEW_PROPERTY(onChange, RCTBubblingEventBlock)

RCT_CUSTOM_VIEW_PROPERTY(startDate, NSString, RCTHKVideo){
    NSString *startDate = [RCTConvert NSString:json];
    //    view.mapType = [mapType intValue];
    self.startDate= startDate;
  
}
RCT_CUSTOM_VIEW_PROPERTY(endDate, NSString, RCTHKVideo){
    NSString *endDate = [RCTConvert NSString:json];
    //    view.mapType = [mapType intValue];
    self.endDate= endDate;
}

RCT_CUSTOM_VIEW_PROPERTY(uri, NSString, RCTHKVideo){
    NSString *uri = [RCTConvert NSString:json];
    //    view.mapType = [mapType intValue];
    self.uri= uri;
    if(![self.mode isEqualToString: @"playback"]){
        [self startPlay];
    }
    
}


- (void) _startPlayBack {
    if([self.mode isEqualToString: @"playback"]){
        if (_isPlaying) {
             [_player stopPlay:nil];
        }
        NSDateFormatter *_dateFormatter = [[NSDateFormatter alloc] init];
        [_dateFormatter setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
        NSDate *startTimeDate = [_dateFormatter dateFromString:self.startDate];
        NSTimeInterval _startTime = [startTimeDate timeIntervalSince1970];
        NSDate *endTimeDate = [_dateFormatter dateFromString:self.endDate];
        NSTimeInterval _endTime = [endTimeDate timeIntervalSince1970];
        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                       [self.player startPlayback:self.uri startTime:_startTime endTime:_endTime];
                });
    return;
    }
}

- (void) startPlay {
//    [self.playView makeToast:@"播放" duration:kToastDuration position:CSToastPositionCenter];
    if(self.uri !=nil && ![self.mode isEqualToString: @"playback"]){
         dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                [self.player startRealPlay:self.uri];
         });
    }
}
- (void)capture {
    if (!_isPlaying) {
        return;
    }
    // 生成图片路径
    NSString *documentDirectorie = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES).firstObject;
    NSString *filePath = [documentDirectorie stringByAppendingFormat:@"/%.f.jpg", [NSDate date].timeIntervalSince1970];
    NSError *error;
    if (![_player capturePicture:filePath error:&error]) {
        NSString *message = [NSString stringWithFormat:@"抓图失败，错误码是 0x%08lx", error.code];
        [self.view makeToast:message duration:kToastDuration position:CSToastPositionCenter];
    }
    else {
        [[PHPhotoLibrary sharedPhotoLibrary] performChanges:^{
            [PHAssetChangeRequest creationRequestForAssetFromImageAtFileURL:[NSURL URLWithString:filePath]];
        } completionHandler:^(BOOL success, NSError * _Nullable error) {
            NSString *message;
            if (success) {
                message = @"抓图成功，并保存到系统相册";
            }
            else {
                message = @"保存到系统相册失败";
            }
            [[NSFileManager defaultManager] removeItemAtPath:filePath error:nil];
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.playView makeToast:message duration:kToastDuration position:CSToastPositionCenter];
            });
        }];
    }
}

RCT_EXPORT_METHOD(startPlayback ){
    [self _startPlayBack];
}

RCT_EXPORT_METHOD(captureVideo ){
    if (!_isPlaying) {
        [self.playView makeToast:@"未播放视频，不能抓图" duration:kToastDuration position:CSToastPositionCenter];
        return;
    }
    [PHPhotoLibrary requestAuthorization:^(PHAuthorizationStatus status) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (status == PHAuthorizationStatusDenied) {
                [self.playView makeToast:@"无保存图片到相册的权限，不能抓图" duration:kToastDuration position:CSToastPositionCenter];
            }
            else {
                [self capture];
            }
        });
    }];
}



- (void)recordVideo{
    if (!_isPlaying) {
        return;
    }
    NSError *error;
    // 开始录像
    if (!self.isRecording) {
        // 生成图片路径
        NSString *documentDirectorie = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES).firstObject;
        NSString *filePath = [documentDirectorie stringByAppendingFormat:@"/%.f.mp4", [NSDate date].timeIntervalSince1970];
        _recordPath = [filePath copy];
        if ([_player startRecord:filePath error:&error]) {
            _isRecording = YES;
            [self.playView makeToast:@"开始录像" duration:kToastDuration position:CSToastPositionCenter];
        }
        else {
            NSString *message = [NSString stringWithFormat:@"开始录像失败，错误码是 0x%08lx", error.code];
           
            [self.playView makeToast:message duration:kToastDuration position:CSToastPositionCenter];
        }
        return;
    }
    if (_isRecording) {
        // 停止录像
           if ([_player stopRecord:&error]) {
               _isRecording = NO;
               //可在自定义recordPath路径下取录像文件
               [[PHPhotoLibrary sharedPhotoLibrary] performChanges:^{
                   [PHAssetChangeRequest creationRequestForAssetFromVideoAtFileURL:[NSURL URLWithString:_recordPath]];
               } completionHandler:^(BOOL success, NSError * _Nullable error) {
                   NSString *message;
                   if (success) {
                       message = @"录像成功，并保存到系统相册";
                   }
                   else {
                       message = @"保存到系统相册失败";
                   }
                   dispatch_async(dispatch_get_main_queue(), ^{
                       [self.playView makeToast:message duration:kToastDuration position:CSToastPositionCenter];
                   });
               }];
           }
           else {
               NSString *message = [NSString stringWithFormat:@"停止录像失败，错误码是 0x%08lx", error.code];
               [self.playView makeToast:message duration:kToastDuration position:CSToastPositionCenter];
           }
    }
   
}
RCT_EXPORT_METHOD(record ){
    if (!_isPlaying) {
        [self.playView makeToast:@"未播放视频，不能录像" duration:kToastDuration position:CSToastPositionCenter];
        return;
    }
    [PHPhotoLibrary requestAuthorization:^(PHAuthorizationStatus status) {
        if (status == PHAuthorizationStatusDenied) {
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.playView makeToast:@"无保存录像到相册的权限，不能录像" duration:1 position:CSToastPositionCenter];
            });
        }
        else {
            dispatch_async(dispatch_get_main_queue(), ^{
                
                [self recordVideo];
            });
        }
    }];
}

RCT_EXPORT_METHOD(sound: (NSString *) uri ){
    if (!_isPlaying) {
        [self.playView makeToast:@"未播放视频，不能静音" duration:kToastDuration position:CSToastPositionCenter];
        return;
    }
    NSError *error;
    
    // 开启声音
    if ([_player enableSound:YES error:&error]) {
        [self.playView makeToast:@"开启声音成功" duration:kToastDuration position:CSToastPositionCenter];
    }
    else {
        NSString *message = [NSString stringWithFormat:@"开启声音失败，错误码是 0x%08lx", error.code];
        [self.view makeToast:message duration:kToastDuration position:CSToastPositionCenter];
    }
}

RCT_EXPORT_METHOD(stopplay){
    NSLog(@"stopplay");
    [_player stopPlay:nil];
}

RCT_EXPORT_METHOD(seekTime: (NSTimeInterval ) startTime ){
    [_player seekToTime:startTime];
    
}
RCT_EXPORT_METHOD(startplay){
    [self startPlay];
//    if(uri != nil){
////        [self.indicatorView startAnimating];
//        if (!self.player) {
//            // 创建player
//            self.player = [[HVPPlayer alloc] initWithPlayView:self.playView];
//            // 或者 _player = [HVPPlayer playerWithPlayView:self.playView];
//            // 设置delegate
//            self.player.delegate = self;
//        }
//        if(![self.player startRealPlay:uri]){
////            [self.indicatorView stopAnimating];
//        }
    
}


- (void)applicationWillResignActive {
//    if (_isRecording) {
//        [self _recordVideo:_recordButton];
//    }
    _isPlaying = NO;
    [self.player stopPlay:nil];
}

- (void)applicationDidBecomeActive {
//    if ([_playButton.currentTitle isEqualToString:@"停止预览"]) {
//        [self.indicatorView startAnimating];
//        if (![_player startRealPlay:_realplayTextField.text]) {
//            [self.indicatorView stopAnimating];
//        }
//    }
}

#pragma mark - HVPPlayerDelegate
- (void)player:(HVPPlayer *)player playStatus:(HVPPlayStatus)playStatus errorCode:(HVPErrorCode)errorCode {
    dispatch_async(dispatch_get_main_queue(), ^{
        // 如果有加载动画，结束加载动画
        if (self.indicatorView.isAnimating) {
            [self.indicatorView stopAnimating];
        }
        _isPlaying = NO;
        NSString *message;
        // 预览时，没有HVPPlayStatusFinish状态，该状态表明录像片段已播放完
        if (playStatus == HVPPlayStatusSuccess) {
            _isPlaying = YES;
//            [_playButton setTitle:@"停止预览" forState:UIControlStateNormal];
            // 默认开启声音
             _playView.onChange(@{@"status":@"success"});
            [player enableSound:YES error:nil];
        }
        else if (playStatus == HVPPlayStatusFailure) {
            if (errorCode == HVPErrorCodeURLInvalid) {
                message = @"URL输入错误请检查URL或者URL已失效请更换URL";
            }
            else {
//                message = [NSString stringWithFormat:@"开启预览失败, 错误码是 : 0x%08lx", (long)errorCode];
                _playView.onChange (@{@"status":@"fail"});
//                NSLog(message);
            }
        }
        else if (playStatus == HVPPlayStatusException) {
            // 预览过程中出现异常, 可能是取流中断，可能是其他原因导致的，具体根据错误码进行区分
            // 做一些提示操作
            message = [NSString stringWithFormat:@"播放异常, 错误码是 : 0x%08lx", (long)errorCode];
            if (_isRecording) {
                //如果在录像，先关闭录像
//                [self recordVideo:_recordButton];
            }
            // 关闭播放
             _playView.onChange(@{@"status":@"fail"});
            [player stopPlay:nil];
        }
        if (message) {
            [self.playView makeToast:message duration:kToastDuration position:CSToastPositionCenter];
        }
    });
}

- (HVPPlayer *)player {
//    if (!_player || [_player]) {
        // 创建player
        _player = [[HVPPlayer alloc] initWithPlayView:_playView];
        // 或者 _player = [HVPPlayer playerWithPlayView:self.playView];
        // 设置delegate
        _player.delegate = self;
//    }
    return _player;
}

- (void)dealloc {
    // 退出当前页面，需要停止播放
    if (_isRecording) {
        //如果在录像，先关闭录像
//        [self recordVideo:_recordButton];
    }
    if (_isPlaying) {
        [_player stopPlay:nil];
    }
}
@end
