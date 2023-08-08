import { useController } from 'react-hook-form';
import PropTypes from 'prop-types';

const Radio = ({ checked, children, control, name, ...rest }) => {
	const { field } = useController({
		control,
		name,
		defaultValue: '',
	});

	return (
		<label>
			<input
				className="hidden-input"
				checked={checked}
				type="radio"
				{...field}
				{...rest}
			/>
			<div className="flex items-center gap-x-3 font-medium cursor-pointer">
				<div
					className={`w-7 h-7 rounded-full border flex items-center justify-center p-1 ${
						checked
							? 'bg-green-400 border-green-400 text-white'
							: 'bg-gray-200 text-transparent'
					}`}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M5 13l4 4L19 7"
						/>
					</svg>
				</div>
				<span>{children}</span>
			</div>
		</label>
	);
};

Radio.propTypes = {
	checked: PropTypes.bool,
	children: PropTypes.node,
	control: PropTypes.any,
	name: PropTypes.string,
};
export default Radio;
