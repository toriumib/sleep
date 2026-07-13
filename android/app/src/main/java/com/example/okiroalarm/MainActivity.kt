package com.example.okiroalarm

import android.app.AlarmManager
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import com.example.okiroalarm.databinding.ActivityMainBinding
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback
import java.util.Calendar

// リワード広告のテストユニットID（本番では自分のIDに差し替えること。README参照）
private const val REWARDED_AD_UNIT_ID = "ca-app-pub-3940256099942544/5224354917"

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private var customUri: String? = null
    private var previewPlayer: MediaPlayer? = null
    private var rewardedAd: RewardedAd? = null

    // 通知権限（Android 13+）
    private val notifPermission =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) {}

    // カスタム音源選択（SAF）
    private val pickAudio =
        registerForActivityResult(ActivityResultContracts.OpenDocument()) { uri: Uri? ->
            if (uri != null) {
                contentResolver.takePersistableUriPermission(
                    uri, Intent.FLAG_GRANT_READ_URI_PERMISSION
                )
                customUri = uri.toString()
                binding.customSoundLabel.text = getString(R.string.custom_selected)
                Toast.makeText(this, R.string.custom_selected, Toast.LENGTH_SHORT).show()
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // AdMob初期化（テスト広告）
        MobileAds.initialize(this)
        binding.adView.loadAd(AdRequest.Builder().build())

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            notifPermission.launch(android.Manifest.permission.POST_NOTIFICATIONS)
        }

        setupTabs()
        setupAlarmUi()
        setupShopUi()
        renderQuotes()
        renderTips()
        loadSetting()
        loadRewardedAd()
    }

    override fun onResume() {
        super.onResume()
        renderEconBar()
        renderShop()
    }

    // ---------- タブ ----------
    private fun setupTabs() {
        fun show(alarm: Boolean, quotes: Boolean, tips: Boolean, shop: Boolean) {
            binding.panelAlarm.visibility = if (alarm) android.view.View.VISIBLE else android.view.View.GONE
            binding.panelQuotes.visibility = if (quotes) android.view.View.VISIBLE else android.view.View.GONE
            binding.panelTips.visibility = if (tips) android.view.View.VISIBLE else android.view.View.GONE
            binding.panelShop.visibility = if (shop) android.view.View.VISIBLE else android.view.View.GONE
            if (shop) renderShop()
        }
        binding.tabAlarm.setOnClickListener { show(true, false, false, false) }
        binding.tabQuotes.setOnClickListener { show(false, true, false, false) }
        binding.tabTips.setOnClickListener { show(false, false, true, false) }
        binding.tabShop.setOnClickListener { show(false, false, false, true) }
    }

    // ---------- コイン経済 / ショップ ----------
    private fun renderEconBar() {
        binding.econBar.text = getString(
            R.string.econ_bar_format,
            Economy.getCoins(this),
            Economy.getStreak(this),
            Economy.getTickets(this),
        )
    }

    private fun renderShop() {
        renderEconBar()
        binding.shopBalanceText.text = getString(R.string.shop_balance_format, Economy.getCoins(this))
        binding.buyTicketButton.text = getString(R.string.buy_ticket_format, Economy.TICKET_PRICE)
        binding.gachaButton.text = getString(R.string.gacha_button_format, Economy.GACHA_PRICE)
        val unlocked = Economy.getUnlockedBadges(this)
        val sb = StringBuilder()
        Economy.badges.forEach { b ->
            val icon = if (unlocked.contains(b.id)) b.icon else "🔒"
            sb.append(icon).append(" ").append(b.name).append(" — ").append(b.desc).append("\n")
        }
        binding.badgesText.text = sb.toString().trim()
    }

    private fun setupShopUi() {
        binding.watchAdButton.text = getString(R.string.watch_ad, Economy.AD_REWARD)
        binding.watchAdButton.setOnClickListener {
            val ad = rewardedAd
            if (ad == null) {
                Toast.makeText(this, R.string.ad_not_ready, Toast.LENGTH_SHORT).show()
                loadRewardedAd()
                return@setOnClickListener
            }
            ad.fullScreenContentCallback = object : FullScreenContentCallback() {
                override fun onAdDismissedFullScreenContent() {
                    rewardedAd = null
                    loadRewardedAd()
                }
                override fun onAdFailedToShowFullScreenContent(adError: AdError) {
                    rewardedAd = null
                    loadRewardedAd()
                }
            }
            ad.show(this) {
                Economy.addCoins(this, Economy.AD_REWARD)
                Toast.makeText(this, getString(R.string.coin_reward_toast, Economy.AD_REWARD), Toast.LENGTH_SHORT).show()
                renderShop()
            }
        }

        binding.buyTicketButton.setOnClickListener {
            if (Economy.spendCoins(this, Economy.TICKET_PRICE)) {
                Economy.addTicket(this)
                Toast.makeText(this, R.string.ticket_purchased, Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this, R.string.not_enough_coins, Toast.LENGTH_SHORT).show()
            }
            renderShop()
        }

        binding.gachaButton.setOnClickListener {
            if (!Economy.spendCoins(this, Economy.GACHA_PRICE)) {
                Toast.makeText(this, R.string.not_enough_coins, Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            val roll = Math.random()
            val result = when {
                roll < 0.05 -> { Economy.addCoins(this, 100); "🎉 大当たり！ +100🪙" }
                roll < 0.35 -> { Economy.addCoins(this, 30); "✨ 当たり！ +30🪙" }
                roll < 0.55 -> { Economy.addTicket(this); "😴 スヌーズチケット×1 ゲット！" }
                roll < 0.8 -> { Economy.addCoins(this, 5); "🙂 +5🪙" }
                else -> "💪 「今日も一日頑張ろう！」（はずれ）"
            }
            binding.gachaResultText.text = result
            Economy.unlockBadge(this, "gacha_first")
            renderShop()
        }
    }

    private fun loadRewardedAd() {
        RewardedAd.load(
            this, REWARDED_AD_UNIT_ID, AdRequest.Builder().build(),
            object : RewardedAdLoadCallback() {
                override fun onAdLoaded(ad: RewardedAd) {
                    rewardedAd = ad
                }
                override fun onAdFailedToLoad(error: LoadAdError) {
                    rewardedAd = null
                }
            }
        )
    }

    // ---------- アラームUI ----------
    private fun setupAlarmUi() {
        binding.timePicker.setIs24HourView(true)

        val labels = ContentData.sounds.map { it.label } + getString(R.string.custom_sound)
        binding.soundSpinner.adapter =
            ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, labels)

        binding.pickCustomButton.setOnClickListener {
            pickAudio.launch(arrayOf("audio/*"))
        }

        binding.previewButton.setOnClickListener { previewSelected() }

        binding.setAlarmButton.setOnClickListener { saveAndSchedule() }
        binding.cancelAlarmButton.setOnClickListener {
            AlarmScheduler.cancel(this)
            val s = AlarmStore.load(this).copy(enabled = false)
            AlarmStore.save(this, s)
            binding.statusText.text = getString(R.string.alarm_off)
            Toast.makeText(this, R.string.alarm_canceled, Toast.LENGTH_SHORT).show()
        }
    }

    private fun selectedSoundId(): String {
        val idx = binding.soundSpinner.selectedItemPosition
        return if (idx >= ContentData.sounds.size) "custom" else ContentData.sounds[idx].id
    }

    private fun previewSelected() {
        stopPreview()
        val attrs = AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_ALARM)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build()
        previewPlayer = MediaPlayer().apply {
            setAudioAttributes(attrs)
            val id = selectedSoundId()
            if (id == "custom" && customUri != null) {
                setDataSource(this@MainActivity, Uri.parse(customUri))
            } else {
                val def = ContentData.sounds.find { it.id == id } ?: ContentData.sounds.first()
                val afd = resources.openRawResourceFd(def.resId)
                setDataSource(afd.fileDescriptor, afd.startOffset, afd.length)
                afd.close()
            }
            prepare()
            start()
        }
        binding.root.postDelayed({ stopPreview() }, 5000)
    }

    private fun stopPreview() {
        previewPlayer?.let {
            try { it.stop() } catch (_: Exception) {}
            it.release()
        }
        previewPlayer = null
    }

    private fun saveAndSchedule() {
        val am = getSystemService(Context.ALARM_SERVICE) as AlarmManager
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !am.canScheduleExactAlarms()) {
            // 正確なアラーム権限の設定画面へ
            startActivity(Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM))
            Toast.makeText(this, R.string.need_exact_alarm, Toast.LENGTH_LONG).show()
            return
        }

        val hour = binding.timePicker.hour
        val minute = binding.timePicker.minute
        val setting = AlarmSetting(
            hour = hour,
            minute = minute,
            soundId = selectedSoundId(),
            customUri = customUri,
            vibrate = binding.vibrateCheck.isChecked,
            escalate = binding.escalateCheck.isChecked,
            enabled = true,
        )
        AlarmStore.save(this, setting)
        AlarmScheduler.schedule(this, hour, minute)

        val next = nextTimeLabel(hour, minute)
        binding.statusText.text = getString(R.string.alarm_set_status, next)
        Toast.makeText(this, R.string.alarm_set, Toast.LENGTH_SHORT).show()
    }

    private fun nextTimeLabel(hour: Int, minute: Int): String {
        val cal = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, hour)
            set(Calendar.MINUTE, minute)
            set(Calendar.SECOND, 0)
            if (timeInMillis <= System.currentTimeMillis()) add(Calendar.DAY_OF_YEAR, 1)
        }
        val today = Calendar.getInstance().get(Calendar.DAY_OF_YEAR) == cal.get(Calendar.DAY_OF_YEAR)
        return String.format(
            "%s %02d:%02d",
            if (today) getString(R.string.today) else getString(R.string.tomorrow),
            hour, minute
        )
    }

    private fun loadSetting() {
        val s = AlarmStore.load(this)
        binding.timePicker.hour = s.hour
        binding.timePicker.minute = s.minute
        binding.vibrateCheck.isChecked = s.vibrate
        binding.escalateCheck.isChecked = s.escalate
        customUri = s.customUri
        val idx = ContentData.sounds.indexOfFirst { it.id == s.soundId }
        binding.soundSpinner.setSelection(if (s.soundId == "custom") ContentData.sounds.size else maxOf(idx, 0))
        binding.statusText.text =
            if (s.enabled) getString(R.string.alarm_set_status, nextTimeLabel(s.hour, s.minute))
            else getString(R.string.alarm_off)
    }

    // ---------- 名言 / Tips ----------
    private fun renderQuotes() {
        val sb = StringBuilder()
        ContentData.quotes.forEach { q ->
            sb.append("『").append(q.text).append("』\n— ").append(q.author).append("\n\n")
        }
        binding.quotesText.text = sb.toString().trim()
    }

    private fun renderTips() {
        val sb = StringBuilder()
        ContentData.tips.forEach { t ->
            sb.append(t.icon).append(" ").append(t.title).append("\n")
                .append(t.body).append("\n\n")
        }
        binding.tipsText.text = sb.toString().trim()
    }

    override fun onDestroy() {
        stopPreview()
        super.onDestroy()
    }
}
