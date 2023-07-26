import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyDNSCMxYyGFK0T3eNsQGd3BQ7wg3pZVGfw',
	authDomain: 'monkey-blogging-c142b.firebaseapp.com',
	projectId: 'monkey-blogging-c142b',
	storageBucket: 'monkey-blogging-c142b.appspot.com',
	messagingSenderId: '769370338957',
	appId: '1:769370338957:web:0a745fcbe42c7e52a194c4',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Init services (Fire store : Thêm,sửa,xoá,truy xuất database)
export const db = getFirestore(app);
export const auth = getAuth(db);
