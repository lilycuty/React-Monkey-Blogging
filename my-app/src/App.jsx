/* eslint-disable no-unused-vars */
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/auth-context';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
	return (
		<div>
			<AuthProvider>
				<Routes>
					<Route path="/" element={<HomePage></HomePage>}></Route>
					<Route path="/sign-up" element={<SignUpPage></SignUpPage>}></Route>
					<Route path="/sign-in" element={<SignInPage></SignInPage>}></Route>
					<Route path="*" element={<NotFoundPage></NotFoundPage>}></Route>
				</Routes>
			</AuthProvider>
		</div>
	);
};

export default App;
