import React from 'react';
import {
    Create,
    Datagrid,
    Edit,
    EditButton,
    FormTab,
    List,
    NumberField,
    ReferenceManyField,
    SimpleForm,
    TabbedForm,
    TextField,
    TextInput,
} from 'admin-on-rest/lib/mui';
import { translate } from 'admin-on-rest';
import Icon from 'material-ui/svg-icons/action/face';

/*
import ThumbnailField from '../products/ThumbnailField';
import ProductRefField from '../products/ProductRefField';
import LinkToRelatedProducts from './LinkToRelatedProducts';
*/

export const ZucUserIcon = Icon;

export const ZucUserList = (props) => (
    <List {...props} sort={{ field: 'name', order: 'ASC' }}>
        <Datagrid >
            <TextField source="surname" style={{ padding: '0 12px 0 25px' }} />
            <TextField source="name" style={{ padding: '0 12px 0 25px' }} />
            {/*<LinkToRelatedProducts />*/}
            <EditButton />
        </Datagrid>
    </List>
);

export const ZucUserCreate = (props) => (
    <Create {...props}>
        <TabbedForm>
            <FormTab label="resources.products.tabs.details">
                <TextInput source="name" validation={{ required: true }} />
                <TextInput source="surname" validation={{ required: true }} />
            </FormTab>
        </TabbedForm>
    </Create>
);

const ZucUserTitle = translate(({ record, translate }) => <span>{translate('resources.zucusers.user', { smart_count: 1 })} "{record.surname} {record.name}"</span>);
export const ZucUserEdit = (props) => (
    <Edit title={<ZucUserTitle />} {...props}>
        <SimpleForm>
            <TextInput source="surname" />
            <TextInput source="name" />
            {/*<ReferenceManyField reference="products" target="category_id" label="resources.categories.fields.products" perPage={5}>*/}
                {/*<Datagrid>*/}
                    {/*<ThumbnailField />*/}
                    {/*<ProductRefField source="reference" />*/}
                    {/*<NumberField source="price" options={{ style: 'currency', currency: 'USD' }} />*/}
                    {/*<NumberField source="width" options={{ minimumFractionDigits: 2 }} />*/}
                    {/*<NumberField source="height" options={{ minimumFractionDigits: 2 }} />*/}
                    {/*<NumberField source="stock" />*/}
                    {/*<EditButton />*/}
                {/*</Datagrid>*/}
            {/*</ReferenceManyField>*/}
        </SimpleForm>
    </Edit>
);
