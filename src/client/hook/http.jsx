import React, {useState} from 'react';
import {isNil} from 'lodash';

/**
 * custom hook to fetch data
 * @param url -- request url
 * @returns {[boolean, fetchedData, makeRequest]}
 */
const useHttp = (url) => {
    const [isLoading, updateIsLoading] = useState(false);
    const [fetchedData, updateFetchedData] = useState(null);

    const makeRequest = (config = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    }, urlParams = null, urlOverride = null) => {
        let path = url;
        if (isNil(config)) {
            //clear the data
            updateIsLoading(false);
            updateFetchedData(null);
            return;
        }

        if (urlOverride) {
            path = urlOverride;
        }

        if (!path || path === '') {
            updateIsLoading(false);
            return;
        }

        if (urlParams && urlParams !== '') {
            path += '?' + urlParams;
        }

        updateIsLoading(true);

        fetch(path, config).then(response => {
            return response.json();
        }).then(data => {
            updateIsLoading(false);
            updateFetchedData(data);
        }).catch(err => {
            updateIsLoading(false);
            updateFetchedData(null);
        });
    };

    return [isLoading, fetchedData, makeRequest];
};

export default useHttp;
