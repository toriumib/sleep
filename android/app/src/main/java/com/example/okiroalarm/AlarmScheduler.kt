package com.example.okiroalarm

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import java.util.Calendar

/** AlarmManagerによる正確なアラームのスケジューリング */
object AlarmScheduler {

    private const val REQUEST_CODE = 1001

    private fun pendingIntent(context: Context): PendingIntent {
        val intent = Intent(context, AlarmReceiver::class.java)
        return PendingIntent.getBroadcast(
            context, REQUEST_CODE, intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
    }

    /** 次の hour:minute に鳴るようスケジュール（過ぎていれば翌日） */
    fun schedule(context: Context, hour: Int, minute: Int) {
        val am = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

        // Android 12以降：正確なアラームの許可確認
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !am.canScheduleExactAlarms()) {
            // 設定画面へ誘導するのはMainActivity側の責務。ここでは何もしない。
            return
        }

        val cal = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, hour)
            set(Calendar.MINUTE, minute)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
            if (timeInMillis <= System.currentTimeMillis()) {
                add(Calendar.DAY_OF_YEAR, 1)
            }
        }

        // setAlarmClock はDozeでも確実に発火し、システムにアラームとして認識される
        val info = AlarmManager.AlarmClockInfo(cal.timeInMillis, pendingIntent(context))
        am.setAlarmClock(info, pendingIntent(context))
    }

    /** スヌーズ：指定分後に鳴らす */
    fun scheduleSnooze(context: Context, minutes: Int = 5) {
        val am = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !am.canScheduleExactAlarms()) return
        val t = System.currentTimeMillis() + minutes * 60_000L
        val info = AlarmManager.AlarmClockInfo(t, pendingIntent(context))
        am.setAlarmClock(info, pendingIntent(context))
    }

    fun cancel(context: Context) {
        val am = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        am.cancel(pendingIntent(context))
    }
}
