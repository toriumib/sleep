package com.example.okiroalarm

import android.app.KeyguardManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.okiroalarm.databinding.ActivityRingBinding
import kotlin.random.Random

/** ロック画面の上に全画面表示されるアラーム画面 */
class AlarmRingActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRingBinding
    private var ringStartMs: Long = 0L
    private val timerHandler = Handler(Looper.getMainLooper())
    private val timerRunnable = object : Runnable {
        override fun run() {
            val sec = (System.currentTimeMillis() - ringStartMs) / 1000
            binding.ringTimer.text = getString(R.string.ring_timer_format, sec)
            timerHandler.postDelayed(this, 500)
        }
    }

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

        ringStartMs = System.currentTimeMillis()
        timerHandler.post(timerRunnable)

        binding.stopButton.setOnClickListener { handleStop() }
        binding.snoozeButton.setOnClickListener { handleSnooze() }
    }

    private fun handleStop() {
        val elapsedSec = (System.currentTimeMillis() - ringStartMs) / 1000.0
        val penalized = Economy.consumePendingPenalty(this)
        val wasFirstStop = !Economy.getUnlockedBadges(this).contains("debut")

        Economy.recordWake(this, penalized)
        val reward = Economy.stopReward(elapsedSec, penalized)
        Economy.addCoins(this, reward)

        val newBadges = mutableListOf<Badge>()
        if (wasFirstStop && Economy.unlockBadge(this, "debut")) {
            newBadges += Economy.badges.first { it.id == "debut" }
        }
        if (elapsedSec <= 10 && Economy.unlockBadge(this, "speedster")) {
            newBadges += Economy.badges.first { it.id == "speedster" }
        }
        newBadges += Economy.checkBadges(this)

        var msg = getString(R.string.coin_reward_toast, reward)
        if (newBadges.isNotEmpty()) {
            msg += "\n" + newBadges.joinToString("\n") { "🏅 ${it.name}" }
        }
        Toast.makeText(this, msg, Toast.LENGTH_LONG).show()

        stopAlarmService()
        finish()
    }

    private fun handleSnooze() {
        if (!Economy.useTicket(this)) {
            Toast.makeText(this, R.string.no_ticket_toast, Toast.LENGTH_LONG).show()
            return
        }
        Economy.setPendingPenalty(this)
        Economy.recordWake(this, penalized = true)
        stopAlarmService()
        AlarmScheduler.scheduleSnooze(this, 5)
        finish()
    }

    private fun stopAlarmService() {
        stopService(Intent(this, AlarmService::class.java))
    }

    override fun onDestroy() {
        timerHandler.removeCallbacks(timerRunnable)
        super.onDestroy()
    }

    override fun onBackPressed() {
        // 誤操作で閉じないように無効化（ボタンで止める）
    }
}
