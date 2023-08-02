import React from 'react';
import styled from 'styled-components';
import DashboardHeader from './DashboardHeader';
import Sidebar from './Sidebar';

const DashboardLayoutStyles = styled.div`
	max-width: 1600px;
	margin: 0 auto;
`;
const DashboardLayout = () => {
	return (
		<DashboardLayoutStyles>
			<DashboardHeader></DashboardHeader>
			<div className="dashboard-main">
				<Sidebar></Sidebar>
			</div>
		</DashboardLayoutStyles>
	);
};

export default DashboardLayout;
