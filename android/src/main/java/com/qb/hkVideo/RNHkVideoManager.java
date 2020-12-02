package com.qb.hkVideo;

import android.graphics.SurfaceTexture;
import android.media.MediaScannerConnection;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import android.util.Log;
import android.view.TextureView;
import android.view.View;
import android.view.ViewGroup;

import com.blankj.utilcode.util.ToastUtils;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.hikvision.open.hikvideoplayer.HikVideoPlayer;
import com.hikvision.open.hikvideoplayer.HikVideoPlayerCallback;
import com.hikvision.open.hikvideoplayer.HikVideoPlayerFactory;

import java.text.MessageFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Map;

import hik.common.isms.hpsclient.AbsTime;

import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;



public class RNHkVideoManager extends SimpleViewManager<HKPlayer> implements HikVideoPlayerCallback ,TextureView.SurfaceTextureListener {
  private HikVideoPlayer mPlayer;
  private static final int executeCaptureEvent = 0;
  private static final int executeRecordEvent = 1;
  private static final int executeSoundEvent = 2;
  private static final int startRealPlay = 3;
  private static final int stopPlay = 4;
  private static final int startPlayback = 5;
  private static final int seekPlay = 6;
  private static final String  PLAYBACK_EVENT_NAME = "playback";
  private static final String  PREVIEW_EVENT_NAME = "preview";
  private static final String  EVENT_STATUS_SUCCESS = "success";
  private static final String  EVENT_STATUS_FAIL = "fail";
//    private static final String  PLAYBACK_EVENT_STATUS_ = "success";

  private PlayerStatus mPlayerStatus = PlayerStatus.IDLE;//默认闲置
  private boolean mRecording = false;

  private String mUri ;
  private String mode ;
  private String startDate ;
  private String endDate ;

  private boolean mSoundOpen = false;

  private HKPlayer player;

  private ThemedReactContext reactContext;
  @Override
  public String getName() {
    return "HKPlayer";
  }

  @Override
  protected HKPlayer createViewInstance(ThemedReactContext reactContext) {
    if(this.player == null){
      player = new HKPlayer(reactContext);
      player.setSurfaceTextureListener(this);
    }
    this.reactContext = reactContext;
    mPlayer = HikVideoPlayerFactory.provideHikVideoPlayer();
    ViewGroup parent = (ViewGroup)player.getParent();
    if(parent!=null){
      parent.removeView(player);
    }

    return player;
  }
  @ReactProp(name= "uri")
  public void setUri(TextureView player,String uri){
    Log.v("setUri",uri);
    this.mUri=uri;
    if(!"playback".equals(this.mode)) {
      if (mPlayerStatus != PlayerStatus.SUCCESS) {
        this.startPlay(player.getSurfaceTexture());
      } else {
        mPlayer.stopPlay();
        this.startPlay(player.getSurfaceTexture());
      }
    }else{
      this.startPlay(player.getSurfaceTexture());

    }
  }

  @ReactProp(name= "startDate")
  public void setStartDate(TextureView player,String startDate){
    this.startDate=startDate;

  }
  @ReactProp(name= "endDate")
  public void setEndDate(TextureView player,String endDate){
    this.endDate=endDate;

  }

  @ReactProp(name= "mode") // mode=playback 为回放
  public void setMode(TextureView player,String mode){
    this.mode=mode;
//        if("playback".equals(this.mode) && (this.mUri!=null && "".equals(this.mUri))) {
//            if (mPlayerStatus != PlayerStatus.SUCCESS) {
//                this.startPlay(player.getSurfaceTexture());
//            } else {
//                mPlayer.stopPlay();
//                this.startPlay(player.getSurfaceTexture());
//            }
//        }
  }

  private void seekTime (ReadableArray args){

    if("playback".equals(this.mode)){
      try {

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date startDate = sdf.parse(args.getString(0));
        Calendar startCal = Calendar.getInstance();
        startCal.setTime(startDate);
//        AbsTime startTime = new AbsTime();
//        startTime.setYear(startCal.get(Calendar.YEAR));
//        startTime.setMonth(startCal.get(Calendar.MONTH) + 1);
//        startTime.setDay(startCal.get(Calendar.DATE));
//        startTime.setHour(startCal.get(Calendar.HOUR));
//        startTime.setMinute(startCal.get(Calendar.MINUTE));
//        startTime.setSecond(startCal.get(Calendar.SECOND));
        new Thread(() -> {
          if (!mPlayer.seekAbsPlayback(CalendarUtil.calendarToyyyy_MM_dd_T_HH_mm_SSSZ(startCal), this)) {
            onPlayerStatus(Status.FAILED, mPlayer.getLastError());
          }
        }).start();
      }catch (Exception e){
        Log.e("error:",e.getStackTrace().toString());
      }
    }

  }

  private void startPlayback(SurfaceTexture surface) {
//    Log.v("startPlayback","测试一下");
//    Log.v("wj_this.mode",this.mode);
    if("playback".equals(this.mode) ) {
      SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
      try {
        Date startDate = sdf.parse(this.startDate);
        Date endDate = sdf.parse(this.endDate);
        Calendar startCal = Calendar.getInstance();
        Calendar endCal =  Calendar.getInstance();
        startCal.setTime(startDate);
        endCal.setTime(endDate);
//        AbsTime startTime = new AbsTime();
//        startTime.setYear(startCal.get(Calendar.YEAR));
//        startTime.setMonth(startCal.get(Calendar.MONTH)+1);
//        startTime.setDay(startCal.get(Calendar.DATE));
//        startTime.setHour(startCal.get(Calendar.HOUR));
//        startTime.setMinute(startCal.get(Calendar.MINUTE));
//        startTime.setSecond(startCal.get(Calendar.SECOND));
//        AbsTime endTime = new AbsTime();
//        endTime.setYear(endCal.get(Calendar.YEAR));
//        endTime.setMonth(endCal.get(Calendar.MONTH)+1);
//        endTime.setDay(endCal.get(Calendar.DATE));
//        endTime.setHour(endCal.get(Calendar.HOUR));
//        endTime.setMinute(endCal.get(Calendar.MINUTE));
//        endTime.setSecond(endCal.get(Calendar.SECOND));

        String startfomTime = CalendarUtil.calendarToyyyy_MM_dd_T_HH_mm_SSSZ(startCal);
        String stopTime = CalendarUtil.calendarToyyyy_MM_dd_T_HH_mm_SSSZ(endCal);
//        mPlayer.setSurfaceTexture(surface);
        //TODO 注意: startPlayback() 方法会阻塞当前线程，需要在子线程中执行,建议使用RxJava
        new Thread(() -> {
          //TODO 注意: 不要通过判断 startPlayback() 方法返回 true 来确定播放成功，播放成功会通过HikVideoPlayerCallback回调，startPlayback() 方法返回 false 即代表 播放失败;
          //TODO 注意: seekTime 参数可以为NULL，表示无需定位到指定时间开始播放。
          if(mPlayerStatus != PlayerStatus.SUCCESS){
            if (!mPlayer.startPlayback(this.mUri, startfomTime, stopTime, this)) {
              onPlayerStatus(Status.FAILED, mPlayer.getLastError());
            }
          }else{
            mPlayer.stopPlay();
            if (!mPlayer.startPlayback(this.mUri, startfomTime, stopTime, this)) {
              onPlayerStatus(Status.FAILED, mPlayer.getLastError());
            }
          }

        }).start();
      }catch (Exception e){
        Log.e("error:",e.getStackTrace().toString());
      }


    }
  }


  @Override
  public void onPlayerStatus(@NonNull Status status, int errorCode) {
    runOnUiThread(new Runnable() {
      String name = PLAYBACK_EVENT_NAME.equals(mode)?PLAYBACK_EVENT_NAME:PREVIEW_EVENT_NAME;
      @Override
      public void run() {
//                progressBar.setVisibility(View.GONE);
        switch (status) {
          case SUCCESS:
            //播放成功
            mPlayerStatus = PlayerStatus.SUCCESS;
            sendEvent(name,EVENT_STATUS_SUCCESS);
//                        playHintText.setVisibility(View.GONE);
//                        textureView.setKeepScreenOn(true);//保持亮屏
            break;
          case FAILED:
            //播放失败
            mPlayerStatus = PlayerStatus.FAILED;
//                        playHintText.setVisibility(View.VISIBLE);
//                        playHintText.setText(MessageFormat.format("预览失败，错误码：{0}", Integer.toHexString(errorCode)));
            sendEvent(name,EVENT_STATUS_FAIL);
            mPlayer.stopPlay();
            ToastUtils.showShort(MessageFormat.format("播放失败，错误码：{0}", Integer.toHexString(errorCode)));
            break;
          case EXCEPTION:
            //取流异常
            mPlayerStatus = PlayerStatus.EXCEPTION;
            mPlayer.stopPlay();//TODO 注意:异常时关闭取流
            sendEvent(name,EVENT_STATUS_FAIL);
//                        playHintText.setVisibility(View.VISIBLE);
//                        playHintText.setText(MessageFormat.format("取流发生异常，错误码：{0}", Integer.toHexString(errorCode)));
            ToastUtils.showShort(MessageFormat.format("取流发生异常，错误码：{0}", Integer.toHexString(errorCode)));
            break;
        }
      }
    });
  }

  public void sendEvent(String name, String status){
    WritableMap event = Arguments.createMap();
    event.putString("eventName",name);
    event.putString("status",status);
    reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(player.getId(),"topChange",event);

  }

  @Override
  public void onSurfaceTextureAvailable(SurfaceTexture surface, int width, int height) {

    mPlayer.setVideoWindow(surface);
    mPlayer.setSurfaceTexture(surface);
    new Thread(() -> {
      if(this.mUri!=null && !"playback".equals(this.mode)) {
        //TODO 注意: 不要通过判断 startRealPlay() 方法返回 true 来确定播放成功，播放成功会通过HikVideoPlayerCallback回调，startRealPlay() 方法返回 false 即代表 播放失败;
        if (!mPlayer.startRealPlay(this.mUri, this)) {
//                  Log.v("")
//                this.onPlayerStatus(HikVideoPlayerCallback.Status.FAILED, mPlayer.getLastError());
        }
      }else{

        this.startPlayback(surface);
      }
    }).start();
  }

  @Override
  public void onSurfaceTextureSizeChanged(SurfaceTexture surface, int width, int height) {

  }

  @Override
  public boolean onSurfaceTextureDestroyed(SurfaceTexture surface) {
    mPlayer.stopPlay();

    return false;
  }

  @Override
  public void onSurfaceTextureUpdated(SurfaceTexture surface) {

  }

  /**
   * 执行抓图事件
   */
  public void executeCaptureEvent() {
    if (mPlayerStatus != PlayerStatus.SUCCESS) {
      ToastUtils.showShort("没有视频在播放");
    }
    String path =MyUtils.getCaptureImagePath(reactContext.getApplicationContext());
    //抓图
    if (mPlayer.capturePicture(MyUtils.getCaptureImagePath(reactContext.getApplicationContext()))) {
      ToastUtils.showShort("抓图成功");
      MediaScannerConnection.scanFile(reactContext.getApplicationContext(), new String[]{path}, null, null);
    }
  }

  private void startPlay(SurfaceTexture surfaceTexture){
//        mPlayer.setSurfaceTexture(surfaceTexture);
    ViewGroup parent = (ViewGroup)player.getParent();
    if(parent!=null){
      parent.removeView(player);
      parent.addView(player);
    }

    new Thread(() -> {
      //TODO 注意: 不要通过判断 startRealPlay() 方法返回 true 来确定播放成功，播放成功会通过HikVideoPlayerCallback回调，startRealPlay() 方法返回 false 即代表 播放失败;
      if(this.mUri!=null) {
        if (!mPlayer.startRealPlay(this.mUri, this)) {
//                this.onPlayerStatus(HikVideoPlayerCallback.Status.FAILED, mPlayer.getLastError());
        }
      }
    }).start();

  }


  /**
   * 执行录像事件
   */
  public void executeRecordEvent() {
    String path = MyUtils.getLocalRecordPath(reactContext.getApplicationContext());
    if (mPlayerStatus != PlayerStatus.SUCCESS) {
      ToastUtils.showShort("没有视频在播放");
    }

    if (!mRecording) {
      //开始录像
//            mRecordFilePathText.setText(null);

      if (mPlayer.startRecord(path)) {
        ToastUtils.showShort("开始录像");
        mRecording = true;
        MediaScannerConnection.scanFile(reactContext.getApplicationContext(), new String[]{path}, null, null);
//                recordButton.setText(R.string.close_record);
//                mRecordFilePathText.setText(MessageFormat.format("当前本地录像路径: {0}", path));
      }
    } else {
      //关闭录像
      mPlayer.stopRecord();
      ToastUtils.showShort("关闭录像");
      MediaScannerConnection.scanFile(reactContext.getApplicationContext(), new String[]{path}, null, null);
      mRecording = false;
//            recordButton.setText(R.string.start_record);
    }
  }

  /**
   * 执行声音开关事件
   */
  public void executeSoundEvent() {
    if (mPlayerStatus != PlayerStatus.SUCCESS) {
      ToastUtils.showShort("没有视频在播放");
    }

    if (!mSoundOpen) {
      //打开声音
      if (mPlayer.enableSound(true)) {
        ToastUtils.showShort("声音开");
        mSoundOpen = true;
//                soundButton.setText(R.string.sound_close);
      }
    } else {
      //关闭声音
      if (mPlayer.enableSound(false)) {
        ToastUtils.showShort("声音关");
        mSoundOpen = false;
//                soundButton.setText(R.string.sound_open);
      }
    }
  }


  /**
   *  After receiving the JS event. JS will send some of the corresponding instructions through the receiveCommand, Native will be handled by the.
   *  When an event occurs.
   */
  @Override
  public void receiveCommand(HKPlayer player, int commandId, @Nullable ReadableArray args) {

    Log.v("receiveCommand",String.valueOf(commandId));
    super.receiveCommand(player,commandId,args);
    switch (commandId) {
      case executeCaptureEvent:{
        this.executeCaptureEvent();
        return;
      }
      case executeRecordEvent:{
        this.executeRecordEvent();
        return;
      }
      case executeSoundEvent:{
        this.executeSoundEvent();
        return;
      }
      case startRealPlay:{
        if(player.getSurfaceTexture()!=null){
          mPlayer.setSurfaceTexture(player.getSurfaceTexture());
          new Thread(() -> {
            //TODO 注意: 不要通过判断 startRealPlay() 方法返回 true 来确定播放成功，播放成功会通过HikVideoPlayerCallback回调，startRealPlay() 方法返回 false 即代表 播放失败;
            if (!mPlayer.startRealPlay(this.mUri, this)) {
              Log.v("wj_this.mUri",this.mUri);
//                this.onPlayerStatus(HikVideoPlayerCallback.Status.FAILED, mPlayer.getLastError());
            }
          }).start();
        }
        return;
      }

      case stopPlay:{
        mPlayer.stopPlay();
        return;
      }
      case startPlayback:{
        if(player.getSurfaceTexture()!=null){
          mPlayer.setSurfaceTexture(player.getSurfaceTexture());
          this.startPlayback(player.getSurfaceTexture());
        }
        return;
      }
      case seekPlay:{
        if(player.getSurfaceTexture()!=null){
          this.seekTime(args);
        }
        return;
      }
    }
  }



}

