'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _fetch = require('admin-on-rest/lib/util/fetch');

var _types = require('admin-on-rest/lib/rest/types');

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
exports.default = function (apiUrl) {
    var httpClient = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _fetch.fetchJson;

    /**
     * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
     * @param {String} resource Name of the resource to fetch, e.g. 'posts'
     * @param {Object} params The REST request params, depending on the type
     * @returns {Object} { url, options } The HTTP request parameters
     */
    var convertRESTRequestToHTTP = function convertRESTRequestToHTTP(type, resource, params) {
        var url = '';
        var options = {};
        var query = {};
        switch (type) {
            case _types.GET_LIST:
            {
                var _params$pagination = params.pagination,
                    page = _params$pagination.page,
                    perPage = _params$pagination.perPage;
                var _params$sort = params.sort,
                    field = _params$sort.field,
                    order = _params$sort.order;


                var sortKey = '$sort[' + field + ']';
                var sortVal = order === 'DESC' ? -1 : 1;
                if (perPage && page) {
                    query['$limit'] = perPage;
                    query['$skip'] = perPage * (page - 1);
                }
                if (order) {
                    query[sortKey] = JSON.stringify(sortVal);
                }

                Object.assign(query, params.filter);

                url = apiUrl + '/' + resource + '?' + (0, _fetch.queryParameters)(query);
                break;
            }
            case _types.GET_ONE:
                url = apiUrl + '/' + resource + '/' + params.id;
                break;
            case _types.UPDATE:
                url = apiUrl + '/' + resource + '/' + params.id;
                options.method = 'PUT';
                options.body = JSON.stringify(params.data);
                break;
            case _types.CREATE:
                url = apiUrl + '/' + resource;
                options.method = 'POST';
                options.body = JSON.stringify(params.data);
                break;
            case _types.DELETE:
                url = apiUrl + '/' + resource + '/' + params.id;
                options.method = 'DELETE';
                break;
            default:
                throw new Error('Unsupported fetch action type ' + type);
        }
        return { url: url, options: options };
    };

    /**
     * @param {Object} response HTTP response from fetch()
     * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
     * @param {String} resource Name of the resource to fetch, e.g. 'posts'
     * @param {Object} params The REST request params, depending on the type
     * @returns {Object} REST response
     */
    var convertHTTPResponseToREST = function convertHTTPResponseToREST(response, type, resource, params) {
        var headers = response.headers,
            json = response.json;

        switch (type) {
            case _types.GET_LIST:
                return {
                    data: json.data,
                    total: json.total
                };
            case _types.CREATE:
                return _extends({}, params.data, { id: json.id });
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
    return function (type, resource, params) {
        var _convertRESTRequestTo = convertRESTRequestToHTTP(type, resource, params),
            url = _convertRESTRequestTo.url,
            options = _convertRESTRequestTo.options;

        return httpClient(url, options).then(function (response) {
            return convertHTTPResponseToREST(response, type, resource, params);
        });
    };
};

module.exports = exports['default'];