import { Button } from '../../components/button';
import DashboardHeading from '../dashboard/DashboardHeading';
import UserTable from './UserTable';

const UserManage = () => {
	return (
		<div>
			<DashboardHeading
				title="Users"
				desc="Manage your user"
			></DashboardHeading>
			<div className="flex justify-end mb-10">
				<Button to={'/manage/add-user'} kind="ghost">
					Add new user
				</Button>
			</div>
			<UserTable></UserTable>
		</div>
	);
};

export default UserManage;
