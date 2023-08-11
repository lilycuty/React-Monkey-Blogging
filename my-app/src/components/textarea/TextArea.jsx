import { useController } from 'react-hook-form';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const TextAreaStyles = styled.div`
	position: relative;
	width: 100%;
	textarea {
		width: 100%;
		padding: 20px;
		background-color: ${(props) => props.theme.grayLight};
		border-radius: 8px;
		font-weight: 500;
		transition: all 0.2s linear;
		border: 1px solid transparent;
		resize: none;
		min-height: 150px;
	}
	textarea:focus {
		background-color: white;
		border-color: ${(props) => props.theme.primary};
	}
	textarea::-webkit-input-placeholder {
		color: #84878b;
	}
	textarea::-moz-input-placeholder {
		color: #84878b;
	}
`;

/**
 *
 * @param {*} placeholder(optional) - Placeholder of input
 * @param {*} name(optional) - name of input
 * @param {*} control(optional) - control from react hook form
 * @returns TextArea
 */

const TextArea = ({ name = '', type = 'text', control, ...props }) => {
	const { field } = useController({
		control,
		name,
		defaultValue: '',
	});

	return (
		<TextAreaStyles>
			<textarea
				id={name}
				type={type}
				{...field}
				{...props}
				autoComplete="off"
			></textarea>
		</TextAreaStyles>
	);
};
TextArea.propTypes = {
	name: PropTypes.string,
	type: PropTypes.string,
	children: PropTypes.node,
	control: PropTypes.any,
};
export default TextArea;
