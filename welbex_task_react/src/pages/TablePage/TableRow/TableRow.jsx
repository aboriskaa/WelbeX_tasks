import React, { } from 'react';

const TableRow = ({ date, name, amount, distance }) => {

    return <tr>
        <td>{date}</td>
        <td>{name}</td>
        <td>{amount}</td>
        <td>{distance}</td>
    </tr>
}

export default TableRow;