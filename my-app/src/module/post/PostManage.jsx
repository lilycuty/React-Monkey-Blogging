/* eslint-disable no-mixed-spaces-and-tabs */
import { Table } from '../../components/table';
import DashboardHeading from '../dashboard/DashboardHeading';
import { ActionView } from '../../components/action';
import { ActionEdit } from '../../components/action';
import { ActionDelete } from '../../components/action';
import { Button } from '../../components/button';
import { useEffect, useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { postStatus } from '../../utils/constants';
import { LabelStatus } from '../../components/label';
import { debounce } from 'lodash';

const POST_PER_PAGE = 10;

const PostManage = () => {
	const [postList, setPostList] = useState([]);
	const [lastDoc, setLastDoc] = useState();
	const [filter, setFilter] = useState('');
	const [total, setTotal] = useState(0);
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchData() {
			const colRef = collection(db, 'posts');
			const newRef = filter
				? query(
						colRef,
						where('title', '>=', filter),
						where('title', '<=', filter + 'utf8')
				  )
				: query(colRef, limit(POST_PER_PAGE));

			//Khi component chạy -> set thằng đầu tiên trong db categories vào state lastDoc
			const documentSnapshots = await getDocs(newRef);
			const lastVisible =
				documentSnapshots.docs[documentSnapshots.docs.length - 1];
			setLastDoc(lastVisible);

			//Get total post in db posts
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
				setPostList(results);
			});
		}
		fetchData();
	}, [filter]);

	//Xoá post
	const handleDeletePost = async (postID) => {
		const colRef = doc(db, 'posts', postID);
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
				toast.success(`Delete post successfully with id: ${postID}`);
				Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
			}
		});
	};

	//Render Status Post
	const renderPostStatus = (status) => {
		switch (status) {
			case postStatus.APPROVED:
				return <LabelStatus type="success">Approved</LabelStatus>;
			case postStatus.PENDDING:
				return <LabelStatus type="warning">Pendding</LabelStatus>;
			case postStatus.REJECTED:
				return <LabelStatus type="danger">Rejected</LabelStatus>;
			default:
				return 'Not Update';
		}
	};

	//When click button load more
	const handleLoadMorePost = async () => {
		//lúc này startAfter sẽ lấy ra thằng đằng sau thằng hiện tại
		const nextRef = query(
			collection(db, 'posts'),
			startAfter(lastDoc),
			limit(POST_PER_PAGE)
		);

		onSnapshot(nextRef, (snapshot) => {
			let results = [];
			snapshot.forEach((doc) => {
				results.push({
					id: doc.id,
					...doc.data(),
				});
			});
			setPostList([...postList, ...results]);
		});

		const documentSnapshots = await getDocs(nextRef);
		const lastVisible =
			documentSnapshots.docs[documentSnapshots.docs.length - 1];
		setLastDoc(lastVisible);
	};

	//Handle input when search
	const handleInputFilter = debounce((e) => {
		setFilter(e.target.value);
	}, 500);

	return (
		<div>
			<DashboardHeading
				title="All posts"
				desc="Manage all posts"
			></DashboardHeading>

			<div className="flex justify-end gap-5 mb-10">
				<div className="w-full max-w-[300px]">
					<input
						type="text"
						className="w-full p-4 border border-gray-300 border-solid rounded-lg"
						placeholder="Search post..."
						onChange={handleInputFilter}
					/>
				</div>
			</div>

			<Table>
				<thead>
					<tr>
						<th>Id</th>
						<th>Post</th>
						<th>Category</th>
						<th>Author</th>
						<th>Status</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{postList?.length > 0 &&
						postList.map((post) => {
							const date = post?.createdAt?.seconds
								? new Date(post.createdAt.seconds * 1000)
								: new Date();
							const formatDate = new Date(date).toLocaleDateString('vi-VI');
							return (
								<tr key={post.id}>
									<td title={post.id}>{post.id.slice(0, 5) + '...'}</td>
									<td className="!pr-[100px]">
										<div className="flex items-center gap-x-3">
											<img
												src={post.image || ''}
												alt={post.title || 'Error image'}
												className="w-[66px] h-[55px] rounded object-cover"
											/>
											<div className="flex-1">
												<h3 className="font-semibold">
													{post.title || 'Not Update'}
												</h3>
												<time className="text-sm text-gray-500">
													Date:{' '}
													{formatDate || new Date().toLocaleDateString('vi-VI')}
												</time>
											</div>
										</div>
									</td>
									<td>
										<span className="text-gray-500">
											{post?.category?.name || 'Not Update'}
										</span>
									</td>
									<td>
										<span className="text-gray-500">
											{post?.user?.username || 'Not Update'}
										</span>
									</td>
									<td>{renderPostStatus(post.status)}</td>
									<td>
										<div className="flex items-center gap-x-3 text-gray-500">
											<ActionView
												onClick={() => navigate(`/${post.slug}`)}
											></ActionView>
											<ActionEdit
												onClick={() =>
													navigate(`/manage/update-post?id=${post.id}`)
												}
											></ActionEdit>
											<ActionDelete
												onClick={() => handleDeletePost(post.id)}
											></ActionDelete>
										</div>
									</td>
								</tr>
							);
						})}
				</tbody>
			</Table>
			<div className="mt-10 text-center">
				{total > postList.length && (
					<Button className="mx-auto w-[200px]" onClick={handleLoadMorePost}>
						Load more
					</Button>
				)}
			</div>
		</div>
	);
};

export default PostManage;
