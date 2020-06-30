import React, { Component } from 'react';
import { Media, Button, Modal, ModalBody, ModalHeader} from 'reactstrap';
import { Redirect ,Link } from 'react-router-dom';


class PostDetails extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            isDeleteModalOpen: false,
            redirectHome: false
        };
        
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
    this.setRedirectHome = this.setRedirectHome.bind(this);
    };
    setRedirectHome = () => {
        this.setState({
            redirectHome: true
        })
    };

    toggleDeleteModal = () => {
        this.setState({
            isDeleteModalOpen: !this.state.isDeleteModalOpen
        });
    };
    
    render() {
        // to redirect the process is doing it through state change
        if (this.state.redirectHome) {
            this.props.showAlert("success", "Post deleted!!");
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
                                        <a className="mr-2" href="/home">{this.props.post.author.username}</a>
                                        <small className="text-muted">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day:'2-digit'}).format(new Date(Date.parse(this.props.post.datePosted)))}</small>
                                    </div>
                                    <div>
                                        {this.props.post.author.username === this.props.user.username ?
                                        <div>
                                        <Link to={`/post/${this.props.post._id}/update`}><Button color="secondary" size="sm" className="mr-1 mb-1">Update</Button></Link>
                                        <Button color="danger" size="sm" className="mr-1 mb-1" onClick={this.toggleDeleteModal}>Delete</Button>
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
            <Modal isOpen={this.state.isDeleteModalOpen} toggle={this.toggleDeleteModal}>
                    <ModalHeader className="border-bottom" toggle={this.toggleDeleteModal}>Confirm Delete</ModalHeader>
                    <ModalBody>
                        <div className="text-right">
                            <Button color="primary" onClick={this.toggleDeleteModal} >Cancel</Button>{'  '}
                            <Button color="danger" onClick={() => {this.props.submitDeletePost(this.props.post._id); this.setRedirectHome()}}>Delete</Button> 
                            {/* onClick={this.props.submitDeletePost(this.props.post._id)} */}
                        </div>
                    </ModalBody>
                </Modal>
            </React.Fragment>
        );
    }
};


export default PostDetails;