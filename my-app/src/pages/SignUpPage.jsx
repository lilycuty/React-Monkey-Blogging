/* eslint-disable no-unused-vars */
import React from 'react';
import styled from 'styled-components';
import { Label } from '../components/label';
import { Input } from '../components/input';
import { useForm } from 'react-hook-form';

const SignUpPageStyles = styled.div`
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
	.field {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		row-gap: 20px;
	}

	.form {
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}
`;

const SignUpPage = () => {
	const {
		control,
		handleSubmit,
		formState: { errors, isValid, isSubmitting },
		watch,
	} = useForm({});
	const handleSignUp = (values) => {
		console.log('handleSignUp ~ values', values);
	};

	return (
		<SignUpPageStyles>
			<div className="container">
				<img srcSet="/logo.png 2x" alt="monkey-blogging" className="logo" />

				<h1 className="heading">Monkey Blogging</h1>

				<form className="form" onSubmit={handleSubmit(handleSignUp)}>
					<div className="field">
						<Label htmlFor="fullname">Fullname</Label>
						<Input
							name="fullname"
							type="text"
							placeholder="Enter your fullname"
							control={control}
						></Input>
					</div>
				</form>
			</div>
		</SignUpPageStyles>
	);
};

export default SignUpPage;
