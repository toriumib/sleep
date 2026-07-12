package com.example.okiroalarm

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/** 再起動後にアラームを再登録する */
class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED) {
            val s = AlarmStore.load(context)
            if (s.enabled) {
                AlarmScheduler.schedule(context, s.hour, s.minute)
            }
        }
    }
}
