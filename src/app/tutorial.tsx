/**
 * Tutorial screen
 * Interactive 4-step guide for first-time players
 */

import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useGameStore } from '../stores/useGameStore';

/**
 * Tutorial steps content
 */
const TUTORIAL_STEPS = [
  {
    title: 'WELCOME TO ORBIT',
    content: 'Match 3 or more blocks of the same color to clear them and score points!',
    icon: '🎯',
  },
  {
    title: 'CONTROLS',
    content: 'Tap LEFT/RIGHT to rotate the falling block.\nLONG PRESS anywhere to drop faster.',
    icon: '🎮',
  },
  {
    title: 'COMBOS & SCORE',
    content: 'Chain clears create COMBOS that multiply your score!\nThe more combos, the higher your score.',
    icon: '⚡',
  },
  {
    title: 'MODES & DIFFICULTY',
    content: 'Choose from multiple game modes and 10 difficulty levels.\nHigher difficulty = faster blocks & more colors!',
    icon: '🎨',
  },
];

export default function TutorialScreen() {
  const router = useRouter();
  const setTutorialCompleted = useGameStore((state) => state.setTutorialCompleted);
  const [currentStep, setCurrentStep] = useState(0);

  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;
  const step = TUTORIAL_STEPS[currentStep];

  /**
   * Handle next button
   */
  const handleNext = () => {
    if (isLastStep) {
      // Mark tutorial as completed and return to title
      setTutorialCompleted(true);
      router.replace('/');
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  /**
   * Handle skip button
   */
  const handleSkip = () => {
    setTutorialCompleted(true);
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      {/* Background glow */}
      <View style={styles.glowCenter} />

      {/* Step indicator */}
      <View style={styles.stepIndicator}>
        {TUTORIAL_STEPS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.stepDot,
              index === currentStep && styles.stepDotActive,
            ]}
          />
        ))}
      </View>

      {/* Content card */}
      <View style={styles.contentCard}>
        {/* Icon */}
        <Text style={styles.icon}>{step.icon}</Text>

        {/* Title */}
        <Text style={styles.title}>{step.title}</Text>

        {/* Content */}
        <Text style={styles.content}>{step.content}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonStack}>
        {/* Next/Finish button */}
        <Pressable style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>
            {isLastStep ? '✓ GOT IT!' : '→ NEXT'}
          </Text>
        </Pressable>

        {/* Skip button */}
        <Pressable style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>SKIP TUTORIAL</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 32,
  },
  glowCenter: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: '#00ffff',
    opacity: 0.05,
    blur: 100,
  },
  stepIndicator: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 255, 255, 0.3)',
  },
  stepDotActive: {
    backgroundColor: '#00ffff',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  contentCard: {
    width: '100%',
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 255, 0.3)',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#00ffff',
    letterSpacing: 2,
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 24,
    textAlign: 'center',
  },
  buttonStack: {
    width: '100%',
    gap: 16,
  },
  nextButton: {
    backgroundColor: '#00ffff',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  nextText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
  },
  skipButton: {
    borderWidth: 2,
    borderColor: '#666',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  skipText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
  },
});
