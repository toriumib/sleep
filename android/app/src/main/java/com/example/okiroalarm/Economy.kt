package com.example.okiroalarm

import android.content.Context
import java.util.Calendar

/** 実績バッジの定義 */
data class Badge(val id: String, val icon: String, val name: String, val desc: String)

/**
 * 早起きコイン経済（SharedPreferences保存）。
 * Web版（web/data.js の ECON / BADGES）と数値を揃えている。
 */
object Economy {
    private const val PREFS = "econ_prefs"

    private const val INITIAL_COINS = 50
    private const val INITIAL_TICKETS = 1
    const val AD_REWARD = 25
    const val TICKET_PRICE = 30
    const val GACHA_PRICE = 20
    private const val SNOOZE_PENALTY_FACTOR = 0.5

    // アラーム停止までの秒数 → 獲得コイン
    private val STOP_TIERS = listOf(
        10 to 50,
        30 to 30,
        60 to 15,
        Int.MAX_VALUE to 5,
    )

    val badges = listOf(
        Badge("debut", "🌅", "はじめての朝", "初めてアラームを止めた"),
        Badge("speedster", "⚡", "光速の目覚め", "10秒以内にアラームを停止"),
        Badge("streak3", "🔥", "三日坊主卒業", "3日連続でスヌーズなし起床"),
        Badge("streak7", "👑", "早起きの王", "7日連続でスヌーズなし起床"),
        Badge("rich", "💰", "朝活長者", "累計500コイン獲得"),
        Badge("gacha_first", "🎰", "運試し", "初めてガチャを回した"),
    )

    private fun prefs(context: Context) = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

    fun getCoins(context: Context): Int = prefs(context).getInt("coins", INITIAL_COINS)

    fun getTickets(context: Context): Int = prefs(context).getInt("tickets", INITIAL_TICKETS)

    fun getStreak(context: Context): Int = prefs(context).getInt("streak", 0)

    fun getTotalEarned(context: Context): Int = prefs(context).getInt("totalEarned", 0)

    fun getUnlockedBadges(context: Context): Set<String> =
        prefs(context).getStringSet("badges", emptySet()) ?: emptySet()

    /** コインを加算（負数も可）。獲得分は累計獲得コインにも計上される。 */
    fun addCoins(context: Context, amount: Int) {
        val p = prefs(context)
        val newCoins = (getCoins(context) + amount).coerceAtLeast(0)
        val editor = p.edit().putInt("coins", newCoins)
        if (amount > 0) editor.putInt("totalEarned", getTotalEarned(context) + amount)
        editor.apply()
    }

    /** コインを消費。足りなければfalseを返し何もしない。 */
    fun spendCoins(context: Context, amount: Int): Boolean {
        if (getCoins(context) < amount) return false
        addCoins(context, -amount)
        return true
    }

    fun addTicket(context: Context, n: Int = 1) {
        prefs(context).edit().putInt("tickets", getTickets(context) + n).apply()
    }

    /** チケットを1枚消費。無ければfalse。 */
    fun useTicket(context: Context): Boolean {
        val t = getTickets(context)
        if (t <= 0) return false
        prefs(context).edit().putInt("tickets", t - 1).apply()
        return true
    }

    /** スヌーズ時：次にアラームが鳴ったときに報酬を半減させるフラグを立てる */
    fun setPendingPenalty(context: Context) {
        prefs(context).edit().putBoolean("pendingPenalty", true).apply()
    }

    /** 保留中のペナルティフラグを読み出して消費する */
    fun consumePendingPenalty(context: Context): Boolean {
        val p = prefs(context)
        val v = p.getBoolean("pendingPenalty", false)
        if (v) p.edit().putBoolean("pendingPenalty", false).apply()
        return v
    }

    /** 停止までの秒数から獲得コインを計算（ペナルティ適用込み） */
    fun stopReward(elapsedSec: Double, penalized: Boolean): Int {
        val tierCoins = STOP_TIERS.first { elapsedSec <= it.first }.second
        return if (penalized) Math.round(tierCoins * SNOOZE_PENALTY_FACTOR).toInt() else tierCoins
    }

    /**
     * 起床（アラーム停止）を記録し、連続記録を更新する。
     * スヌーズ経由（penalized）の場合は連続記録をリセットする。
     */
    fun recordWake(context: Context, penalized: Boolean) {
        val p = prefs(context)
        if (penalized) {
            p.edit().putInt("streak", 0).apply()
            return
        }
        val todayKey = dayKey(Calendar.getInstance())
        val lastKey = p.getString("lastWakeDateKey", null)
        if (lastKey == todayKey) return // 同日二重加算防止
        val yesterday = Calendar.getInstance().apply { add(Calendar.DAY_OF_YEAR, -1) }
        val newStreak = if (lastKey == dayKey(yesterday)) getStreak(context) + 1 else 1
        p.edit()
            .putInt("streak", newStreak)
            .putString("lastWakeDateKey", todayKey)
            .apply()
    }

    private fun dayKey(cal: Calendar): String =
        "${cal.get(Calendar.YEAR)}-${cal.get(Calendar.DAY_OF_YEAR)}"

    fun unlockBadge(context: Context, id: String): Boolean {
        val current = getUnlockedBadges(context)
        if (current.contains(id)) return false
        prefs(context).edit().putStringSet("badges", current + id).apply()
        return true
    }

    /** 起床/コイン状況からバッジ達成をチェックし、新規解除されたバッジのリストを返す */
    fun checkBadges(context: Context): List<Badge> {
        val unlocked = mutableListOf<Badge>()
        if (getTotalEarned(context) >= 500 && unlockBadge(context, "rich")) {
            unlocked += badges.first { it.id == "rich" }
        }
        if (getStreak(context) >= 3 && unlockBadge(context, "streak3")) {
            unlocked += badges.first { it.id == "streak3" }
        }
        if (getStreak(context) >= 7 && unlockBadge(context, "streak7")) {
            unlocked += badges.first { it.id == "streak7" }
        }
        return unlocked
    }
}
