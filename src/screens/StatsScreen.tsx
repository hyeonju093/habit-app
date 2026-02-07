import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useHabitStore } from '../store/useHabitStore';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

const { width } = Dimensions.get('window');

const StatsScreen = () => {
    const { habits } = useHabitStore();

    const getLast7Days = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push({
                dateString: date.toISOString().split('T')[0],
                dayName: ['일', '월', '화', '수', '목', '금', '토'][date.getDay()],
            });
        }
        return days;
    };

    const last7Days = getLast7Days();

    const chartData = last7Days.map(day => {
        const completedCount = habits.filter(h => h.completedDates.includes(day.dateString)).length;
        const totalCount = habits.length;
        const ratio = totalCount > 0 ? completedCount / totalCount : 0;
        return { ...day, ratio };
    });

    const totalCompleted = habits.reduce((acc, habit) => acc + habit.completedDates.length, 0);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>나의 기록 📊</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.row}>
                    <View style={[styles.statsCard, {flex: 1, marginRight: 8}]}>
                        <Text style={styles.statsLabel}>현재 진행 중인 습관</Text>
                        <Text style={styles.statsValue}>{habits.length}개</Text>
                    </View>

                    <View style={[styles.statsCard, { flex: 1, marginLeft: 8, backgroundColor: '#fbf2b7' }]}>
                        <Text style={styles.statsLabel}>누적 완료 횟수</Text>
                        <Text style={styles.statsValue}>{totalCompleted}회</Text>
                    </View>
                </View>
                
                <View style={styles.chartSection}>
                    <Text style={styles.chartTitle}>주간 성취도</Text>
                    <View style={styles.chartContainer}>
                        {chartData.map((data, index) => (
                            <View key={index} style={styles.barWrapper}>
                                <View style={styles.barBackground}>
                                    <View
                                        style={[
                                            styles.barFill,
                                            { height: `${data.ratio * 100}%` }
                                        ]}
                                    />
                                </View>
                                <Text style={styles.barLabel}>{data.dayName}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <Text style={styles.infoText}>
                    꾸준함이 가장 큰 무기입니다!{"\n"}내일도 힘내보아요
                </Text>

                <TouchableOpacity
                    style={{ marginTop: 30, padding: 20, alignItems: 'center' }}
                    onPress={() => signOut(auth)}
                >
                    <Text style={{ color: '#fa5252', fontWeight: 'bold' }}>로그아웃</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#f8f9fa' },
    header: { padding: 24, paddingTop: 40 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#212529' },
    content: { padding: 24 },
    row: { flexDirection: 'row', marginBottom: 16 },
    statsCard: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 20,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    statsLabel: { fontSize: 16, color: '#6c757d', marginBottom: 8 },
    statsValue: { fontSize: 32, fontWeight: 'bold', color: '#000' },
    chartSection: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 24,
        marginTop: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    chartTitle: { fontSize: 18, fontWeight: 'bold', color: '#212529', marginBottom: 20 },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 150,
        paddingTop: 10,
    },
    barWrapper: { alignItems: 'center', flex: 1 },
    barBackground: {
        width: 12,
        height: '100%',
        backgroundColor: '#f1f3f5',
        borderRadius: 6,
        justifyContent: 'flex-end',
        overflow: 'hidden'
    },
    barFill: {
        width: '100%',
        backgroundColor: '#fbf2b7',
        borderRadius: 6
    },
    barLabel: { fontSize: 12, color: '#adb5bd', marginTop: 8 },
    infoText: { textAlign: 'center', color: '#adb5bd', marginTop: 40, lineHeight: 22 },
});

export default StatsScreen;