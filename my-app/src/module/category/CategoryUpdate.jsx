import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardHeading from '../dashboard/DashboardHeading';
import { Field, FieldCheckboxes } from '../../components/field';
import { Label } from '../../components/label';
import { Radio } from '../../components/checkbox';
import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { useForm } from 'react-hook-form';
import { categoryStatus } from '../../utils/constants';
import { useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';
import slugify from 'slugify';
import { toast } from 'react-toastify';

const CategoryUpdate = () => {
	const [params] = useSearchParams();
	const categoryId = params.get('id');
	const navigate = useNavigate();
	const {
		control,
		handleSubmit,
		watch,
		reset,
		formState: { isSubmitting },
	} = useForm({ mode: 'onChange', defaultValues: {} });

	const watchStatus = watch('status');

	useEffect(() => {
		async function fetchData() {
			//Get ra categoryId trong db categories
			const colRef = doc(db, 'categories', categoryId);
			const dataCategory = await getDoc(colRef);
			//Hiển thị dữ liệu
			reset(dataCategory.data());
		}
		fetchData();
	}, [categoryId, reset]);

	const handleUpdateCategory = async (values) => {
		const colRef = doc(db, 'categories', categoryId);
		await updateDoc(colRef, {
			name: values.name,
			slug: slugify(values.slug || values.name, { lower: true }),
			status: Number(values.status),
		});
		toast.success('Update category successfully!');
		navigate('/manage/category');
		console.log('handleUpdateCategory ~ values', values);
	};
	if (!categoryId) return null;
	return (
		<div>
			<DashboardHeading
				title="Update category"
				desc={`Update your category id: ${categoryId}`}
			></DashboardHeading>
			<form onSubmit={handleSubmit(handleUpdateCategory)}>
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
					Update Category
				</Button>
			</form>
		</div>
	);
};

export default CategoryUpdate;
