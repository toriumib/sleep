package com.example.okiroalarm

import android.app.KeyguardManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.example.okiroalarm.databinding.ActivityRingBinding
import kotlin.random.Random

/** ロック画面の上に全画面表示されるアラーム画面 */
class AlarmRingActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRingBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // ロック画面上に表示 + 画面点灯
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
            val km = getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager
            km.requestDismissKeyguard(this, null)
        } else {
            @Suppress("DEPRECATION")
            window.addFlags(
                android.view.WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                android.view.WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
            )
        }

        binding = ActivityRingBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // ランダムな名言を表示
        val q = ContentData.quotes[Random.nextInt(ContentData.quotes.size)]
        binding.ringQuote.text = "${q.text}\n— ${q.author}"

        binding.stopButton.setOnClickListener {
            stopAlarmService()
            finish()
        }
        binding.snoozeButton.setOnClickListener {
            stopAlarmService()
            AlarmScheduler.scheduleSnooze(this, 5)
            finish()
        }
    }

    private fun stopAlarmService() {
        stopService(Intent(this, AlarmService::class.java))
    }

    override fun onBackPressed() {
        // 誤操作で閉じないように無効化（ボタンで止める）
    }
}
