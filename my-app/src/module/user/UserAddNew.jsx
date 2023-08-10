import { useForm } from 'react-hook-form';
import { Radio } from '../../components/checkbox';
import { Label } from '../../components/label';
import { Input } from '../../components/input';
import { Button } from '../../components/button';
import DashboardHeading from '../dashboard/DashboardHeading';
import { Field, FieldCheckboxes } from '../../components/field';
import ImageUpload from '../../components/image/ImageUpload';
import { userRole, userStatus } from '../../utils/constants';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../../firebase/firebase-config';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import slugify from 'slugify';
import { toast } from 'react-toastify';
import useFirebaseImage from '../../hooks/useFirebaseImage';
// import { useNavigate } from 'react-router-dom';

const UserAddNew = () => {
	// const nagivate = useNavigate();
	const {
		control,
		handleSubmit,
		watch,
		setValue,
		getValues,
		reset,
		formState: { isValid, isSubmitting },
	} = useForm({
		mode: 'onChange',
		defaultValues: {
			email: '',
			password: '',
			id: '',
			fullname: '',
			username: '',
			avatar: '',
			status: userStatus.ACTIVE,
			role: userRole.USER,
			createdAt: new Date(),
		},
	});
	const {
		progress,
		image,
		handleDeleteImage,
		handleSelectImage,
		handleResetUpload,
	} = useFirebaseImage(setValue, getValues);

	const watchStatus = watch('status');
	const watchRole = watch('role');

	const handleCreateUser = async (values) => {
		try {
			if (!isValid) return;
			const cred = await createUserWithEmailAndPassword(
				auth,
				values.email,
				values.password
			);

			await updateProfile(auth.currentUser, {
				displayName: values.fullname,
				photoURL: image,
			});

			await setDoc(doc(db, 'users', cred.user.uid), {
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
				createdAt: serverTimestamp(),
				id: cred.user.uid,
			});
			console.log('handleCreateUser ~ values', values);

			toast.success(
				`Create a new user with email: ${values.email} successfully`
			);
			//When registration is successful, the form will be reset
			reset({
				email: '',
				password: '',
				id: '',
				fullname: '',
				username: '',
				avatar: '',
				status: userStatus.ACTIVE,
				role: userRole.USER,
				createdAt: new Date(),
			});
			handleResetUpload();
			// nagivate('/manage/user');
		} catch (error) {
			console.log('handleCreateUser ~ error', error);
			toast.error('Can not create new user');
		}
	};
	return (
		<div>
			<DashboardHeading
				title="New user"
				desc="Add new user to system"
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
			<form onSubmit={handleSubmit(handleCreateUser)}>
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
						<Input
							name="password"
							placeholder="Enter your password"
							control={control}
							type="password"
						></Input>
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

				<Button
					type="submit"
					kind="primary"
					className="mx-auto w-[200px]"
					isLoading={isSubmitting}
					disabled={isSubmitting}
				>
					Add new user
				</Button>
			</form>
		</div>
	);
};

export default UserAddNew;
