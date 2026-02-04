#   http://developer.android.com/guide/developing/tools/proguard.html

-keep class com.facebook.react.** { *; }
-dontwarn com.facebook.react.**
-keep class digital.identi.micacao.comercializa.BuildConfig { *; }
-keep class io.realm.** { *; }
-dontwarn io.realm.**
-keep class androidx.fragment.app.** { *; }
-dontwarn androidx.fragment.app.**
-keep class com.facebook.soloader.** { *; }
-dontwarn com.facebook.soloader.**
-keep class com.swmansion.** { *; }
-dontwarn com.swmansion.**
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
