import React from 'react';

function Account(props) {
    return (
        <div className="container">
            <div className="row">
                <p>Account page for: {props.login.user}</p>

            </div>
        </div>
    );
};

export default Account;