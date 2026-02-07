import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email.trim(), password);
        } catch (error: any) {
            let errorMessage = "로그인에 실패했습니다";
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = "이메일 또는 비밀번호가 틀렸습니다";
            }
            Alert.alert("로그인 실패", error.message);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.logo}>DayUp</Text>
                <Text style={styles.subtitle}>당신의 습관을 만들어보세요</Text>

                <TextInput
                    style={styles.input}
                    placeholder="이메일"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType='email-address'
                />
                <TextInput
                    style={styles.input}
                    placeholder="비밀번호"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.buttonText}>로그인</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate('SignUp')}>
                    <Text style={[styles.buttonText, { color: '#000'}]}>회원가입</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    content: { flex: 1, padding: 30, justifyContent: 'center' },
    logo: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffea61',
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 16,
        color: '#6c757d',
        textAlign: 'center',
        marginBottom: 40,
        marginTop: 10
    },
    input: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e9ecef'
    },
    loginButton: {
        backgroundColor: '#fff192',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10
    },
    signUpButton: { marginTop: 20, alignItems: 'center' },
    buttonText: { color: '#000', fontWeight: 'bold', fontSize: 16 }
});

export default LoginScreen;