import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import UIKit

/// UIKit asks `window.rootViewController` for the status bar.
/// `react-native-screens` swizzles `childForStatusBarStyle` and forwards to `RNSScreen`.
/// That screen's unset style is `.auto`, which is dark text while the app interface style is light.
/// Returning nil keeps this controller's `.lightContent` as the style UIKit applies.
final class LightContentRootViewController: UIViewController {
  override var preferredStatusBarStyle: UIStatusBarStyle {
    .lightContent
  }

  override var childForStatusBarStyle: UIViewController? {
    nil
  }
}

class SceneDelegate: RCTDefaultReactNativeFactoryDelegate, UIWindowSceneDelegate {
  var window: UIWindow?
  var reactNativeFactory: RCTReactNativeFactory?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let windowScene = scene as? UIWindowScene else {
      return
    }

    dependencyProvider = RCTAppDependencyProvider()
    reactNativeFactory = RCTReactNativeFactory(delegate: self)
    window = UIWindow(windowScene: windowScene)
    (UIApplication.shared.delegate as? AppDelegate)?.window = window

    #if DEBUG
    let devMenuConfiguration = RCTDevMenuConfiguration(
      devMenuEnabled: true,
      shakeGestureEnabled: true,
      keyboardShortcutsEnabled: true
    )
    reactNativeFactory?.devMenuConfiguration = devMenuConfiguration
    #endif

    reactNativeFactory?.startReactNative(
      withModuleName: "firma_station_mobile",
      in: window,
      connectionOptions: connectionOptions
    )
  }

  func sceneDidDisconnect(_ scene: UIScene) {
    window = nil
    (UIApplication.shared.delegate as? AppDelegate)?.window = nil
  }

  func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    RCTLinkingManager.scene(scene, openURLContexts: URLContexts)
  }

  func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
    RCTLinkingManager.scene(scene, continue: userActivity)
  }

  override func createRootViewController() -> UIViewController {
    LightContentRootViewController()
  }

  override func bundleURL() -> URL? {
    #if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }
}
