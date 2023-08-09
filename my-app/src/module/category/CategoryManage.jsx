/* eslint-disable no-mixed-spaces-and-tabs */
import { useEffect, useState } from 'react';
import { ActionDelete, ActionEdit, ActionView } from '../../components/action';
import { Button } from '../../components/button';
import { LabelStatus } from '../../components/label';
import { Table } from '../../components/table';
import DashboardHeading from '../dashboard/DashboardHeading';
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	limit,
	onSnapshot,
	query,
	startAfter,
	where,
} from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';
import { categoryStatus } from '../../utils/constants';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';

const CATEGORY_PER_PAGE = 1;

const CategoryManage = () => {
	const [categoryList, setCategoryList] = useState([]);
	const navigate = useNavigate();
	const [filter, setFilter] = useState('');
	const [lastDoc, setLastDoc] = useState();
	const [total, setTotal] = useState(0);

	const handleLoadMoreCategory = async () => {
		//lúc này startAfter sẽ lấy ra thằng đằng sau thằng hiện tại
		const nextRef = query(
			collection(db, 'categories'),
			startAfter(lastDoc),
			limit(CATEGORY_PER_PAGE)
		);

		onSnapshot(nextRef, (snapshot) => {
			let results = [];
			snapshot.forEach((doc) => {
				results.push({
					id: doc.id,
					...doc.data(),
				});
			});
			console.log(results);
			setCategoryList([...categoryList, ...results]);
		});

		const documentSnapshots = await getDocs(nextRef);
		const lastVisible =
			documentSnapshots.docs[documentSnapshots.docs.length - 1];
		setLastDoc(lastVisible);
	};

	useEffect(() => {
		async function fetchData() {
			const colRef = collection(db, 'categories');
			const newRef = filter
				? query(
						colRef,
						where('name', '>=', filter),
						where('name', '<=', filter + 'utf8')
				  )
				: query(colRef, limit(CATEGORY_PER_PAGE));

			//Khi component chạy -> set thằng đầu tiên trong db categories vào state lastDoc
			const documentSnapshots = await getDocs(newRef);
			const lastVisible =
				documentSnapshots.docs[documentSnapshots.docs.length - 1];
			setLastDoc(lastVisible);

			onSnapshot(colRef, (snapshot) => {
				setTotal(snapshot.size);
			});

			onSnapshot(newRef, (snapshot) => {
				let results = [];
				snapshot.forEach((doc) => {
					results.push({
						id: doc.id,
						...doc.data(),
					});
				});
				setCategoryList(results);
			});
		}
		fetchData();
	}, [filter]);

	const handleDeleteCategory = (docId) => {
		const colRef = doc(db, 'categories', docId);
		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!',
		}).then(async (result) => {
			if (result.isConfirmed) {
				await deleteDoc(colRef);
				Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
			}
		});
	};
	const handleInputFilter = debounce((e) => {
		setFilter(e.target.value);
	}, 500);

	// if (categoryList.length <= 0) return;

	return (
		<div>
			<DashboardHeading title="Categories" desc="Manage your category">
				<Button kind="ghost" height="60px" to="/manage/add-category">
					Create category
				</Button>
			</DashboardHeading>
			<div className="mb-10 flex justify-end ">
				<input
					type="text"
					placeholder="Search Category...."
					className="p-4 border border-gray-400 rounded-lg"
					onChange={handleInputFilter}
				/>
			</div>
			<Table>
				<thead>
					<tr>
						<th>Id</th>
						<th>Name</th>
						<th>Slug</th>
						<th>Status</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{categoryList.length > 0 &&
						categoryList.map((category) => (
							<tr key={category.id}>
								<td>{category.id}</td>
								<td>{category.name}</td>
								<td>
									<span className="italic text-gray-400">{category.slug}</span>
								</td>
								<td>
									{Number(category.status) === categoryStatus.APPROVED && (
										<LabelStatus type="success">Approved</LabelStatus>
									)}
									{Number(category.status) === categoryStatus.UNAPPROVED && (
										<LabelStatus type="warning">Unapproved</LabelStatus>
									)}
								</td>
								<td>
									<div className="flex items-center gap-x-3">
										<ActionView></ActionView>
										<ActionEdit
											onClick={() =>
												navigate(`/manage/update-category?id=${category.id}`)
											}
										></ActionEdit>
										<ActionDelete
											onClick={() => handleDeleteCategory(category.id)}
										></ActionDelete>
									</div>
								</td>
							</tr>
						))}
				</tbody>
			</Table>
			<div className="mt-10">
				{total > categoryList.length && (
					<Button onClick={handleLoadMoreCategory} className="mx-auto">
						Load more
					</Button>
				)}
			</div>
		</div>
	);
};

export default CategoryManage;
