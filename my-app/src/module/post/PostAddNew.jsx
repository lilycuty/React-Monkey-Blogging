import styled from 'styled-components';
import { Field } from '../../components/field';
import { Label } from '../../components/label';
import { Input } from '../../components/input';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/button';
import { Radio } from '../../components/checkbox';
import slugify from 'slugify';
import { postStatus } from '../../utils/constants';
import ImageUpload from '../../components/image/ImageUpload';
import useFirebaseImage from '../../hooks/useFirebaseImage';
import Toggle from '../../components/toggle/Toggle';
import { useEffect, useState } from 'react';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';
import { Dropdown } from '../../components/dropdown';
import { useAuth } from '../../contexts/auth-context';
import { toast } from 'react-toastify';

const PostAddNewStyles = styled.div``;

const PostAddNew = () => {
	const [categories, setCategories] = useState([]);
	const [selectCategory, setSelectCategory] = useState({});
	const { userInfo } = useAuth();

	const { control, watch, setValue, handleSubmit, getValues, reset } = useForm({
		mode: 'onChange',
		defaultValues: {
			title: '',
			slug: '',
			status: 2,
			hot: false,
			image: '',
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
	const watchHot = watch('hot');

	const addPostHandler = async (values) => {
		const cloneValues = { ...values };
		cloneValues.slug = slugify(cloneValues.slug || cloneValues.title, {
			lower: true,
		});
		cloneValues.status = Number(values.status);
		const colRef = collection(db, 'posts');
		await addDoc(colRef, {
			...cloneValues,
			image,
			userId: userInfo.uid,
		});
		toast.success('Create new post successfully');

		//Submit xong sẽ reset lại các trường
		reset({
			title: '',
			slug: '',
			status: 2,
			categoryId: '',
			hot: false,
			image: '',
		});
		handleResetUpload();
		setSelectCategory({});
		console.log('addPostHandler ~ cloneValues', cloneValues);
	};

	useEffect(() => {
		async function getData() {
			const colRef = collection(db, 'categories');
			const q = query(colRef, where('status', '==', 1));
			const querySnapshot = await getDocs(q);
			let results = [];
			querySnapshot.forEach((doc) => {
				results.push({
					id: doc.id,
					...doc.data(),
				});
			});
			setCategories(results);
		}
		getData();
	}, []);

	const handleClickSelect = (item) => {
		setValue('categoryId', item.id);
		setSelectCategory(item);
	};

	return (
		<PostAddNewStyles>
			<h1 className="dashboard-heading">Add new post</h1>

			<form onSubmit={handleSubmit(addPostHandler)}>
				<div className="grid grid-cols-2 gap-x-10 mb-10">
					<Field>
						<Label htmlFor="title">Title</Label>
						<Input
							name="title"
							control={control}
							placeholder="Enter your title"
							required
						></Input>
					</Field>
					<Field>
						<Label>Slug</Label>
						<Input
							name="slug"
							control={control}
							placeholder="Enter your slug"
						></Input>
					</Field>
				</div>

				<div className="grid grid-cols-2 gap-x-10 mb-10">
					<Field>
						<Label>Image</Label>
						<ImageUpload
							onChange={handleSelectImage}
							className="h-[250px]"
							progress={progress}
							image={image}
							handleDeleteImage={handleDeleteImage}
						></ImageUpload>
					</Field>
					<Field>
						<Label>Category</Label>
						<Dropdown>
							<Dropdown.Select></Dropdown.Select>
							<Dropdown.List>
								{categories.length > 0 &&
									categories.map((item) => (
										<Dropdown.Option
											key={item.id}
											onClick={() => handleClickSelect(item)}
										>
											{item.name}
										</Dropdown.Option>
									))}
							</Dropdown.List>
						</Dropdown>
						{selectCategory?.name && (
							<span className="inline-block p-3 text-green-600 font-semibold bg-green-100 text-sm rounded-lg">
								{selectCategory?.name}
							</span>
						)}
					</Field>
					{/* <Field>
						<Label>Author</Label>
						<Input control={control} placeholder="Find the author"></Input>
					</Field> */}
				</div>

				<div className="grid grid-cols-2 gap-x-10 mb-10">
					<Field>
						<Label>Feature post</Label>
						<Toggle
							on={watchHot === true}
							onClick={() => setValue('hot', !watchHot)}
						></Toggle>
					</Field>
					<Field>
						<Label>Status</Label>
						<div className="flex items-center gap-x-5">
							<Radio
								name="status"
								control={control}
								checked={Number(watchStatus) === postStatus.APPROVED}
								value={postStatus.APPROVED}
							>
								Approved
							</Radio>

							<Radio
								name="status"
								control={control}
								checked={Number(watchStatus) === postStatus.PENDDING}
								value={postStatus.PENDDING}
							>
								Pending
							</Radio>

							<Radio
								name="status"
								control={control}
								checked={Number(watchStatus) === postStatus.REJECTED}
								value={postStatus.REJECTED}
							>
								Reject
							</Radio>
						</div>
					</Field>
				</div>

				<Button type="submit" className="mx-auto">
					Add new post
				</Button>
			</form>
		</PostAddNewStyles>
	);
};

export default PostAddNew;

/**
 * Khi sử dụng custom checkbox, radio, dropdown, toggle -> sử dụng watch để theo dõi sự thay đổi của nó
 */
