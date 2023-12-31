import styled from 'styled-components';
import PropTypes from 'prop-types';

const TableStyles = styled.div`
	overflow-x: auto;
	background-color: white;
	border-radius: 10px;
	table {
		width: 100%;
		white-space: nowrap;
	}
	thead {
		background-color: #f7f7f8;
	}
	th,
	td {
		vertical-align: middle;
	}
	th {
		padding: 20px 30px;
		font-weight: 600;
		text-align: left;
	}
	td {
		padding: 15px 30px;
	}
	tbody {
	}
`;
const Table = ({ children }) => {
	return (
		<TableStyles>
			<table>{children}</table>
		</TableStyles>
	);
};

Table.propTypes = {
	children: PropTypes.any,
};
export default Table;
