import { signOut } from 'firebase/auth';
import React from 'react';
import { auth } from '../firebase/firebase-config';
import styled from 'styled-components';
import Layout from '../components/layout/Layout';
import HomeBanner from '../module/home/HomeBanner';

const HomePageStyles = styled.div``;

const HomePage = () => {
	return (
		<HomePageStyles>
			<Layout>
				<HomeBanner></HomeBanner>
			</Layout>
		</HomePageStyles>
	);
};

export default HomePage;
