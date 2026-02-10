# DayUp - 나만의 습관 관리 앱

**"매일 조금씩 더 나은 나를 만듭니다."**

Firebase 기반의 실시간 습관 추적 및 관리 서비스입니다.

### [Tech Stack]
React Native, Expo, TypeScript, Zustand, Firebase, React Navigation

### [Key Features]
1. 가볍고 직관적인 상태 관리
    React Native 환경에서 직관적인 상태 관리를 위해 Zustand를 사용하여 리렌더링 성능을 최적화하고, 코드 가독성을 개선했습니다
2. 데이터의 지속성과 실시간성
    동일한 사용자가 다른 기기로 접속했을 때 데이터가 유실되는 문제와 사용자별 데이터 분리를 위해 Firestore를 활용해 실시간으로 데이터를 동기화하고 사용자별 맞춤형 대시보드를 제공합니다
3. 직관적인 인터페이스
    사용자가 습관을 기록하는 과정에서 번거로움을 느끼면 서비스 이탈로 이어진다는 점을 주목하고, 메인 대시보드에서 체크 박스 터치 한 번만으로 즉시 상태가 업데이트 되는 one-tap 로그 기능을 적용했습니다

### [Project Structure]
```
MyHabitApp/
├── .expo/
├── assets/
├── src/
│   ├── navigation/            # 나비게이션 바 관리
│   ├── screens/               # 화면 분리(홈, 로그인, 회원가입, 통계)
│   ├── servies/               # firebase API key 관리
│   ├── store/                 # 데이터 저장(데이터 지속성 및 실시간 동기화)
│   ├── types/
│   ├── App.tsx
│   ├── app.json
│   └── index.ts
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

### [Preview]
<img src="./assets/startscreen.png" width="200" /> <img src="./assets/signupscreen.png" width="200" />

<img src="./assets/homescreen.png" width="200" /> <img src="./assets/statscreen.png" width="200" />
