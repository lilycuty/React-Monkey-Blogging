import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/auth-context';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import PostDetailsPage from './pages/PostDetailsPage';
import DashboardPage from './pages/DashboardPage';
import DashboardLayout from './module/dashboard/DashboardLayout';

const App = () => {
	return (
		<div>
			<AuthProvider>
				<Routes>
					<Route path="/" element={<HomePage></HomePage>}></Route>
					<Route path="/sign-up" element={<SignUpPage></SignUpPage>}></Route>
					<Route path="/sign-in" element={<SignInPage></SignInPage>}></Route>
					<Route path="*" element={<NotFoundPage></NotFoundPage>}></Route>
					<Route
						path="/:slug"
						element={<PostDetailsPage></PostDetailsPage>}
					></Route>
					<Route element={<DashboardLayout></DashboardLayout>}>
						<Route
							path="/dashboard"
							element={<DashboardPage></DashboardPage>}
						></Route>
					</Route>
				</Routes>
			</AuthProvider>
		</div>
	);
};

export default App;
