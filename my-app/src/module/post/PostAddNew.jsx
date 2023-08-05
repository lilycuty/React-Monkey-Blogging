import React, { useState } from 'react';
import styled from 'styled-components';
import { Field } from '../../components/field';
import { Label } from '../../components/label';
import { Input } from '../../components/input';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/button';
import { Radio } from '../../components/checkbox';
import { Dropdown } from '../../components/dropdown';
import slugify from 'slugify';
import { postStatus } from '../../utils/constants';
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
	deleteObject,
} from 'firebase/storage';
import ImageUpload from '../../components/image/ImageUpload';

const PostAddNewStyles = styled.div``;

const PostAddNew = () => {
	const [progress, setProgress] = useState(0);
	const [image, setImage] = useState('');

	const { watch, control, handleSubmit, setValue, getValues } = useForm({
		mode: 'onChange',
		defaultValues: {
			title: '',
			slug: '',
			status: 2,
			category: '',
		},
	});

	const watchStatus = watch('status');
	const watchCategory = watch('category');

	const addPostHandler = async (values) => {
		const cloneValues = { ...values };
		cloneValues.slug = slugify(cloneValues.slug || cloneValues.title);
		cloneValues.status = Number(values.status);
		handleUploadImage(cloneValues.image);
		console.log('addPostHandler ~ cloneValues', cloneValues);
	};

	const handleUploadImage = (file) => {
		const storage = getStorage();

		const storageRef = ref(storage, 'images/' + file.name);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progressPrecent =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setProgress(progressPrecent);
				switch (snapshot.state) {
					case 'paused':
						console.log('Upload is paused');
						break;
					case 'running':
						console.log('Upload is running');
						break;
					default:
						console.log('Nothing at all');
				}
			},
			(error) => {
				console.log('Error', error);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					console.log('File available at', downloadURL);
					setImage(downloadURL);
				});
			}
		);
	};

	const onSelectImage = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		setValue('image_name', file.name);
		handleUploadImage(file);
	};

	const handleDeleteImage = () => {
		const storage = getStorage();
		const imageRef = ref(storage, 'images/' + getValues('image_name'));
		deleteObject(imageRef)
			.then(() => {
				console.log('Remove image successfully');
				setImage('');
				setProgress(0);
			})
			.catch((error) => {
				console.log('Can not delete image', error);
			});
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
							onChange={onSelectImage}
							className="h-[250px]"
							progress={progress}
							image={image}
							handleDeleteImage={handleDeleteImage}
						></ImageUpload>
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

					{/* <Field>
						<Label>Author</Label>
						<Input control={control} placeholder="Find the author"></Input>
					</Field> */}
				</div>

				<div className="grid grid-cols-2 gap-x-10 mb-10">
					<Field>
						<Label>Category</Label>
						<Dropdown>
							<Dropdown.Option>Knowledge</Dropdown.Option>
							<Dropdown.Option>Blockchain</Dropdown.Option>
							<Dropdown.Option>Setup</Dropdown.Option>
							<Dropdown.Option>Nature</Dropdown.Option>
							<Dropdown.Option>Developer</Dropdown.Option>
						</Dropdown>
					</Field>
					<Field></Field>
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
