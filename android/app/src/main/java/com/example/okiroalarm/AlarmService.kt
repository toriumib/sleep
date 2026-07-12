package com.example.okiroalarm

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.net.Uri
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import androidx.core.app.NotificationCompat

/**
 * アラーム鳴動サービス。
 * - USAGE_ALARM のAudioAttributesで再生するため、マナーモードでもアラーム音量で鳴る
 * - 音量エスカレーション（徐々に大きく）
 * - バイブレーション
 * - フルスクリーンインテント通知でロック画面上にAlarmRingActivityを表示
 */
class AlarmService : Service() {

    companion object {
        const val CHANNEL_ID = "alarm_channel"
        const val NOTIFICATION_ID = 1
        const val ACTION_STOP = "com.example.okiroalarm.STOP"
        var isRunning = false
            private set
    }

    private var player: MediaPlayer? = null
    private var vibrator: Vibrator? = null
    private val handler = Handler(Looper.getMainLooper())
    private var volume = 0.15f

    private val escalateRunnable = object : Runnable {
        override fun run() {
            volume = (volume + 0.05f).coerceAtMost(1.0f)
            player?.setVolume(volume, volume)
            if (volume < 1.0f) handler.postDelayed(this, 1500)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.action == ACTION_STOP) {
            stopSelf()
            return START_NOT_STICKY
        }
        isRunning = true
        val setting = AlarmStore.load(this)

        startForeground(NOTIFICATION_ID, buildNotification())
        startSound(setting)
        if (setting.vibrate) startVibration()
        return START_STICKY
    }

    private fun buildNotification(): android.app.Notification {
        val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val ch = NotificationChannel(
                CHANNEL_ID, getString(R.string.channel_name),
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = getString(R.string.channel_desc)
                setSound(null, null) // 音はServiceが自前で鳴らす
                enableVibration(false)
            }
            nm.createNotificationChannel(ch)
        }

        val fullScreenIntent = Intent(this, AlarmRingActivity::class.java)
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        val fullScreenPending = PendingIntent.getActivity(
            this, 0, fullScreenIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        val stopIntent = Intent(this, AlarmService::class.java).setAction(ACTION_STOP)
        val stopPending = PendingIntent.getService(
            this, 1, stopIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle(getString(R.string.ring_title))
            .setContentText(getString(R.string.ring_text))
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setFullScreenIntent(fullScreenPending, true)
            .addAction(0, getString(R.string.stop), stopPending)
            .setOngoing(true)
            .build()
    }

    private fun startSound(setting: AlarmSetting) {
        val attrs = AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_ALARM) // アラームストリーム：マナーモードでも鳴る
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build()

        player = MediaPlayer().apply {
            setAudioAttributes(attrs)
            if (setting.soundId == "custom" && setting.customUri != null) {
                try {
                    setDataSource(this@AlarmService, Uri.parse(setting.customUri))
                } catch (e: Exception) {
                    // カスタム音源が読めない場合はデフォルト音にフォールバック
                    setBuiltinSource(this, "alarm_classic_beep")
                }
            } else {
                setBuiltinSource(this, setting.soundId)
            }
            isLooping = true
            if (setting.escalate) {
                setVolume(volume, volume)
            } else {
                setVolume(1f, 1f)
            }
            prepare()
            start()
        }
        if (setting.escalate) handler.postDelayed(escalateRunnable, 1500)
    }

    private fun setBuiltinSource(mp: MediaPlayer, soundId: String) {
        val def = ContentData.sounds.find { it.id == soundId } ?: ContentData.sounds.first()
        val afd = resources.openRawResourceFd(def.resId)
        mp.setDataSource(afd.fileDescriptor, afd.startOffset, afd.length)
        afd.close()
    }

    private fun startVibration() {
        vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            (getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager).defaultVibrator
        } else {
            @Suppress("DEPRECATION")
            getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
        }
        val pattern = longArrayOf(0, 600, 200, 600, 200, 1000, 300)
        vibrator?.vibrate(
            VibrationEffect.createWaveform(pattern, 0),
            AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ALARM).build()
        )
    }

    override fun onDestroy() {
        isRunning = false
        handler.removeCallbacks(escalateRunnable)
        player?.let {
            try { it.stop() } catch (_: Exception) {}
            it.release()
        }
        player = null
        vibrator?.cancel()
        super.onDestroy()
    }
}
