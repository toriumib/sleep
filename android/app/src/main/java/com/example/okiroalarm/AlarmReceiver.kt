package com.example.okiroalarm

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.core.content.ContextCompat

/** AlarmManagerからの発火を受けてフォアグラウンドサービスを開始 */
class AlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val serviceIntent = Intent(context, AlarmService::class.java)
        ContextCompat.startForegroundService(context, serviceIntent)
        // 毎日鳴らすため翌日分を再スケジュール
        val s = AlarmStore.load(context)
        if (s.enabled) {
            AlarmScheduler.schedule(context, s.hour, s.minute)
        }
    }
}
