import React from 'react';
import styled from 'styled-components';

const PaginationStyles = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0 10px;
	.pagination {
		&-list {
			display: flex;
			align-items: center;
			gap: 0 10px;
		}
		&-prev,
		&-next,
		&-item {
			display: flex;
			justify-content: center;
			align-items: center;
			font-weight: 500;
			width: 40px;
			height: 40px;
			cursor: pointer;
			border: 1px solid #ccc;
			border-radius: 10px;
			&:hover {
				color: white;
				background-color: ${(props) => props.theme.secondary};
			}
		}
		&-item.is-current {
			color: white;
			background-color: ${(props) => props.theme.secondary};
		}
	}
`;
const Pagination = () => {
	return (
		<PaginationStyles>
			<span className="pagination-prev">
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
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</span>

			<ul className="pagination-list">
				<li className="pagination-item">1</li>
				<li className="pagination-item is-current">2</li>
				<li className="pagination-item">3</li>
				<li className="pagination-item">...</li>
				<li className="pagination-item">10</li>
			</ul>

			<span className="pagination-next">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth="2"
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
				</svg>
			</span>
		</PaginationStyles>
	);
};

export default Pagination;
