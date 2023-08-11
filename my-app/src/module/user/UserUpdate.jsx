import { useForm } from 'react-hook-form';
import { Radio } from '../../components/checkbox';
import { Label } from '../../components/label';
import { Input, InputPasswordToggle } from '../../components/input';
import { Button } from '../../components/button';
import DashboardHeading from '../dashboard/DashboardHeading';
import { Field, FieldCheckboxes } from '../../components/field';
import ImageUpload from '../../components/image/ImageUpload';
import { userRole, userStatus } from '../../utils/constants';
import { toast } from 'react-toastify';
import useFirebaseImage from '../../hooks/useFirebaseImage';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';
import slugify from 'slugify';
import { TextArea } from '../../components/textarea';
// import { useNavigate } from 'react-router-dom';

const UserUpdate = () => {
	const [params] = useSearchParams();
	const userId = params.get('id');
	// const nagivate = useNavigate();

	const {
		control,
		handleSubmit,
		watch,
		setValue,
		getValues,
		reset,
		formState: { isSubmitting },
	} = useForm({
		mode: 'onChange',
		defaultValues: {},
	});

	const watchStatus = watch('status');
	const watchRole = watch('role');
	const imageUrl = getValues('avatar');
	console.log('UserUpdate ~ imageUrl', imageUrl);

	//Dùng regex get ra tên file của ảnh trong filebase
	const imageRegex = /%2F(\S+)\?/gm.exec(imageUrl);
	const imageName = imageRegex?.length > 0 ? imageRegex[1] : '';

	const { progress, image, handleDeleteImage, handleSelectImage, setImage } =
		useFirebaseImage(setValue, getValues, imageName, deleteAvatar);

	//Sử dụng function declaration để có hoisting
	async function deleteAvatar() {
		const colRef = doc(db, 'users', userId);
		await updateDoc(colRef, {
			avatar: '',
		});
	}

	useEffect(() => {
		async function fetchData() {
			if (!userId) return;
			const colRef = doc(db, 'users', userId);
			const dataUser = await getDoc(colRef);
			reset(dataUser && dataUser.data());
		}
		fetchData();
	}, [userId, reset]);

	useEffect(() => {
		setImage(imageUrl);
	}, [imageUrl, setImage]);

	const handleUpdateUser = async (values) => {
		try {
			const colRef = doc(db, 'users', userId);
			await updateDoc(colRef, {
				email: values.email,
				password: values.password,
				fullname: values.fullname,
				username: slugify(values.username || values.fullname, {
					lower: true,
					trim: true,
					replacement: ' ',
				}),
				avatar: image,
				status: Number(values.status),
				role: Number(values.role),
				description: values.description,
			});
			toast.success('Update user successfully!');
		} catch (error) {
			console.log('handleUpdateUser ~ error', error);
			toast.error('Update user failed!');
		}
	};

	if (!userId) return null;

	return (
		<div>
			<DashboardHeading
				title="Update user"
				desc="Update user information"
			></DashboardHeading>
			<div className="w-[200px] h-[200px] mx-auto rounded-full mb-10">
				<ImageUpload
					className="!rounded-full h-full"
					image={image}
					onChange={handleSelectImage}
					progress={progress}
					handleDeleteImage={handleDeleteImage}
				></ImageUpload>
			</div>
			<form onSubmit={handleSubmit(handleUpdateUser)}>
				<div className="form-layout">
					<Field>
						<Label>Fullname</Label>
						<Input
							name="fullname"
							placeholder="Enter your fullname"
							control={control}
						></Input>
					</Field>
					<Field>
						<Label>Username</Label>
						<Input
							name="username"
							placeholder="Enter your username"
							control={control}
						></Input>
					</Field>
				</div>

				<div className="form-layout">
					<Field>
						<Label>Email</Label>
						<Input
							name="email"
							placeholder="Enter your email"
							control={control}
							type="email"
						></Input>
					</Field>
					<Field>
						<Label>Password</Label>
						<InputPasswordToggle
							name="password"
							placeholder="Enter your password"
							control={control}
							type="password"
						></InputPasswordToggle>
					</Field>
				</div>

				<div className="form-layout">
					<Field>
						<Label>Status</Label>
						<FieldCheckboxes>
							<Radio
								name="status"
								control={control}
								checked={Number(watchStatus) === userStatus.ACTIVE}
								value={userStatus.ACTIVE}
							>
								Active
							</Radio>
							<Radio
								name="status"
								control={control}
								checked={Number(watchStatus) === userStatus.PENDDING}
								value={userStatus.PENDDING}
							>
								Pending
							</Radio>
							<Radio
								name="status"
								control={control}
								checked={Number(watchStatus) === userStatus.BAN}
								value={userStatus.BAN}
							>
								Banned
							</Radio>
						</FieldCheckboxes>
					</Field>
					<Field>
						<Label>Role</Label>
						<FieldCheckboxes>
							<Radio
								name="role"
								control={control}
								checked={Number(watchRole) === userRole.ADMIN}
								value={userRole.ADMIN}
							>
								Admin
							</Radio>
							<Radio
								name="role"
								control={control}
								checked={Number(watchRole) === userRole.MODERATOR}
								value={userRole.MODERATOR}
							>
								Moderator
							</Radio>
							<Radio
								name="role"
								control={control}
								checked={Number(watchRole) === userRole.USER}
								value={userRole.USER}
							>
								User
							</Radio>
						</FieldCheckboxes>
					</Field>
				</div>

				<div className="form-layout">
					<Field>
						<Label htmlFor="description">Description</Label>
						<TextArea name="description" control={control}></TextArea>
					</Field>
				</div>

				<Button
					type="submit"
					kind="primary"
					className="mx-auto w-[200px]"
					isLoading={isSubmitting}
					disabled={isSubmitting}
				>
					Update
				</Button>
			</form>
		</div>
	);
};

export default UserUpdate;
