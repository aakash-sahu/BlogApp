import React, { Component } from 'react';
import { Media, Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Redirect ,Link } from 'react-router-dom';


class PostDetails extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            redirectHome: false
        };
        
    this.setRedirectHome = this.setRedirectHome.bind(this);
    // this.toggleAccountUpdateModal = this.toggleAccountUpdateModal.bind(this);

    };

    setRedirectHome = () => {
        this.setState({
            redirectHome: true
        })
    };

    // toggleAccountUpdateModal = () => {
    //     this.setState({
    //         isAccountUpdateModalOpen: !this.state.isAccountUpdateModalOpen
    //     });
    // };

    handlePostSubmit(values, actions) {
        console.log("Create Post: "+JSON.stringify(values));
        this.props.submitPost(values);
        this.setRedirectHome();
    };
    
    render() {
        // to redirect the process is doing it through state change
        if (this.state.redirectHome) {
            this.props.showAlert("success", "Post added!!");
            return <Redirect to='/home' />;
        };
        return (
            <React.Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-9 offset-md-1">
                        <div className="content-section">
                        <article className="content-section">
                            <Media>
                                <Media left>
                                    <img className="rounded-circle account-img" src={this.props.post.author.image} alt="Account" />
                                </Media>
                                <Media body>
                                    <div className="article-metadata">
                                        <a className="mr-2" href="#">{this.props.post.author.username}</a>
                                        <small className="text-muted">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day:'2-digit'}).format(new Date(Date.parse(this.props.post.datePosted)))}</small>
                                    </div>
                                    <div>
                                        {this.props.post.author.username === this.props.user.username ?
                                        <div>
                                        <Link to="/home"><Button color="secondary" size="sm" className="mr-1 mb-1">Update</Button></Link>
                                        <Button color="danger" size="sm"  className="mr-1 mb-1">Delete</Button>
                                        </div>
                                        :
                                        <div></div>
                                        }
                                    </div>
                                    <h2 className="text-dark article-title">{this.props.post.title}</h2>
                                    <p className="article-content">{this.props.post.content}</p>
                                </Media>
                            </Media>
                        </article>
                        </div>               
                    </div>
                </div>
            </div>
            {/* <Modal isOpen={this.state.isAccountUpdateModalOpen} toggle={this.toggleAccountUpdateModal}>
                    <ModalHeader className="border-bottom" toggle={this.toggleAccountUpdateModal}>Account Update Status</ModalHeader>
                    <ModalBody>
                        <p>{this.state.modalMessage}</p>
                        <div className="text-center">
                            <Button color="primary" onClick={this.toggleAccountUpdateModal} >Close</Button>
                        </div>
                    </ModalBody>
                </Modal> */}
            </React.Fragment>
        );
    }
};


export default PostDetails;