import { useForm } from 'react-hook-form';
import DashboardHeading from '../dashboard/DashboardHeading';
import { Field, FieldCheckboxes } from '../../components/field';
import { Label } from '../../components/label';
import { Input } from '../../components/input';
import { Radio } from '../../components/checkbox';
import { Button } from '../../components/button';
import slugify from 'slugify';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';
import { categoryStatus } from '../../utils/constants';

const CategoryAddNew = () => {
	const {
		control,
		handleSubmit,
		watch,
		formState: { isSubmitting, isValid },
	} = useForm({
		mode: 'onChange',
		defaultValues: {
			name: '',
			slug: '',
			status: 1,
			createAt: new Date(),
		},
	});
	const watchStatus = watch('status');

	const handleAddNewCategory = async (values) => {
		if (!isValid) return;
		const cloneValues = { ...values };
		cloneValues.slug = slugify(cloneValues.name || cloneValues.slug, {
			lower: true,
		});
		cloneValues.status = Number(cloneValues.status);
		const colRef = collection(db, 'categories');
		await addDoc(colRef, {
			...cloneValues,
			createAt: serverTimestamp(),
		});
		console.log('handleAddNewCategory ~ cloneValues', cloneValues);
	};
	return (
		<div>
			<DashboardHeading
				title="New category"
				desc="Add new category"
			></DashboardHeading>
			<form onSubmit={handleSubmit(handleAddNewCategory)}>
				<div className="form-layout">
					<Field>
						<Label>Name</Label>
						<Input
							control={control}
							name="name"
							placeholder="Enter your category name"
						></Input>
					</Field>
					<Field>
						<Label>Slug</Label>
						<Input
							control={control}
							name="slug"
							placeholder="Enter your slug"
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
								checked={Number(watchStatus) === categoryStatus.APPROVED}
								value={categoryStatus.APPROVED}
							>
								Approved
							</Radio>
							<Radio
								name="status"
								control={control}
								checked={Number(watchStatus) === categoryStatus.UNAPPROVED}
								value={categoryStatus.UNAPPROVED}
							>
								Unapproved
							</Radio>
						</FieldCheckboxes>
					</Field>
				</div>
				<Button
					type="submit"
					kind="primary"
					className="mx-auto w-[250px]"
					isLoading={isSubmitting}
					disabled={isSubmitting}
				>
					Add new category
				</Button>
			</form>
		</div>
	);
};

export default CategoryAddNew;
