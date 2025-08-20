package com.firma_station_mobile;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
// import org.devio.rn.splashscreen.SplashScreen;
// import android.os.Bundle;

public class MainActivity extends ReactActivity {

  // @Override
  // protected void onCreate(Bundle savedInstanceState) {
  //   SplashScreen.show(this);
  //   super.onCreate(savedInstanceState);
  // }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "firma_station_mobile";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }
  
 
  // public static class MainActivityDelegate extends ReactActivityDelegate {
  //   public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
  //     super(activity, mainComponentName);
  //   }
 
  //   @Override
  //   protected ReactRootView createRootView() {
  //     ReactRootView reactRootView = new ReactRootView(getContext());
  //     // If you opted-in for the New Architecture, we enable the Fabric Renderer.
  //     // New delegate and enabling Fabric in ReactRootView is only required for the new architecture builds.
  //     reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
  //     return reactRootView;
  //   }
 
  //   @Override
  //   protected boolean isConcurrentRootEnabled() {
  //     // If you opted-in for the New Architecture, we enable Concurrent Root (i.e. React 18).
  //     // More on this on https://reactjs.org/blog/2022/03/29/react-v18.html
  //     return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
  //   }
  // }
}
