import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

const PostCategoryStyles = styled.div`
	display: inline-block;
	padding: 4px 10px;
	border-radius: 10px;
	color: ${(props) => props.theme.gray6B};
	font-size: 14px;
	font-weight: 600;
	a {
		display: block;
	}
	${(props) =>
		props.type === 'primary' &&
		css`
			background-color: ${(props) => props.theme.grayF3};
		`};
	${(props) =>
		props.type === 'secondary' &&
		css`
			background-color: white;
		`};
`;
const PostCategory = ({
	children,
	type = 'primary',
	className = '',
	to = '/',
}) => {
	return (
		<PostCategoryStyles type={type} className={`post-category ${className}`}>
			<NavLink to={to}>{children}</NavLink>
		</PostCategoryStyles>
	);
};
PostCategory.propTypes = {
	children: PropTypes.node,
	type: PropTypes.string,
	className: PropTypes.string,
	to: PropTypes.string,
};
export default PostCategory;

/**
 * type truyền vào để đổi màu, component này sử dụng PostCategory màu này, component khác sử dụng PostCategory màu khác -> Giúp việc tái sử dụng nhiều nơi
 * className: dùng trong trường hợp muốn đè style
 */
