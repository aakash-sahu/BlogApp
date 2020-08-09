import React from 'react';

function About(props)  {
    return (
        <div className="container">
            <div className="row">
                <div className="col-12 col-md-8 offset-md-2">
                    <h3>Architecture of the app</h3>
                    <img style={{width:"100%", margin:"2em 0 0 0", border: "1px solid grey", padding:"5px"}} src="/Architecture.jpg" />
                </div>
            </div>

        </div>
    );
}

export default About;