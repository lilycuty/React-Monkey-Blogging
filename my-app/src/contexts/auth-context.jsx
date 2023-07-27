import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/firebase-config';

const AuthContext = createContext(null);

function AuthProvider(props) {
	const [userInfo, setUserInfo] = useState({});

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			setUserInfo(user);
		});
	}, []);

	const value = {
		userInfo,
		setUserInfo,
	};

	return <AuthContext.Provider value={value} {...props}></AuthContext.Provider>;
}

function useAuth() {
	const context = useContext(AuthContext);
	if (typeof context === 'undefined') {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return context;
}

export { AuthProvider, useAuth };
