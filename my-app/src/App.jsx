/* eslint-disable no-unused-vars */
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/auth-context';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';

const App = () => {
	return (
		<div>
			<AuthProvider>
				<Routes>
					<Route path="/sign-up" element={<SignUpPage></SignUpPage>}></Route>
					<Route path="/sign-in" element={<SignInPage></SignInPage>}></Route>
				</Routes>
			</AuthProvider>
		</div>
	);
};

export default App;
