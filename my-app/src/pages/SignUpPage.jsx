import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '../components/label';
import { Input, InputPasswordToggle } from '../components/input';
import { Field } from '../components/field';
import { Button } from '../components/button';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase/firebase-config';
import { NavLink, useNavigate } from 'react-router-dom';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import AuthenticationPage from './AuthenticationPage';
import slugify from 'slugify';

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

const SignUpPage = () => {
	const navigate = useNavigate();

	const {
		control,
		handleSubmit,
		formState: { errors, isValid, isSubmitting },
	} = useForm({
		mode: 'onChange',
		resolver: yupResolver(schema),
	});

	const handleSignUp = async (values) => {
		console.log('handleSignUp ~ values', values);
		if (!isValid) return;

		const cred = await createUserWithEmailAndPassword(
			auth,
			values.email,
			values.password
		);
		console.log('handleSignUp ~ cred', cred);

		await updateProfile(auth.currentUser, {
			displayName: values.fullname,
			photoURL:
				'https://cdnimg.vietnamplus.vn/uploaded/mzdic/2022_12_21/messihieusuatghiban1.jpg',
		});

		await setDoc(doc(db, 'users', auth.currentUser.uid), {
			email: values.email,
			password: values.password,
			fullname: values.fullname,
			username: slugify(values.fullname, {
				lower: true,
				trim: true,
				replacement: ' ',
			}),
			avatar:
				'https://cdnimg.vietnamplus.vn/uploaded/mzdic/2022_12_21/messihieusuatghiban1.jpg',
			status: 1,
			role: 3,
			createdAt: serverTimestamp(),
		});

		toast.success('Register successfully');

		// Phải có Promise thì ms dùng đc isSubmitting
		// return new Promise((resolve) => {
		// 	setTimeout(() => {
		// 		resolve();
		// 	}, 3000);
		// });

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

	useEffect(() => {
		document.title = 'Register Page';
	}, []);

	return (
		<AuthenticationPage>
			<form className="form" onSubmit={handleSubmit(handleSignUp)}>
				<Field>
					<Label htmlFor="fullname">Fullname</Label>
					<Input
						name="fullname"
						type="text"
						placeholder="Enter your fullname"
						control={control}
					/>
				</Field>
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
					<InputPasswordToggle control={control}></InputPasswordToggle>
				</Field>

				<div className="have-account">
					You already have an account? <NavLink to={'/sign-in'}> Login</NavLink>
				</div>

				<Button
					type="submit"
					style={{
						width: '100%',
						maxWidth: 300,
						margin: '0 auto',
					}}
					isLoading={isSubmitting}
					disabled={isSubmitting}
				>
					Sign Up
				</Button>
			</form>
		</AuthenticationPage>
	);
};

export default SignUpPage;
