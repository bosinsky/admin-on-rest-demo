import { queryParameters, fetchJson } from 'admin-on-rest/lib/util/fetch';
import {
    GET_LIST,
    GET_ONE,
    CREATE,
    UPDATE,
    DELETE,
    fetchUtils,
} from 'admin-on-rest/lib/rest/types';

/**
 * Maps admin-on-rest queries to a feathers REST API
 *
 * @example
 * GET_LIST     => GET http://my.api.url/posts?$sort[title]=-1&$limit=10&$skip=10&title=value
 * GET_ONE      => GET http://my.api.url/posts/123
 * UPDATE       => PUT http://my.api.url/posts/123
 * CREATE       => POST http://my.api.url/posts/123
 * DELETE       => DELETE http://my.api.url/posts/123
 */

const endpoints = {
    'zucusers': 'app_users_profile'
};


export default (apiUrl, httpClient = fetchJson) => {
    /**
     * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
     * @param {String} resource Name of the resource to fetch, e.g. 'posts'
     * @param {Object} params The REST request params, depending on the type
     * @returns {Object} { url, options } The HTTP request parameters
     */
    const convertRESTRequestToHTTP = (type, resource, params) => {
        let url = '';
        const options = {};
        let query = {};
        let endpoint = endpoints.hasOwnProperty(resource) ? endpoints[resource] : resource;
        switch (type) {
            case GET_LIST: {
                const { page, perPage } = params.pagination;
                const { field, order } = params.sort;

                if (field) {
                    let sort = {};
                    sort[field] = order === 'DESC' ? -1 : 1;
                    query['sort'] = JSON.stringify(sort);
                }

                if(perPage && page) {
                    query['limit'] = perPage;
                    query['skip'] = perPage * (page-1);
                }

                Object.assign(query, params.filter);

                url = `${apiUrl}/${endpoint}?${queryParameters(query)}`;
                break;
            }
            case GET_ONE:
                url = `${apiUrl}/${endpoint}/${params.id}`;
                break;
            case UPDATE:
                url = `${apiUrl}/${endpoint}/${params.id}`;
                options.method = 'PUT';
                options.body = JSON.stringify(params.data);
                break;
            case CREATE:
                url = `${apiUrl}/${endpoint}`;
                options.method = 'POST';
                options.body = JSON.stringify(params.data);
                break;
            case DELETE:
                url = `${apiUrl}/${endpoint}/${params.id}`;
                options.method = 'DELETE';
                break;
            default:
                throw new Error(`Unsupported fetch action type ${type}`);
        }
        return { url, options };
    };

    /**
     * @param {Object} response HTTP response from fetch()
     * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
     * @param {String} resource Name of the resource to fetch, e.g. 'posts'
     * @param {Object} params The REST request params, depending on the type
     * @returns {Object} REST response
     */
    const convertHTTPResponseToREST = (response, type, resource, params) => {
        const { headers, json } = response;
        switch (type) {
            case GET_LIST:
                let data = json.map((item) => {
                    item['id'] = item._id
                    return item;
                })
                return {
                    data: data,
                    total: 0
                };
            case CREATE:
                json.id = json._id;
                return json;
            default:
                return json;
        }
    };

    /**
     * @param {string} type Request type, e.g GET_LIST
     * @param {string} resource Resource name, e.g. "posts"
     * @param {Object} payload Request parameters. Depends on the request type
     * @returns {Promise} the Promise for a REST response
     */
    return (type, resource, params) => {
        const { url, options } = convertRESTRequestToHTTP(type, resource, params);
        let httpResponseToRest = httpClient(url, options)
            .then(response => convertHTTPResponseToREST(response, type, resource, params));

        let total = null;
        if (type === GET_LIST) {
            let endpoint = endpoints.hasOwnProperty(resource) ? endpoints[resource] : resource;
            let countUrl = `${apiUrl}/${endpoint}/count`;
            total = httpClient(countUrl, []);
        }
        return Promise.all([httpResponseToRest, total]).then((values) => {
            let data = values[0];
            if (total) {
                data['total'] = values[1].json.count;
            }
            return data;
        });
    };
};

