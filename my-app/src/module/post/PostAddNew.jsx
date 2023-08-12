import styled from 'styled-components';
import { Field, FieldCheckboxes } from '../../components/field';
import { Label } from '../../components/label';
import { Input } from '../../components/input';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/button';
import { Radio } from '../../components/checkbox';
import slugify from 'slugify';
import { API_KEY_IMGBB, postStatus } from '../../utils/constants';
import ImageUpload from '../../components/image/ImageUpload';
import useFirebaseImage from '../../hooks/useFirebaseImage';
import Toggle from '../../components/toggle/Toggle';
import { useEffect, useMemo, useState } from 'react';
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	serverTimestamp,
	where,
} from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';
import { Dropdown } from '../../components/dropdown';
import { useAuth } from '../../contexts/auth-context';
import { toast } from 'react-toastify';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageUploader from 'quill-image-uploader';
import axios from 'axios';
Quill.register('modules/imageUploader', ImageUploader);

const PostAddNewStyles = styled.div``;

const PostAddNew = () => {
	const [categories, setCategories] = useState([]);
	const [selectCategory, setSelectCategory] = useState({});
	const [loading, setLoading] = useState(false);
	const [content, setContent] = useState('');
	const { userInfo } = useAuth();

	const { control, watch, setValue, handleSubmit, getValues, reset } = useForm({
		mode: 'onChange',
		defaultValues: {
			title: '',
			slug: '',
			status: 2,
			hot: false,
			image: '',
			content: '',
			category: {},
			user: {},
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

	useEffect(() => {
		async function fetchUserData() {
			if (!userInfo.uid) return;
			const conRef = doc(db, 'users', userInfo.uid);
			const docData = await getDoc(conRef);
			setValue('user', {
				id: docData.id,
				...docData.data(),
			});
		}
		fetchUserData();
	}, [userInfo.uid, setValue]);

	const addPostHandler = async (values) => {
		setLoading(true);
		try {
			const cloneValues = { ...values };
			cloneValues.slug = slugify(cloneValues.slug || cloneValues.title, {
				lower: true,
			});
			cloneValues.status = Number(values.status);
			const colRef = collection(db, 'posts');
			await addDoc(colRef, {
				...cloneValues,
				image,
				content,
				createAt: serverTimestamp(),
			});
			toast.success('Create new post successfully');

			//Submit xong sẽ reset lại các trường
			reset({
				title: '',
				slug: '',
				status: 2,
				hot: false,
				image: '',
				// content: '',
				category: {},
				user: {},
			});
			handleResetUpload();
			setSelectCategory({});
			console.log('addPostHandler ~ cloneValues', cloneValues);
		} catch (error) {
			setLoading(false);
		} finally {
			setLoading(false);
		}
	};

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

	useEffect(() => {
		document.title = 'Monkey Blogging - Add new post';
	}, []);

	const handleClickSelect = async (item) => {
		const conRef = doc(db, 'categories', item.id);
		const docData = await getDoc(conRef);
		setValue('category', {
			id: docData.id,
			...docData.data(),
		});
		setSelectCategory(item);
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

				<Button
					type="submit"
					className="mx-auto w-[250px]"
					isLoading={loading}
					disabled={loading}
				>
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
