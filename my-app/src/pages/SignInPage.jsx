import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import AuthenticationPage from './AuthenticationPage';
import { useForm } from 'react-hook-form';
import { Field } from '../components/field';
import { Label } from '../components/label';
import { Input } from '../components/input';
import { IconEyeClose, IconEyeOpen } from '../components/icon';
import { Button } from '../components/button';

const SignInPage = () => {
	const [togglePassword, setTogglePassowrd] = useState(false);

	const {
		handleSubmit,
		control,
		formState: { errors, isSubmitting, isValid },
	} = useForm({
		mode: 'onChange',
	});

	//Check if you are logged in
	// const { userInfo } = useAuth();
	// const navigate = useNavigate();
	// useEffect(() => {
	// 	if (!userInfo.email) navigate('/sign-up');
	// 	else navigate('/');
	// }, []);

	const handleSignIn = (values) => {
		console.log('handleSignIn ~ values', values);
	};
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
