import FirebaseCore
import UIKit
import UserNotifications

@main
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate {
  var window: UIWindow?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // Prevent app crash if GoogleService-Info.plist is missing
    if let _ = Bundle.main.path(forResource: "GoogleService-Info", ofType: "plist") {
      if FirebaseApp.app() == nil {
        FirebaseApp.configure()
      }
    } else {
      print("[FCM] GoogleService-Info.plist not found; iOS Firebase setup is disabled until the file is added.")
    }

    UNUserNotificationCenter.current().delegate = self

    return true
  }
}
