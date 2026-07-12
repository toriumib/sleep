package com.example.okiroalarm

import android.content.Context

/** アラーム設定の保存（SharedPreferences） */
data class AlarmSetting(
    val hour: Int,
    val minute: Int,
    val soundId: String,      // ContentDataのsound id または "custom"
    val customUri: String?,   // カスタム音源のURI（SAFで取得）
    val vibrate: Boolean,
    val escalate: Boolean,
    val enabled: Boolean,
)

object AlarmStore {
    private const val PREFS = "alarm_prefs"

    fun save(context: Context, s: AlarmSetting) {
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit()
            .putInt("hour", s.hour)
            .putInt("minute", s.minute)
            .putString("soundId", s.soundId)
            .putString("customUri", s.customUri)
            .putBoolean("vibrate", s.vibrate)
            .putBoolean("escalate", s.escalate)
            .putBoolean("enabled", s.enabled)
            .apply()
    }

    fun load(context: Context): AlarmSetting {
        val p = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        return AlarmSetting(
            hour = p.getInt("hour", 7),
            minute = p.getInt("minute", 0),
            soundId = p.getString("soundId", "alarm_classic_beep") ?: "alarm_classic_beep",
            customUri = p.getString("customUri", null),
            vibrate = p.getBoolean("vibrate", true),
            escalate = p.getBoolean("escalate", true),
            enabled = p.getBoolean("enabled", false),
        )
    }
}
