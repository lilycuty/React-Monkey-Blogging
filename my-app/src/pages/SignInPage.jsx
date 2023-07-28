import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/auth-context';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthenticationPage from './AuthenticationPage';
import { useForm } from 'react-hook-form';
import { Field } from '../components/field';
import { Label } from '../components/label';
import { Input } from '../components/input';
import { IconEyeClose, IconEyeOpen } from '../components/icon';
import { Button } from '../components/button';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase-config';

const schema = yup.object({
	fullname: yup.string().required('Please enter your fullname'),
	email: yup
		.string()
		.email('Please enter valid email address')
		.required('Please enter your email address'),
	password: yup
		.string()
		.required('Please enter your password')
		.min(8, 'Your password must be at least 8 characters of greater'),
});

const SignInPage = () => {
	const [togglePassword, setTogglePassowrd] = useState(false);

	const {
		handleSubmit,
		control,
		formState: { errors, isSubmitting, isValid },
	} = useForm({
		mode: 'onChange',
		resolver: yupResolver(schema),
	});

	//Check if you are logged in
	const { userInfo } = useAuth();
	const navigate = useNavigate();
	useEffect(() => {
		document.title = 'Login Page';
		if (userInfo?.email) navigate('/');
	}, [userInfo]);

	const handleSignIn = async (values) => {
		console.log('handleSignIn ~ values', values);

		if (!isValid) return;

		await signInWithEmailAndPassword(auth, values.email, values.password);

		navigate('/');
	};

	//Using react-toastify to display errors
	useEffect(() => {
		const arrError = Object.values(errors);
		if (arrError.length > 0) {
			toast.error(arrError[0]?.message, {
				pauseOnHover: false,
			});
		}
	}, [errors]);

	return (
		<AuthenticationPage>
			<form className="form" onSubmit={handleSubmit(handleSignIn)}>
				<Field>
					<Label htmlFor="email">Email address</Label>
					<Input
						name="email"
						type="email"
						placeholder="Enter your email"
						control={control}
					/>
				</Field>
				<Field>
					<Label htmlFor="password">Password</Label>
					<Input
						name="password"
						type={`${togglePassword ? 'text' : 'password'}`}
						placeholder="Enter your password"
						control={control}
					>
						{togglePassword ? (
							<IconEyeOpen
								onClick={() => setTogglePassowrd(false)}
							></IconEyeOpen>
						) : (
							<IconEyeClose
								onClick={() => setTogglePassowrd(true)}
							></IconEyeClose>
						)}
					</Input>
				</Field>

				<div className="have-account">
					You have not had an account?
					<NavLink to={'/sign-up'}> Register an account</NavLink>
				</div>

				<Button
					type="submit"
					style={{
						maxWidth: 300,
						margin: '0 auto',
					}}
					isLoading={isSubmitting}
					disabled={isSubmitting}
				>
					Sign In
				</Button>
			</form>
		</AuthenticationPage>
	);
};

export default SignInPage;
