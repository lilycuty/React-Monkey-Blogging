import { useForm } from 'react-hook-form';
import { Label } from '../../components/label';
import { Input } from '../../components/input';
import { Button } from '../../components/button';
import DashboardHeading from '../dashboard/DashboardHeading';
import ImageUpload from '../../components/image/ImageUpload';
import { Field } from '../../components/field';
import { useEffect } from 'react';
import { db } from '../../firebase/firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { TextArea } from '../../components/textarea';
import { useAuth } from '../../contexts/auth-context';
import useFirebaseImage from '../../hooks/useFirebaseImage';
import { toast } from 'react-toastify';

const UserProfile = () => {
	const { userInfo } = useAuth();
	console.log('UserProfile ~ userInfo', userInfo);

	const { control, reset, handleSubmit, getValues, setValue } = useForm({
		mode: 'onChange',
	});

	const imageUrl = getValues('avatar');
	//Dùng regex get ra tên file của ảnh trong filebase
	const imageRegex = /%2F(\S+)\?/gm.exec(imageUrl);
	const imageName = imageRegex?.length > 0 ? imageRegex[1] : '';

	const { progress, image, handleDeleteImage, handleSelectImage, setImage } =
		useFirebaseImage(setValue, getValues, imageName, deleteAvatar);

	useEffect(() => {
		async function getDataUser() {
			if (userInfo) {
				const colRef = doc(db, 'users', userInfo.id);
				const docSnapshot = await getDoc(colRef);
				reset(docSnapshot.data());
			}
		}
		getDataUser();
	}, [reset, userInfo]);

	useEffect(() => {
		setImage(imageUrl);
	}, [imageUrl, setImage]);

	async function deleteAvatar() {
		const colRef = doc(db, 'users', userInfo.id);
		await updateDoc(colRef, {
			avatar: '',
		});
	}

	const handleUpdateProfile = async (values) => {
		try {
			const colRef = doc(db, 'users', userInfo.id);
			await updateDoc(colRef, {
				...values,
				avatar: image,
			});
			toast.success('Update user successfully!');
			console.log('handleUpdateProfile ~ values', values);
		} catch (error) {
			console.log('handleUpdateUser ~ error', error);
			toast.error('Update user failed!');
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
					<ImageUpload
						className="!rounded-full h-full"
						image={image}
						onChange={handleSelectImage}
						progress={progress}
						handleDeleteImage={handleDeleteImage}
					></ImageUpload>
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

				{/* <div className="form-layout">
					<Field>
						<Label>New Password</Label>
						<InputPasswordToggle
							control={control}
							name="newPassword"
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
				</div> */}

				<Button type="submit" kind="primary" className="mx-auto w-[200px]">
					Update
				</Button>
			</form>
		</div>
	);
};

export default UserProfile;
