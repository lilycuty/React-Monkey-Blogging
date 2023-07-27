import React from 'react';
import styled from 'styled-components';

const AuthenticationPageStyles = styled.div`
	min-height: 100vh;
	.logo {
		margin: 20px auto;
	}
	.heading {
		text-align: center;
		color: ${(props) => props.theme.primary};
		font-weight: bold;
		font-size: 40px;
		margin-bottom: 60px;
	}
	.form {
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}
`;

const AuthenticationPage = ({ children }) => {
	return (
		<AuthenticationPageStyles>
			<div className="container">
				<img srcSet="/logo.png 2x" alt="monkey-blogging" className="logo" />

				<h1 className="heading">Monkey Blogging</h1>

				{children}
			</div>
		</AuthenticationPageStyles>
	);
};

export default AuthenticationPage;
