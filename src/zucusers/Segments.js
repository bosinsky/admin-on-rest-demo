import React from 'react';
import { Card, CardTitle } from 'material-ui/Card';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import { translate } from 'admin-on-rest';

import segments from './data';

const styles = {
    card: { margin: '2em' } ,
};

export default translate(({ translate }) => (
    <Card style={styles.card}>
        <CardTitle title="utenti zuc" />
        <Table>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                    <TableHeaderColumn>_id</TableHeaderColumn>
                    <TableHeaderColumn>{translate('resources.segments.fields.name')}</TableHeaderColumn>
                    <TableHeaderColumn>Cognome</TableHeaderColumn>
                </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
                {segments.map(segment => (
                    <TableRow key={segment.id}>
                        <TableRowColumn>{translate(segment.name)}</TableRowColumn>
                        <TableRowColumn>{translate(segment.name)}</TableRowColumn>
                        <TableRowColumn>{translate(segment.name)}</TableRowColumn>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </Card>
));
