import styled from 'styled-components';
import { Button } from '../button';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/auth-context';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase-config';
const meneLinks = [
	{
		url: '/',
		title: 'Home',
	},
	{
		url: '/blog',
		title: 'Blog',
	},
	{
		url: '/contact',
		title: 'Contact',
	},
];

const HeaderStyles = styled.div`
	padding: 15px 0;
	.header-main {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.header-auth {
		display: flex;
		align-items: center;
		justify-content: center;
		column-gap: 10px;
		cursor: pointer;
	}
	.logo {
		display: block;
		max-width: 50px;
	}
	.menu {
		display: flex;
		align-items: center;
		gap: 20px;
		margin-left: 40px;
		list-style: none;
		font-weight: 500;
	}
	.search {
		margin-left: auto;
		padding: 15px 25px;
		border: 1px solid #ccc;
		border-radius: 8px;
		width: 100%;
		max-width: 320px;
		position: relative;
		margin-right: 20px;
	}
	.search-input {
		flex: 1;
		font-weight: 500;
	}
	.search-icon {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: 25px;
	}
	.auth {
		position: relative;
		width: 52px;
		height: 52px;
		&-list {
			width: 150px;
			background-color: #f8f8f8;
			border-radius: 10px;
			overflow: hidden;
			box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
			margin-top: 15px;
			display: none;
		}
		&-item {
			padding: 10px;
			border-bottom: 1px solid red;
			&:last-child {
				border-bottom: none;
			}
			&:hover {
				background-color: #ccc;
			}
		}
		&::before {
			content: '';
			position: absolute;
			width: 100px;
			height: 30px;
			background-color: transparent;
			bottom: 0;
			transform: translateY(60%);
		}
	}
`;

const getLastName = (name) => {
	if (!name) return 'User';
	const length = name.split(' ').length;
	return name.split(' ')[length - 1];
};

const Header = () => {
	const { userInfo } = useAuth();
	const handleLogout = () => {
		signOut(auth);
	};
	return (
		<HeaderStyles>
			<div className="container">
				<div className="header-main">
					<NavLink to="/">
						<img srcSet="/logo.png 2x" alt="monkey-blogging" className="logo" />
					</NavLink>
					<ul className="menu">
						{meneLinks.map((item) => (
							<li className="menu-item" key={item.title}>
								<NavLink to={item.url} className="menu-link">
									{item.title}
								</NavLink>
							</li>
						))}
					</ul>

					{/* <div className="search">
						<input
							type="text"
							className="search-input"
							placeholder="Search posts..."
						/>
						<span className="search-icon">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="17"
								viewBox="0 0 18 17"
								fill="none"
							>
								<ellipse
									cx="7.66669"
									cy="7.05161"
									rx="6.66669"
									ry="6.05161"
									stroke="#999999"
									strokeWidth="1.5"
								/>
								<path
									d="M17.0001 15.5237L15.2223 13.9099L14.3334 13.103L12.5557 11.4893"
									stroke="#999999"
									strokeWidth="1.5"
									strokeLinecap="round"
								/>
								<path
									d="M11.6665 12.2964C12.9671 12.1544 13.3706 11.8067 13.4443 10.6826"
									stroke="#999999"
									strokeWidth="1.5"
									strokeLinecap="round"
								/>
							</svg>
						</span>
					</div> */}

					{!userInfo ? (
						<Button
							type="button"
							height="56px"
							className="header-button"
							to="/sign-up"
						>
							Sign Up
						</Button>
					) : (
						<div className="header-auth">
							<div>
								<span>Welcome back, </span>
								<strong className="text-primary">
									{getLastName(userInfo?.displayName)}
								</strong>
							</div>
							<div className="auth group transition-all">
								<img
									src={userInfo?.avatar || 'Not Update'}
									alt={userInfo?.username || 'Not Update'}
									className="w-full h-full object-cover rounded-full"
								/>
								<ul className="auth-list group-hover:inline-block">
									<li className="auth-item">
										<NavLink to={'/profile'} className="auth-link">
											Profile
										</NavLink>
									</li>
									<li className="auth-item">
										<a className="auth-link" onClick={handleLogout}>
											Log out
										</a>
									</li>
								</ul>
							</div>
						</div>
					)}
				</div>
			</div>
		</HeaderStyles>
	);
};

export default Header;
