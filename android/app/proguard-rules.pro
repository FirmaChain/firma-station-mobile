# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# Room opens generated *Database_Impl classes with Class.getDeclaredConstructor().newInstance().
# The stock Room rule keeps the class name only, so R8 strips the unused no-arg constructor.
# WorkManager then crashes inside InitializationProvider before the activity starts.
-keepclassmembers class * extends androidx.room.RoomDatabase {
    public <init>();
}
