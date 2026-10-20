import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';
import styles from '@/styles/hike-log-modal.styles';

export default function HikeLogModal({
  visible,
  title,
  trailName,
  initialNotes = '',
  initialRating = null,
  submitLabel,
  saving,
  error,
  onClose,
  onSubmit,
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [rating, setRating] = useState(initialRating);

  useEffect(() => {
    if (visible) {
      setNotes(initialNotes);
      setRating(initialRating);
    }
  }, [initialNotes, initialRating, visible]);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      statusBarTranslucent
      onRequestClose={() => {
        if (!saving) onClose();
      }}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close hike log"
          style={styles.backdrop}
          onPress={() => {
            if (!saving) onClose();
          }}
        />
        <View style={styles.card}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.trailName}>{trailName}</Text>
            <Text style={styles.label}>Rating</Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((value) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Rate this hike ${value} out of 5`}
                  accessibilityState={{ selected: rating === value }}
                  key={value}
                  onPress={() => setRating(value)}
                  style={styles.ratingButton}
                >
                  <Ionicons
                    name={rating >= value ? 'star' : 'star-outline'}
                    size={30}
                    color={rating >= value ? colors.warning : colors.textIconMuted}
                  />
                </Pressable>
              ))}
              {rating != null ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Clear rating"
                  onPress={() => setRating(null)}
                  style={styles.clearRatingButton}
                >
                  <Text style={styles.clearRatingText}>Clear</Text>
                </Pressable>
              ) : null}
            </View>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              accessibilityLabel="Hike notes"
              multiline
              maxLength={2000}
              numberOfLines={5}
              placeholder="What would you like to remember about this hike?"
              textAlignVertical="top"
              value={notes}
              onChangeText={setNotes}
              style={styles.notesInput}
            />
            <Text style={styles.characterCount}>{notes.length}/2000</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                disabled={saving}
                onPress={onClose}
                style={[styles.cancelButton, saving && styles.disabled]}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: saving }}
                disabled={saving}
                onPress={() => onSubmit({ notes, rating })}
                style={[styles.submitButton, saving && styles.disabled]}
              >
                <Text style={styles.submitText}>{saving ? 'Saving...' : submitLabel}</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
