import { useForm } from 'react-hook-form';
import DashboardHeading from '../dashboard/DashboardHeading';
import { Field, FieldCheckboxes } from '../../components/field';
import Label from './../../components/label/Label';
import { Input } from '../../components/input';
import ImageUpload from '../../components/image/ImageUpload';
import { Dropdown } from '../../components/dropdown';
import Toggle from '../../components/toggle/Toggle';
import { Radio } from '../../components/checkbox';
import { Button } from '../../components/button';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';
import { postStatus } from '../../utils/constants';
import useFirebaseImage from '../../hooks/useFirebaseImage';
import slugify from 'slugify';

const PostUpdate = () => {
	const [categories, setCategories] = useState([]);
	const [selectCategory, setSelectCategory] = useState({});

	const [params] = useSearchParams();
	const postID = params.get('id');

	const { control, reset, handleSubmit, setValue, getValues, watch } = useForm({
		mode: 'onChange',
	});

	const watchHot = watch('hot');
	const watchStatus = watch('status');
	const postImage = getValues('image');
	const selectCategoryPost = getValues('category');
	const imagePostName = getValues('image_name');

	const { progress, setImage, image, handleDeleteImage, handleSelectImage } =
		useFirebaseImage(setValue, getValues, imagePostName, deleteImagePost);
	console.log('PostUpdate ~ image', image);

	useEffect(() => {
		async function fetchDataPost() {
			try {
				const colRef = doc(db, 'posts', postID);
				const dataPost = await getDoc(colRef);
				console.log('fetchDataPost ~ dataPost', dataPost.data());
				reset({
					...dataPost.data(),
				});
				setSelectCategory({ ...dataPost.data() });
			} catch (error) {
				console.log('useEffect ~ error', error);
			}
		}
		fetchDataPost();
	}, [getValues, reset, postID, setImage]);

	//Sử dụng function declaration để có hoisting
	async function deleteImagePost() {
		const colRef = doc(db, 'posts', postID);
		await updateDoc(colRef, {
			image: '',
			image_name: '',
		});
	}

	useEffect(() => {
		setSelectCategory(selectCategoryPost);
	}, [setSelectCategory, selectCategoryPost]);

	useEffect(() => {
		setImage(postImage);
	}, [setImage, postImage]);

	useEffect(() => {
		async function getData() {
			const colRef = collection(db, 'categories');
			const q = query(colRef, where('status', '==', 1));
			//getDocs: get dữ liệu 1 lần và không theo dõi sự thay đổi của dữ liệu
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

	const handleClickSelect = async (item) => {
		const colRef = doc(db, 'categories', item.id);
		const docData = await getDoc(colRef);
		setValue('category', {
			id: docData.id,
			...docData.data(),
		});
		setSelectCategory(item);
	};

	const updatePostHandler = async (values) => {
		try {
			const colRef = doc(db, 'posts', postID);
			values.slug = slugify(values.slug || values.title, {
				lower: true,
			});
			await updateDoc(colRef, {
				...values,
			});
			console.log('updatePostHandler ~ values', values);
		} catch (error) {
			console.log('updatePostHandler ~ error', error);
		}
	};
	if (!postID) return;
	return (
		<>
			<DashboardHeading
				title="Update post"
				desc="Update post content"
			></DashboardHeading>
			<form onSubmit={handleSubmit(updatePostHandler)}>
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
						<FieldCheckboxes>
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
						</FieldCheckboxes>
					</Field>
				</div>

				<Button type="submit" className="mx-auto w-[250px]">
					Update
				</Button>
			</form>
		</>
	);
};

export default PostUpdate;
