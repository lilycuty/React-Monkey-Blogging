import { useEffect, useState } from 'react';
import { Table } from '../../components/table';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';
import { ActionDelete, ActionEdit } from '../../components/action';
import { useNavigate } from 'react-router-dom';
import { userRole, userStatus } from '../../utils/constants';
import { LabelStatus } from '../../components/label';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const UserTable = () => {
	const [userList, setUserList] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const colRef = collection(db, 'users');
		onSnapshot(colRef, (snapshot) => {
			const results = [];
			snapshot.forEach((doc) => {
				results.push({
					id: doc.id,
					...doc.data(),
				});
			});
			setUserList(results);
		});
	});

	//Handle when click icon delete
	const handleDeleteUser = (user) => {
		const colRef = doc(db, 'users', user.id);
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
				toast.success('Delete successfully');
				Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
			}
		});
	};

	//Display user status column
	const renderUserStatus = (status) => {
		switch (status) {
			case userStatus.ACTIVE:
				return <LabelStatus type="success">Active</LabelStatus>;
			case userStatus.PENDDING:
				return <LabelStatus type="warning">Pendding</LabelStatus>;
			case userStatus.BAN:
				return <LabelStatus type="danger">Rejected</LabelStatus>;
			default:
				return 'Not Update';
		}
	};
	//Display user role column
	const renderUserRole = (role) => {
		switch (role) {
			case userRole.ADMIN:
				return 'Admin';
			case userRole.MODERATOR:
				return 'Moderator';
			case userRole.USER:
				return 'User';
			default:
				return 'Not Update';
		}
	};
	return (
		<div>
			<Table>
				<thead>
					<tr>
						<th>Id</th>
						<th>Info</th>
						<th>Username</th>
						<th>Email address</th>
						<th>Status</th>
						<th>Role</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{userList.length > 0 &&
						userList.map((user) => (
							<tr key={user.id}>
								<td title={user.id}>{user?.id.slice(0, 5) + '...'}</td>
								<td className="whitespace-nowrap">
									<div className="flex items-center gap-x-3">
										<img
											src={user?.avatar}
											className="w-10 h-10 object-cover rounded-md flex-shrink-0"
										/>
										<div className="flex items-start flex-col justify-center">
											<h3>{user?.fullname}</h3>
											<time className="text-sm text-gray-500">
												{new Date(
													user.createdAt.seconds * 1000
												).toLocaleDateString('vi-VI') ||
													new Date().toLocaleDateString('vi-VI')}
											</time>
										</div>
									</div>
								</td>
								<td>{user?.username || ''}</td>
								<td>{user?.email}</td>
								<td>{renderUserStatus(Number(user?.status))}</td>
								<td>{renderUserRole(Number(user?.role))}</td>
								<td>
									<div className="flex items-center gap-x-3">
										<ActionEdit
											onClick={() =>
												navigate(`/manage/update-user?id=${user?.id}`)
											}
										></ActionEdit>
										<ActionDelete
											onClick={() => handleDeleteUser(user)}
										></ActionDelete>
									</div>
								</td>
							</tr>
						))}
				</tbody>
			</Table>
		</div>
	);
};

export default UserTable;
