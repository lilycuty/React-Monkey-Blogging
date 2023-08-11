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
import { useEffect, useMemo, useState } from 'react';
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
import { API_KEY_IMGBB, postStatus } from '../../utils/constants';
import useFirebaseImage from '../../hooks/useFirebaseImage';
import slugify from 'slugify';
import { toast } from 'react-toastify';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageUploader from 'quill-image-uploader';
import axios from 'axios';
Quill.register('modules/imageUploader', ImageUploader);

const PostUpdate = () => {
	const [params] = useSearchParams();
	const postID = params.get('id');

	const [categories, setCategories] = useState([]);
	const [selectCategory, setSelectCategory] = useState({});
	const [content, setContent] = useState('');

	const { control, reset, handleSubmit, setValue, getValues, watch } = useForm({
		mode: 'onChange',
	});

	const watchHot = watch('hot');
	const watchStatus = watch('status');
	const postImage = getValues('image');
	const imageName = getValues('image_name');
	const selectCategoryPost = getValues('category');

	const { progress, setImage, image, handleDeleteImage, handleSelectImage } =
		useFirebaseImage(setValue, getValues, imageName, deleteImagePost);

	useEffect(() => {
		async function fetchDataPost() {
			try {
				if (!postID) return;
				const colRef = doc(db, 'posts', postID);
				const dataPost = await getDoc(colRef);
				if (dataPost.data()) {
					reset(dataPost && dataPost.data());
					setSelectCategory(dataPost.data() || '');
					setContent(dataPost.data()?.content || '');
				}
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
		setImage(postImage);
	}, [setImage, postImage]);

	useEffect(() => {
		setSelectCategory(selectCategoryPost);
	}, [setSelectCategory, selectCategoryPost]);

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

	//Handle Update Post
	const updatePostHandler = async (values) => {
		try {
			const colRef = doc(db, 'posts', postID);
			values.slug = slugify(values.slug || values.title, {
				lower: true,
			});
			values.status = Number(values.status);
			await updateDoc(colRef, {
				...values,
				image: image,
				content,
			});
			toast.success('Update post successfully!');
			console.log('updatePostHandler ~ values', values);
		} catch (error) {
			console.log('updatePostHandler ~ error', error);
		}
	};
	const modules = useMemo(
		() => ({
			toolbar: [
				['bold', 'italic', 'underline', 'strike'],
				['blockquote'],
				[{ header: 1 }, { header: 2 }], // custom button values
				[{ list: 'ordered' }, { list: 'bullet' }],
				[{ header: [1, 2, 3, 4, 5, 6, false] }],
				['link', 'image'],
			],
			imageUploader: {
				upload: async (file) => {
					//Sử dụng cho việc hiển thị hình ảnh
					const bodyFormData = new FormData();
					bodyFormData.append('image', file);
					const response = await axios({
						method: 'post',
						url: `https://api.imgbb.com/1/upload?key=${API_KEY_IMGBB}`,
						data: bodyFormData,
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					});
					return response.data.data.url;
				},
			},
		}),

		[]
	);

	if (!postID) return null;
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

				<div className="mb-10">
					<Field>
						<Label>Content</Label>
						<div className="w-full entry-content">
							<ReactQuill
								modules={modules}
								theme="snow"
								value={content}
								onChange={setContent}
							/>
						</div>
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
