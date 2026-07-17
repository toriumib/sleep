plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.example.okiroalarm"
    compileSdk = 34

    defaultConfig {
        // Playストアは com.example.* を拒否するため独自IDを使用。
        // ※初回アップロード後は二度と変更できない。変えたい場合は公開前に。
        applicationId = "io.github.toriumib.okiroalarm"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }

    // リリース署名（CI/ローカルとも環境変数 or gradle.properties から読み込み。未設定なら署名せずビルドする）
    val storePath = System.getenv("KEYSTORE_PATH") ?: findProperty("RELEASE_STORE_FILE") as String?
    if (!storePath.isNullOrBlank()) {
        signingConfigs {
            create("release") {
                storeFile = file(storePath)
                storePassword = System.getenv("KEYSTORE_PASSWORD") ?: findProperty("RELEASE_STORE_PASSWORD") as String?
                keyAlias = System.getenv("KEY_ALIAS") ?: findProperty("RELEASE_KEY_ALIAS") as String?
                keyPassword = System.getenv("KEY_PASSWORD") ?: findProperty("RELEASE_KEY_PASSWORD") as String?
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            if (!storePath.isNullOrBlank()) {
                signingConfig = signingConfigs.getByName("release")
            }
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        viewBinding = true
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("com.google.android.material:material:1.12.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    // Google Mobile Ads SDK (AdMob)
    implementation("com.google.android.gms:play-services-ads:23.2.0")
}
