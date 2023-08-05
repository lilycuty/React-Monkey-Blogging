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

const PostAddNewStyles = styled.div``;

const PostAddNew = () => {
	const { watch, control, handleSubmit, setValue, getValues } = useForm({
		mode: 'onChange',
		defaultValues: {
			title: '',
			slug: '',
			status: 2,
			category: '',
			hot: false,
		},
	});
	const {
		progress,
		image,
		handleDeleteImage,
		handleSelectImage,
		handleUploadImage,
	} = useFirebaseImage(setValue, getValues);

	const watchStatus = watch('status');
	const watchHot = watch('hot');

	const addPostHandler = async (values) => {
		const cloneValues = { ...values };
		cloneValues.slug = slugify(cloneValues.slug || cloneValues.title);
		cloneValues.status = Number(values.status);
		handleUploadImage(cloneValues.image);
		console.log('addPostHandler ~ cloneValues', cloneValues);
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
						<Label>Feature post</Label>
						<Toggle
							on={watchHot === true}
							onClick={() => setValue('hot', !watchHot)}
						></Toggle>
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
