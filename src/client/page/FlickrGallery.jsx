import React, {useEffect, useState} from "react";
import Button from '../componnet/Button.jsx';
import useHttp from "../hook/http.jsx";
import {cloneDeep, find, get, isNil, map, assign, each} from 'lodash';

//photo size object to store info
const PHOTO_SIZE_MAP = {
    "Square": {display: 'Square (75 x 75)'},
    "Large Square": {display: 'Large Square'},
    "Thumbnail": {display: 'Thumbnail'},
    "Small": {display: 'Small'},
    "Medium": {display: 'Medium'},
    "Original": {display: 'Original'}
};

//flickr request parameters
const PHOTO_REQUEST_PARAMS = {
    PER_PAGE: 10,
    PAGE: 1
};

const FlickrGallery = () => {
    const [fetched, updateFetchState] = useState(false);
    const [photoSize, updatePhotoSize] = useState(null);
    const [photoList, updatePhotoList] = useState([]);
    const [currIndex, updateCurrIndex] = useState(0);
    const [isPhotoListLoading, photosRequestResponse, fetchPhotos] = useHttp('/flikr/fetchPhotos');
    const [isSinglePhotoLoading, singlePhotoRequestResponse, fetchPhotoInfo] = useHttp('/flikr/fetchSinglePhoto');

    /**
     * photo info from flickr.photos.getSizes, the strategy there is render available photo as soon as possible
     * so user don't need to wait util the whole process done
     */
    useEffect(() => {
        if (singlePhotoRequestResponse && singlePhotoRequestResponse.stat === 'ok') {
            //find target image with right size
            let targetPhoto = find(get(singlePhotoRequestResponse, 'sizes.size', []), {label: photoSize});
            if (!isNil(targetPhoto)) {
                let updatedPhotoList = cloneDeep(photoList);

                //update photo object by index
                updatedPhotoList[currIndex] = assign({}, updatedPhotoList[currIndex],
                    {source: targetPhoto.source, url: targetPhoto.url, loading: false});
                updatePhotoList(updatedPhotoList);
                let updatedIndex = currIndex + 1;
                updateCurrIndex(updatedIndex);
            }
        } else if (singlePhotoRequestResponse && singlePhotoRequestResponse.stat === 'fail') {
            //TODO: error handling for single photo request
        }
    }, [singlePhotoRequestResponse]);

    /**
     * photo list response from flickr.photos.getRecent endpoint
     */
    useEffect(() => {
        if (photosRequestResponse && photosRequestResponse.stat === 'ok') {
            let photoList = get(photosRequestResponse, 'photos.photo', []);

            //update fetch state in order to disabled 'fetch recent photo' button
            updateFetchState(true);

            //for each photo, get photo size object by calling flickr.photos.getSizes endpoint
            each(photoList, (photo) => {
                let requestConfig = {method: 'GET', headers: {'Content-Type': 'application/json'}};
                fetchPhotoInfo(requestConfig, `photo_id=${photo.id}`);
            });
        } else if (singlePhotoRequestResponse && singlePhotoRequestResponse.stat === 'fail') {
            //update photo list to empty
            updatePhotoList([]);
            //show error message from backend
            alert('Fail to fetch photos' + photosRequestResponse.message);
        }
    }, [photosRequestResponse]);

    /**
     * update user selected image size
     * @param sizeOption -- size of the image (object)
     */
    const onSelectPhotoSize = (sizeOption) => {
        updatePhotoSize(sizeOption);
    };

    /**
     * fetch photos from flickr
     * @param perPage -- the number of images per page for api request
     */
    const onFetchPhotosData = (perPage) => {
        updatePhotoList(new Array(10).fill({loading: true}));
        let requestConfig = {method: 'GET', headers: {'Content-Type': 'application/json'}};
        fetchPhotos(requestConfig, `per_page=${perPage}`);
    };

    /**
     * Clean up all photo data and states
     */
    const onResetData = () => {
        updateCurrIndex(0);
        updateFetchState(false);
        updatePhotoList([]);
        updatePhotoSize(null);
    };

    /**
     * render photo size buttons (which type of image user want)
     * @returns {*}
     */
    const renderPhotoSizeOptions = () => (
        <div className={'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'}>
            {map(PHOTO_SIZE_MAP, (sizeInfo, sizeKey) => (
                <Button
                    text={sizeInfo.display}
                    onClick={onSelectPhotoSize.bind(this, sizeKey)}
                    classes={'button-blue'}
                    disabled={!isNil(photoSize)}
                    key={sizeKey}
                />
            ))}
        </div>
    );

    /**
     * loader to indicate the loading process
     * @param key -- loader key
     * @returns {*}
     */
    const getLoader = (key) => (
        <div className="loader-container" key={key}>
            <div className="loader sm"/>
        </div>
    );

    /**
     * render function for photo list
     * @returns {*}
     */
    const renderPhotos = () => (
        <div className={'grid'}>
            {photoList.map((photo, index) => {
                return (photo.loading ? getLoader(`loader-${index}`) :
                        <a href={photo.url} target="_blank" key={photo.source}>
                            <img src={photo.source}
                                 alt={photo.title}
                                 key={photo.source}
                                 className={'py-1 rounded-b'}
                            />
                        </a>
                )
            })}
        </div>
    );

    /**
     * render function for action buttons
     * @returns {*}
     */
    const renderActions = () => {
        return (
            <div>
                <Button
                    text={'Fetch Recent Photos'}
                    onClick={onFetchPhotosData.bind(this, PHOTO_REQUEST_PARAMS.PER_PAGE, true)}
                    classes={'button-green'}
                    disabled={isNil(photoSize) || fetched || isPhotoListLoading}
                    key={'fetch-data'}
                />
                <Button
                    text={'Reset'}
                    onClick={onResetData}
                    classes={'button-gray button-50'}
                    key={'reset-data'}
                />
            </div>
        )
    };

    return (
        <div id='flickr-gallery' className='px-4 sm:px-6 md:px-16 lg:px-20 xl:px-40'>
            <h1>Select size of photos (in pixels) you want them to be displayed</h1>
            {renderPhotoSizeOptions()}
            <h3>Hit the "Fetch Recent Photos" to get random photos from flickr, or hit "Reset" to clean the size option and photo data.</h3>
            <p>Up to ten photos will be displayed. Clicking on a photo will take you to the Flickr page containing the
                photo.</p>
            {renderActions()}
            <hr/>
            {renderPhotos()}
        </div>
    );
};

export default FlickrGallery;
