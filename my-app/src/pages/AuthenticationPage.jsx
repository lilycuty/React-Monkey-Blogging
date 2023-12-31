import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';

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
	.have-account {
		margin-bottom: 20px;
		a {
			display: inline-block;
			color: ${(props) => props.theme.primary};
			font-weight: 500;
		}
	}
`;

const AuthenticationPage = ({ children }) => {
	return (
		<AuthenticationPageStyles>
			<div className="container">
				<NavLink to="/">
					<img srcSet="/logo.png 2x" alt="monkey-blogging" className="logo" />
				</NavLink>

				<h1 className="heading">Monkey Blogging</h1>

				{children}
			</div>
		</AuthenticationPageStyles>
	);
};
AuthenticationPage.propTypes = {
	children: PropTypes.node,
};
export default AuthenticationPage;
