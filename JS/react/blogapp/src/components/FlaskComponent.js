import React, { Component } from 'react';
// import { Media, Button, Modal, ModalBody, ModalHeader} from 'reactstrap';
// import { Redirect ,Link } from 'react-router-dom';
import { baseUrl2 } from '../shared/baseUrl';



class FlaskTest extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            message: null
        };
    };



    componentDidMount() {
        // console.log("Postid in component mount: ", this.props.postId);
        this.loadContent();
    };

    loadContent = () => {
        fetch(baseUrl2 + 'test')
        .then(response => response.json())
        .then(response =>{
            console.log(response);
            this.setState({message:response.message})
        })
        .catch(err => console.log(err))
        
    };
    
    render() {
        // console.log("Post date details: ",this.state.post.datePosted);

        return (
            <div>
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-9 offset-md-1">
                        <h2>{this.state.message}</h2>
                    </div>
                </div>
            </div>
            </div>
        );
    }
};


export default FlaskTest;