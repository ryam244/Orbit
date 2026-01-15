/**
 * Achievements screen
 * Display all achievements with unlock status and progress
 */

import React from 'react';
import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useGameStore } from '../stores/useGameStore';
import {
  getAllAchievements,
  CATEGORY_NAMES,
  type AchievementCategory,
} from '../constants/AchievementConfig';

export default function AchievementsScreen() {
  const achievements = useGameStore((state) => state.achievements);

  // Group achievements by category
  const allAchievements = getAllAchievements();
  const categories: AchievementCategory[] = [
    'beginner',
    'score',
    'combo',
    'mastery',
    'special',
  ];

  // Count unlocked achievements
  const totalAchievements = allAchievements.length;
  const unlockedCount = Object.values(achievements).filter((a) => a.unlocked).length;
  const progressPercent = Math.round((unlockedCount / totalAchievements) * 100);

  // Check if ad-free is unlocked
  const isAdFree = achievements['ad_free']?.unlocked || false;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Link href="/" asChild>
          <Pressable style={styles.backButton}>
            <Text style={styles.backText}>← BACK</Text>
          </Pressable>
        </Link>
        <Text style={styles.title}>ACHIEVEMENTS</Text>
        <View style={styles.backButton} />
      </View>

      {/* Progress summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          {unlockedCount} / {totalAchievements} UNLOCKED
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={styles.percentText}>{progressPercent}%</Text>
        {isAdFree && (
          <View style={styles.adFreeBadge}>
            <Text style={styles.adFreeText}>🎁 AD-FREE UNLOCKED!</Text>
          </View>
        )}
      </View>

      {/* Achievement list */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((category) => {
          const categoryAchievements = allAchievements.filter(
            (a) => a.category === category
          );

          return (
            <View key={category} style={styles.category}>
              <Text style={styles.categoryTitle}>{CATEGORY_NAMES[category]}</Text>
              {categoryAchievements.map((achievement) => {
                const progress = achievements[achievement.id];
                const unlocked = progress?.unlocked || false;
                const currentProgress = progress?.progress || 0;
                const isHidden = achievement.hidden && !unlocked;

                return (
                  <View
                    key={achievement.id}
                    style={[
                      styles.achievementCard,
                      unlocked && styles.achievementCardUnlocked,
                    ]}
                  >
                    {/* Icon */}
                    <Text
                      style={[
                        styles.achievementIcon,
                        !unlocked && styles.achievementIconLocked,
                      ]}
                    >
                      {isHidden ? '❓' : achievement.icon}
                    </Text>

                    {/* Content */}
                    <View style={styles.achievementContent}>
                      <Text
                        style={[
                          styles.achievementName,
                          unlocked && styles.achievementNameUnlocked,
                        ]}
                      >
                        {isHidden ? '???' : achievement.name.toUpperCase()}
                      </Text>
                      <Text style={styles.achievementDescription}>
                        {isHidden ? 'Hidden achievement' : achievement.description}
                      </Text>

                      {/* Progress bar for locked achievements */}
                      {!unlocked && !isHidden && (
                        <View style={styles.achievementProgressContainer}>
                          <View style={styles.achievementProgressBar}>
                            <View
                              style={[
                                styles.achievementProgressFill,
                                {
                                  width: `${Math.min(
                                    100,
                                    (currentProgress / achievement.requirement) * 100
                                  )}%`,
                                },
                              ]}
                            />
                          </View>
                          <Text style={styles.achievementProgressText}>
                            {currentProgress} / {achievement.requirement}
                          </Text>
                        </View>
                      )}

                      {/* Unlocked badge */}
                      {unlocked && (
                        <View style={styles.unlockedBadge}>
                          <Text style={styles.unlockedText}>✓ UNLOCKED</Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          );
        })}

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 80,
  },
  backText: {
    color: '#00ffff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#00ffff',
    letterSpacing: 3,
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  summary: {
    paddingHorizontal: 32,
    paddingVertical: 20,
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00ffff',
    letterSpacing: 2,
    marginBottom: 12,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00ffff',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  percentText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#00ffff',
  },
  adFreeBadge: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ffd700',
  },
  adFreeText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#ffd700',
    letterSpacing: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  category: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#ff00ff',
    letterSpacing: 3,
    marginBottom: 16,
  },
  achievementCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 12,
  },
  achievementCardUnlocked: {
    borderColor: 'rgba(0, 255, 255, 0.3)',
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
  },
  achievementIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  achievementIconLocked: {
    opacity: 0.3,
  },
  achievementContent: {
    flex: 1,
  },
  achievementName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 1,
    marginBottom: 4,
  },
  achievementNameUnlocked: {
    color: '#00ffff',
  },
  achievementDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  achievementProgressContainer: {
    marginTop: 8,
  },
  achievementProgressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  achievementProgressFill: {
    height: '100%',
    backgroundColor: '#00ffff',
  },
  achievementProgressText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600',
  },
  unlockedBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
    borderRadius: 12,
  },
  unlockedText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#00ffff',
    letterSpacing: 1,
  },
  bottomPadding: {
    height: 40,
  },
});
