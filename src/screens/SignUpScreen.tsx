import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const SignUpScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            Alert.alert("오류", "비밀번호가 일치하지 않습니다");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                nickname: nickname,
                email: email,
                createdAt: new Date().toISOString(),
            });

            Alert.alert("회원가입 성공", "회원가입이 완료되었습니다", [
                { text: "확인", onPress: () => navigation.navigate('Login') }
            ]);
        } catch (error: any) {
            Alert.alert("가입 실패", error.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>회원가입</Text>

            <TextInput style={styles.input} placeholder="이메일" value={email} onChangeText={setEmail} autoCapitalize='none' />
            <TextInput style={styles.input} placeholder="닉네임" value={nickname} onChangeText={setNickname} />
            <TextInput style={styles.input} placeholder="비밀번호" value={password} onChangeText={setPassword} secureTextEntry />
            <TextInput style={styles.input} placeholder="비밀번호 확인" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>가입하기</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.linkText}>이미 계정이 있나요? 로그인으로 돌아가기</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 30,
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffea61',
        marginBottom: 30,
        textAlign: 'center'
    },
    input: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#e9ecef'
    },
    button : {
        backgroundColor: '#fff192',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
    linkText: { marginTop: 20, color: '#6c757d', textAlign: 'center' }
});

export default SignUpScreen;