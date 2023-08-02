import React, { Fragment, useState } from 'react';
import Input from './Input';
import { IconEyeClose, IconEyeOpen } from '../icon';

const InputPasswordToggle = ({ control }) => {
	const [togglePassword, setTogglePassword] = useState(false);
	if (!control) return null;
	return (
		<Fragment>
			<Input
				name="password"
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

export default InputPasswordToggle;
