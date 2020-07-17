import React, { Fragment } from 'react';

export const Loading = () => {
    return(
        <div className="col-12">
            <span className="fa fa-spinner fa-pulse fa-3x fa-fw text-primary"></span>
            <p>Loading . . .</p>
        </div>
    );
};

export const TickerLoading = ({msg}) => {
    return(
        <Fragment className= "ml-5">
            <span className="fa fa-spinner fa-pulse fa-fw text-primary"></span>
            <small className="text-muted">{msg}</small>
        </Fragment>
    );
};