import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, orderBy, serverTimestamp, query, doc } from 'firebase/firestore';

// Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyDgCFw0pkkKukL8pNtF1i8Zs6KW1llwhSQ",
  authDomain: "eabox-feedback.firebaseapp.com",
  projectId: "eabox-feedback",
  storageBucket: "eabox-feedback.firebasestorage.app",
  messagingSenderId: "950431793460",
  appId: "1:950431793460:web:7edd82992abd61fce52561",
  measurementId: "G-K64TH5TNF4"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 匿名登入
export const loginAnonymously = async () => {
    try {
        await signInAnonymously(auth);
        //console.log('匿名登入成功！');
    } catch (error) {
        //console.error('匿名登入失敗：', error.message);
    }
};

// 發送留言
export const sendMessage = async (messageText) => {
    if (!messageText.trim()) return //console.error('留言内容无效');

    const user = auth.currentUser;
    if (user) {
        await addDoc(collection(db, 'messages'), {
            text: messageText.trim(),
            timestamp: serverTimestamp(),
            user: {
                uid: user.uid,
                name: 'Anonymous user'
            },
        });
    }
};

// 监听留言更新
export const loadMessages = (callback) => {
    const messagesQuery = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
    
    onSnapshot(messagesQuery, async (snapshot) => {
        let newMessages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            replies: []
        }));

        // 加载所有回复
        for (const message of newMessages) {
            const repliesQuery = query(collection(doc(db, 'messages', message.id), 'replies'), orderBy('timestamp', 'asc'));
            onSnapshot(repliesQuery, (replySnapshot) => {
                message.replies = replySnapshot.docs.map(replyDoc => ({
                    id: replyDoc.id,
                    ...replyDoc.data()
                }));
                callback([...newMessages]);  // 触发 Vue 的响应式更新
            });
        }

        callback(newMessages);
    }, (error) => {
        //console.error('加载留言失败：', error);
        callback([]);
    });
};

// 发送回复
export const sendReply = async (messageId, replyText) => {
    if (!replyText.trim()) return //console.error('回复内容无效');

    const user = auth.currentUser;
    if (user) {
        await addDoc(collection(doc(db, 'messages', messageId), 'replies'), {
            text: replyText.trim(),
            timestamp: serverTimestamp(),
            user: {
                uid: user.uid,
                name: 'Anonymous user'
            }
        });
    }
};
