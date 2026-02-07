import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, FlatList, Modal, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useHabitStore } from '../store/useHabitStore';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const EMOJI_LIST = ['⭐', '💧', '🏃', '📚', '💊', '🥗', '⏰']

const HomeScreen = () => {
    const [nickname, setNickname] = useState('사용자');
    const { habits, addHabit, toggleHabit, removeHabit, fetchHabits } = useHabitStore();
    const [modalVisible, setModalVisible] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState('⭐');

    const today = new Date().toISOString().split('T')[0];

    const totalHabits = habits.length;
    const completedHabits = habits.filter(h => h.completedDates.includes(today)).length;
    const progress = totalHabits > 0 ? (completedHabits / totalHabits) : 0;
    const percentage = Math.round(progress * 100);

    const getTodayText = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const date = today.getDate();
        const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        const dayOfWeek = dayNames[today.getDay()];

        return `오늘은 ${year}년 ${month}월 ${date}일 ${dayOfWeek}입니다!`;
    }

    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.currentUser) {
                const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
                if (userDoc.exists()) {
                    setNickname(userDoc.data().nickname);
                }
            }
        };
        fetchUserData();
        fetchHabits();
    }, []);

    const handleAddHabit = () => {
        if (newTitle.trim() === '') return;
        addHabit(newTitle, selectedEmoji);
        setNewTitle('');
        setSelectedEmoji('⭐');
        setModalVisible(false);
    };

    const handleToggle = (id: string) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        toggleHabit(id, today);
    };

    const handleLongPress = (id: string, title: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Alert.alert(
            "습관 삭제",
            `'${title}' 습관을 삭제할까요?`,
            [
                { text: "취소", style: "cancel" },
                {
                    text: "삭제",
                    style: "destructive",
                    onPress: () => {
                        removeHabit(id);
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>안녕하세요, {nickname}님! 👋</Text>
                    <Text style={styles.dateText}>{getTodayText()}</Text>
                    <Text style={styles.title}>오늘의 습관을{"\n"}완료해볼까요?</Text>
                </View>

            {totalHabits > 0 && (
                <View style={styles.progressContainer}>
                    <View style={styles.progressTextRow}>
                        <Text style={styles.progressLabel}>오늘의 성취도</Text>
                        <Text style={styles.progressValue}>{percentage}%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
                    </View>
                </View>
            )}
            </View>

            <View style={styles.content}>
                {habits.length === 0 ? (
                    <Text style={styles.emptyText}>아직 등록된 습관이 없어요.{"\n"}새로운 습관을 추가해보세요!</Text>
                ) : (
                    <FlatList
                        data={habits}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            const isCompleted = item.completedDates.includes(today);

                            return (
                                <TouchableOpacity
                                    style={[styles.habitItem, isCompleted && styles.habitItemCompleted]}
                                    onPress={() => handleToggle(item.id)}
                                    onLongPress={() => handleLongPress(item.id, item.title)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.habitEmoji}>{item.emoji}</Text>
                                    <Text style={[styles.habitTitle, isCompleted && styles.habitTitleCompleted]}>
                                        {item.title}
                                    </Text>
                                    {isCompleted && <Text style={styles.checkIcon}>  ⭕</Text>}
                                </TouchableOpacity>
                            );
                        }}
                        contentContainerStyle={styles.listContainer}
                    />
                )}
            </View>

            <Modal
                animationType='slide'
                transparent={true}
                visible={modalVisible}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>새로운 습관 추가</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="습관 이름을 입력하세요"
                            value={newTitle}
                            onChangeText={setNewTitle}
                            autoFocus
                        />

                        <Text style={styles.emojiLabel}>아이콘 선택</Text>
                        <View style={styles.emojiRow}>
                            {EMOJI_LIST.map((emoji) => (
                                <TouchableOpacity
                                    key={emoji}
                                    onPress={() => setSelectedEmoji(emoji)}
                                    style={[
                                        styles.emojiButton,
                                        selectedEmoji === emoji && styles.emojiButtonSelected
                                    ]}
                                >
                                    <Text style={styles.emojiText}>{emoji}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>취소</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonAdd]}
                                onPress={handleAddHabit}
                            >
                                <Text style={[styles.buttonText, { color: '#fff '}]}>추가하기</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            <TouchableOpacity 
                style={styles.fab}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: { padding: 24, paddingTop: 40 },
    greeting: { fontSize: 14, color: '#6c757d', marginBottom: 8 },
    dateText: { fontSize: 14, color: '#6c757d', marginBottom: 8 },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#212529',
        lineHeight: 36,
    },
    progressContainer: { marginTop: 10 },
    progressTextRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 8,
        marginTop: 10, 
    },
    progressLabel: { fontSize: 14, fontWeight: '600', color: '#495057' },
    progressValue: { fontSize: 14, fontWeight: 'bold', color: '#495057' },
    progressBarBg: { height: 8, backgroundColor: '#e9ecef', borderRadius: 4, overflow: 'hidden' },
    progressBarFill: { height: '100%', backgroundColor: '#fff192', borderRadius: 4 },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContainer: { padding: 24 },
    emptyText: {
        textAlign: 'center',
        color: '#adb5bd',
        fontSize: 16,
        lineHeight: 24,
    },
    habitItem: {
        width: 300,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    habitItemCompleted: {
        backgroundColor: '#e7f5ff',
        borderColor: '#ffea61',
        borderWidth: 1,
    },
    habitEmoji: { fontSize: 24, marginRight: 16 },
    habitTitle: { fontSize: 18, fontWeight: '600', color: '#212529' },
    habitTitleCompleted: {
        color: '#000',
        textDecorationLine: 'line-through',
    },
    checkIcon: { marginLeft: 'auto', fontSize: 18 },
    fab: {
        position: 'absolute',
        right: 17,
        bottom: 80,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff192',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    fabText: {
        fontSize: 32,
        color: "#000",
        lineHeight: 32,
    },
    modalText: { fontSize: 32, color: '#fff' },
    modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalView: {
        backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20,
        padding: 35, alignItems: 'center', shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5,
    },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    input: {
        width: '100%', height: 50, borderColor: '#e9ecef', borderWidth: 1,
        borderRadius: 10, paddingHorizontal: 15, marginBottom: 20, fontSize: 16,
    },

    // Emoji style
    emojiLabel: { alignSelf: 'flex-start', fontSize: 14, color: '#6c757d', marginBottom: 10 },
    emojiRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 30 },
    emojiButton: {
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#f8f9fa'
    },
    emojiButtonSelected: {
        backgroundColor: '#e7f5ff',
        borderWidth: 2,
        borderColor: '#fff192'
    },
    emojiText: { fontSize: 24 },

    modalButtons: { flexDirection: 'row', gap: 10 },
    button: { borderRadius: 10, padding: 12, minWidth: 100, alignItems: 'center' },
    buttonClose: { backgroundColor: '#e9ecef' },
    buttonAdd: { backgroundColor: '#fff192' },
    buttonText: { fontWeight: 'bold' },
});

export default HomeScreen;