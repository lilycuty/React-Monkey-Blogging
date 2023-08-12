import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

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
const PostTitle = ({ className = ' ', children, size = 'normal', to = '' }) => {
	return (
		<PostTitleStyles size={size} className={`post-title ${className}`}>
			<Link to={`/${to}`}>{children}</Link>
		</PostTitleStyles>
	);
};

PostTitle.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node,
	size: PropTypes.string,
	to: PropTypes.string,
};

export default PostTitle;

/**
 * size: normal: 18px - big: 22px
 */
