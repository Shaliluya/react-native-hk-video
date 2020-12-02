
package com.qb.hkVideo;


import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.Gravity;

import com.blankj.utilcode.util.ToastUtils;
import com.blankj.utilcode.util.Utils;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.hikvision.open.hikvideoplayer.HikVideoPlayerFactory;

import org.json.JSONObject;

import java.util.Iterator;
import java.util.Map;

/**
 * 原生Activity与React交互——模块
 */

public class RNHkVideoModule extends ReactContextBaseJavaModule {

  public RNHkVideoModule(ReactApplicationContext reactContext) {
    super(reactContext);
//    HikVideoPlayerFactory.initLib(null, true);
    Log.v("onCreate","onCreateasdasdsa");
  }

  @Override
  public String getName() {
    return "RNHkVideoModule";
  }
  //注意：记住getName方法中的命名名称，JS中调用需要

  @ReactMethod
  public void startActivityFromJS(String name, String params){
//
    try{
      Activity currentActivity = getCurrentActivity();
//      HikVideoPlayerFactory.initLib(null, true);
      if(null!=currentActivity){
        Class toActivity = Class.forName(name);
        Intent intent = new Intent(currentActivity,toActivity);
        Bundle bundle = new Bundle();
        Log.v("params", params);
        JSONObject objects = new JSONObject(params);
        Iterator<String> keys = objects.keys();
        while (keys.hasNext()){
          String key = keys.next();
          String value = objects.getString(key);
          Log.v(key, value);
          bundle.putString(key, value);
        }
        intent.putExtras(bundle);
        currentActivity.startActivity(intent);
      }
    }catch(Exception e){
      throw new JSApplicationIllegalArgumentException(
              "不能打开Activity : "+e.getMessage());
    }
  }

  @ReactMethod
  public void initSdk(){
    try{
      HikVideoPlayerFactory.initLib(null, true);
      Log.v("wj_initSdk","success");
//      successBack.invoke();
    }catch (Exception e){
//      errorBack.invoke(e.getMessage());
      Log.v("出错啦！！", e.getMessage());
    }
  }

  @ReactMethod
  public void dataToJS(Callback successBack, Callback errorBack){
    try{
      Activity currentActivity = getCurrentActivity();
      String result = currentActivity.getIntent().getStringExtra("data");
      if (TextUtils.isEmpty(result)){
        result = "没有数据";
      }
      successBack.invoke(result);
    }catch (Exception e){
      errorBack.invoke(e.getMessage());
    }
  }
//注意：startActivityFromJS、dataToJS方法添加RN注解(@ReactMethod)，否则该方法将不被添加到RN中
}
