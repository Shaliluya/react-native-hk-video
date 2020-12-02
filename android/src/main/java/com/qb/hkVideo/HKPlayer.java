package com.qb.hkVideo;

import android.content.Context;
import android.graphics.SurfaceTexture;

import androidx.annotation.NonNull;
import androidx.annotation.WorkerThread;
import android.util.Log;
import android.view.TextureView;
import android.view.View;

import com.blankj.utilcode.util.ToastUtils;
import com.hikvision.open.hikvideoplayer.HikVideoPlayer;
import com.hikvision.open.hikvideoplayer.HikVideoPlayerCallback;

import java.text.MessageFormat;

import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;

class HKPlayer extends TextureView implements View.OnClickListener, HikVideoPlayerCallback, TextureView.SurfaceTextureListener{
  private static final String TAG = "HKPlayer";

  private HikVideoPlayer mPlayer;
  private PlayerStatus mPlayerStatus = PlayerStatus.IDLE;//默认闲置
  private boolean mRecording = false;
  private Context context ;
  private boolean mSoundOpen = false;
  private String mUri="";

  public HKPlayer(Context context) {
    super(context);
    this.setSurfaceTextureListener(this);
    this.context=context;
  }


  public void setUri(String uri){
    this.mUri=uri;
  }

  /**
   * 执行抓图事件
   */
  public void executeCaptureEvent() {
    if (mPlayerStatus != PlayerStatus.SUCCESS) {
      ToastUtils.showShort("没有视频在播放");
    }

    //抓图
    if (mPlayer.capturePicture(MyUtils.getCaptureImagePath(this.context))) {
      ToastUtils.showShort("抓图成功");
    }
  }

  /**
   * 执行录像事件
   */
  public void executeRecordEvent() {
    if (mPlayerStatus != PlayerStatus.SUCCESS) {
      ToastUtils.showShort("没有视频在播放");
    }

    if (!mRecording) {
      //开始录像
//            mRecordFilePathText.setText(null);
      String path = MyUtils.getLocalRecordPath(this.context);
      if (mPlayer.startRecord(path)) {
        ToastUtils.showShort("开始录像");
        mRecording = true;
//                recordButton.setText(R.string.close_record);
//                mRecordFilePathText.setText(MessageFormat.format("当前本地录像路径: {0}", path));
      }
    } else {
      //关闭录像
      mPlayer.stopRecord();
      ToastUtils.showShort("关闭录像");
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

  public void stopPlay (){
    mPlayer.stopPlay();
  }


  /**
   * 开始播放
   *
   *
   */
  public void startRealPlay() {
    mPlayer.setSurfaceTexture(this.getSurfaceTexture());
    //TODO 注意: startRealPlay() 方法会阻塞当前线程，需要在子线程中执行,建议使用RxJava
    new Thread(() -> {
      //TODO 注意: 不要通过判断 startRealPlay() 方法返回 true 来确定播放成功，播放成功会通过HikVideoPlayerCallback回调，startRealPlay() 方法返回 false 即代表 播放失败;
      if (!mPlayer.startRealPlay(this.mUri, this)) {
        this.onPlayerStatus(Status.FAILED, mPlayer.getLastError());
      }
    }).start();
  }


  /**
   * 播放结果回调
   *
   * @param status    共四种状态：SUCCESS（播放成功）、FAILED（播放失败）、EXCEPTION（取流异常）、FINISH（回放结束）
   * @param errorCode 错误码，只有 FAILED 和 EXCEPTION 才有值
   */
  @Override
  @WorkerThread
  public void onPlayerStatus(@NonNull Status status, int errorCode) {
    //TODO 注意: 由于 HikVideoPlayerCallback 是在子线程中进行回调的，所以一定要切换到主线程处理UI
    runOnUiThread(new Runnable() {
      @Override
      public void run() {
//                progressBar.setVisibility(View.GONE);
        switch (status) {
          case SUCCESS:
            //播放成功
            mPlayerStatus = PlayerStatus.SUCCESS;
//                        playHintText.setVisibility(View.GONE);
//                        textureView.setKeepScreenOn(true);//保持亮屏
            break;
          case FAILED:
            //播放失败
            mPlayerStatus = PlayerStatus.FAILED;
//                        playHintText.setVisibility(View.VISIBLE);
//                        playHintText.setText(MessageFormat.format("预览失败，错误码：{0}", Integer.toHexString(errorCode)));
            ToastUtils.showShort(MessageFormat.format("预览失败，错误码：{0}", Integer.toHexString(errorCode)));
            break;
          case EXCEPTION:
            //取流异常
            mPlayerStatus = PlayerStatus.EXCEPTION;
            mPlayer.stopPlay();//TODO 注意:异常时关闭取流
//                        playHintText.setVisibility(View.VISIBLE);
//                        playHintText.setText(MessageFormat.format("取流发生异常，错误码：{0}", Integer.toHexString(errorCode)));
            ToastUtils.showShort(MessageFormat.format("取流发生异常，错误码：{0}", Integer.toHexString(errorCode)));
            break;
        }
      }
    });
  }






  @Override
  public void onSurfaceTextureAvailable(SurfaceTexture surface, int width, int height) {
    this.setSurfaceTexture(surface);
    if (mPlayerStatus == PlayerStatus.STOPPING) {
      //恢复处于暂停播放状态的窗口
      startRealPlay();
      Log.d(TAG, "onSurfaceTextureAvailable: startRealPlay");
    }
  }

  @Override
  public void onSurfaceTextureSizeChanged(SurfaceTexture surface, int width, int height) {

  }

  @Override
  public boolean onSurfaceTextureDestroyed(SurfaceTexture surface) {
    if (mPlayerStatus == PlayerStatus.SUCCESS) {
      mPlayerStatus = PlayerStatus.STOPPING;//暂停播放，再次进入时恢复播放
      mPlayer.stopPlay();
      Log.d(TAG, "onSurfaceTextureDestroyed: stopPlay");
    }
    return false;
  }

  @Override
  public void onSurfaceTextureUpdated(SurfaceTexture surface) {

  }


  @Override
  public void onClick(View v) {

  }

}
