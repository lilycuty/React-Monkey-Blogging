import { useForm } from 'react-hook-form';
import { Label } from '../../components/label';
import { Input, InputPasswordToggle } from '../../components/input';
import { Button } from '../../components/button';
import DashboardHeading from '../dashboard/DashboardHeading';
import ImageUpload from '../../components/image/ImageUpload';
import { Field } from '../../components/field';
import { useEffect } from 'react';
import { db } from '../../firebase/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { TextArea } from '../../components/textarea';
import { useAuth } from '../../contexts/auth-context';

const UserProfile = () => {
	const { userInfo } = useAuth();
	console.log('UserProfile ~ userInfo', userInfo);
	const { control, reset, handleSubmit } = useForm({
		mode: 'onChange',
	});
	useEffect(() => {
		async function getDataUser() {
			if (userInfo) {
				const colRef = doc(db, 'users', userInfo.id);
				const docSnapshot = await getDoc(colRef);
				// console.log('getDataUser ~ docSnapshot', docSnapshot.data());
				reset(docSnapshot.data());
			}
		}
		getDataUser();
	}, [reset, userInfo]);
	const handleUpdateProfile = (values) => {
		console.log('handleUpdateProfile ~ values', values);
		const passwordConfirm = values.confirmPassword;
		if (values.password === passwordConfirm) {
			console.log('Update thanh cong');
		} else {
			console.log('That bai roi cung');
		}
	};
	if (!userInfo) return;
	return (
		<div>
			<DashboardHeading
				title="Account information"
				desc="Update your account information"
			></DashboardHeading>
			<form onSubmit={handleSubmit(handleUpdateProfile)}>
				<div className="text-center w-[200px] h-[200px] mx-auto rounded-full mb-10">
					<ImageUpload className="w-[200px] h-[200px] !rounded-full min-h-0 mx-auto"></ImageUpload>
				</div>

				<div className="form-layout">
					<Field>
						<Label>Fullname</Label>
						<Input
							control={control}
							name="fullname"
							placeholder="Enter your fullname"
						></Input>
					</Field>
					<Field>
						<Label>Username</Label>
						<Input
							control={control}
							name="username"
							placeholder="Enter your username"
						></Input>
					</Field>
				</div>

				<div className="form-layout">
					<Field>
						<Label>Date of Birth</Label>
						<Input
							control={control}
							name="birthday"
							placeholder="dd/mm/yyyy"
						></Input>
					</Field>
					<Field>
						<Label>Mobile Number</Label>
						<Input
							control={control}
							name="phone"
							placeholder="Enter your phone number"
						></Input>
					</Field>
				</div>

				<div className="form-layout">
					<Field>
						<Label>Email</Label>
						<Input
							control={control}
							name="email"
							type="email"
							placeholder="Enter your email address"
						></Input>
					</Field>
					<Field>
						<Label htmlFor="description">Description</Label>
						<TextArea name="description" control={control}></TextArea>
					</Field>
				</div>

				<div className="form-layout">
					<Field>
						<Label>New Password</Label>
						<InputPasswordToggle
							control={control}
							name="password"
							type="password"
							placeholder="Enter your password"
						></InputPasswordToggle>
					</Field>
					<Field>
						<Label>Confirm Password</Label>
						<InputPasswordToggle
							control={control}
							name="confirmPassword"
							type="password"
							placeholder="Enter your confirm password"
							confirm
						></InputPasswordToggle>
					</Field>
				</div>

				<Button type="submit" kind="primary" className="mx-auto w-[200px]">
					Update
				</Button>
			</form>
		</div>
	);
};

export default UserProfile;
