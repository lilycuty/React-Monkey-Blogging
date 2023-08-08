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

const PostUpdate = () => {
	const { control } = useForm({ mode: 'onChange' });
	return (
		<>
			<DashboardHeading
				title="Update post"
				desc="Update post content"
			></DashboardHeading>
			<form>
				<div className="form-layout">
					<Field>
						<Label>Title</Label>
						<Input
							control={control}
							placeholder="Enter your title"
							name="title"
							required
						></Input>
					</Field>

					<Field>
						<Label>Slug</Label>
						<Input
							control={control}
							placeholder="Enter your slug"
							name="slug"
						></Input>
					</Field>
				</div>
				<div className="form-layout">
					<Field>
						<Label>Image</Label>
						<ImageUpload></ImageUpload>
					</Field>

					<Field>
						<Label>Category</Label>
						<Dropdown>
							<Dropdown.Select placeholder="Select the category"></Dropdown.Select>
						</Dropdown>
					</Field>
				</div>
				<div className="mb-10">
					<Field>
						<Label>Content</Label>
					</Field>
				</div>
				<div className="form-layout">
					<Field>
						<Label>Feature post</Label>
						<Toggle></Toggle>
					</Field>
					<Field>
						<Label>Status</Label>
						<FieldCheckboxes>
							<Radio name="status" control={control}>
								Approved
							</Radio>

							<Radio name="status" control={control}>
								Pending
							</Radio>

							<Radio name="status" control={control}>
								Reject
							</Radio>
						</FieldCheckboxes>
					</Field>
				</div>
				<Button type="submit" className="mx-auto w-[250px]">
					Update post
				</Button>
			</form>
		</>
	);
};

export default PostUpdate;
