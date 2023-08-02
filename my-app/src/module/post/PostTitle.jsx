import React from 'react';
import styled, { css } from 'styled-components';
import { NavLink } from 'react-router-dom';
const PostTitleStyles = styled.h3`
	font-weight: 600;
	line-height: 1.5;
	a {
		display: block;
	}
	${(props) =>
		props.size === 'normal' &&
		css`
			font-size: 18px;
		`};
	${(props) =>
		props.size === 'big' &&
		css`
			font-size: 22px;
		`};
`;
const PostTitle = ({
	className = ' ',
	children,
	size = 'normal',
	to = '/',
}) => {
	return (
		<PostTitleStyles size={size} className={`post-title ${className}`}>
			<NavLink to={to}>{children}</NavLink>
		</PostTitleStyles>
	);
};

export default PostTitle;

/**
 * size: normal: 18px - big: 22px
 */
