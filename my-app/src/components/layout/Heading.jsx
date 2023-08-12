import styled from 'styled-components';
import PropTypes from 'prop-types';

const HeadingStyles = styled.h2`
	color: ${(props) => props.theme.tertiary};
	font-size: 28px;
	position: relative;
	margin-bottom: 30px;
	font-weight: 600;
	&:before {
		content: '';
		width: 50px;
		height: 4px;
		background-image: linear-gradient(
			to right bottom,
			${(props) => props.theme.primary},
			${(props) => props.theme.secondary}
		);
		position: absolute;
		top: 0;
		left: 0;
		transform: translate(0, -150%);
	}
	@media screen and (max-width: 1023.98px) {
		font-size: 22px;
		margin-bottom: 20px;
	}
`;
const Heading = ({ className = '', children }) => {
	return <HeadingStyles className={className}>{children}</HeadingStyles>;
};
Heading.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node,
};
export default Heading;
