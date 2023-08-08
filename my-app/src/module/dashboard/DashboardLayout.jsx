import styled from 'styled-components';
import DashboardHeader from './DashboardHeader';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/auth-context';
import NotFoundPage from '../../pages/NotFoundPage';

const DashboardLayoutStyles = styled.div`
	max-width: 1600px;
	margin: 0 auto;
	.dashboard {
		&-heading {
			font-weight: bold;
			font-size: 36px;
			margin-bottom: 5px;
			color: ${(props) => props.theme.black};
			letter-spacing: 1px;
		}
		&-short-desc {
			font-size: 14px;
			color: ${(props) => props.theme.gray80};
		}
		&-main {
			display: grid;
			grid-template-columns: 300px minmax(0, 1fr);
			padding: 40px 20px;
			gap: 0 40px;
		}
	}
`;
const DashboardLayout = () => {
	//Chưa đăng nhập thì không vào được trang Dashboard
	const { userInfo } = useAuth();
	if (!userInfo) return <NotFoundPage></NotFoundPage>;

	return (
		<DashboardLayoutStyles>
			<DashboardHeader></DashboardHeader>
			<div className="dashboard-main">
				<Sidebar></Sidebar>
				<div className="dashboard-children">
					<Outlet></Outlet>
				</div>
			</div>
		</DashboardLayoutStyles>
	);
};

export default DashboardLayout;
