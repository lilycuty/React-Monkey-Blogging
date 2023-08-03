import React from 'react';
import styled from 'styled-components';
import DashboardHeader from './DashboardHeader';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayoutStyles = styled.div`
	max-width: 1600px;
	margin: 0 auto;
	.dashboard {
		&-heading {
			font-weight: bold;
			font-size: 36px;
			margin-bottom: 40px;
			color: ${(props) => props.theme.primary};
			letter-spacing: 1px;
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
