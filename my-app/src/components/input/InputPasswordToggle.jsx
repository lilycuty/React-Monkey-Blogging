import { Fragment, useState } from 'react';
import Input from './Input';
import { IconEyeClose, IconEyeOpen } from '../icon';
import PropTypes from 'prop-types';

const InputPasswordToggle = ({ control, confirm }) => {
	const [togglePassword, setTogglePassword] = useState(false);
	if (!control) return null;
	return (
		<Fragment>
			<Input
				name={!confirm ? 'password' : 'confirmPassword'}
				type={`${togglePassword ? 'text' : 'password'}`}
				placeholder="Enter your password"
				control={control}
			>
				{togglePassword ? (
					<IconEyeOpen onClick={() => setTogglePassword(false)}></IconEyeOpen>
				) : (
					<IconEyeClose onClick={() => setTogglePassword(true)}></IconEyeClose>
				)}
			</Input>
		</Fragment>
	);
};
InputPasswordToggle.propTypes = {
	control: PropTypes.any,
	confirm: PropTypes.bool,
};
export default InputPasswordToggle;
