import React, { Component } from 'react';
import { Media, Button, Modal, ModalBody, ModalHeader} from 'reactstrap';
import { Redirect ,Link } from 'react-router-dom';
import { baseUrl } from '../shared/baseUrl';

class PostDetails extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            isDeleteModalOpen: false,
            redirectHome: false,
            post:{author:{}} //initialized this way otherwise getting undefined error on accessing nested author object
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

    componentDidMount() {
        console.log("Postid in component mount: ", this.props.postId);
        this.loadPost(this.props.postId);
    };

    // componentDidUpdate() {
    //     console.log("Postid in component update: ", this.props.postId);
    //     this.loadPost(this.props.postId);
    // };

    loadPost = (postId) => {
        fetch(baseUrl + `posts/${postId}`)
        .then(response => response.json())
        .then(response =>{
            this.setState({post:response})
        })
        .catch(err => console.log(err))
        
    };
    
    render() {
        console.log("Post date details: ",this.state.post.datePosted);
        // to redirect the process is doing it through state change
        if (this.state.redirectHome) {
            // this.props.showAlert("success", "Post deleted!!");
            return <Redirect to='/home' />;
        };

        return (
            <div>
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-9 offset-md-1">
                        <div className="content-section">
                        <article className="content-section">
                            <Media>
                                <Media left>
                                    <img className="rounded-circle account-img" src={this.state.post.author.image} alt="Account" />
                                </Media>
                                <Media body>
                                    <div className="article-metadata">
                                        <Link to ={`/user/${this.state.post.author._id}`}>{this.state.post.author.username}</Link>
                                        {/* <a className="mr-2" href="/home">{this.state.post.author.username}</a> */}
                                        <small className="text-muted ml-2">{this.state.post.datePosted}</small>
                                        {/* <small className="text-muted ml-2">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day:'2-digit'}).format(new Date(Date.parse(this.state.post.datePosted)))}</small> */}
                                    </div>
                                    <div>
                                        {(this.props.user) && (this.state.post.author.username === this.props.user.username) ?
                                        <div>
                                        <Link to={`/post/${this.state.post._id}/update`}><Button color="secondary" size="sm" className="mr-1 mb-1">Update</Button></Link>
                                        <Button color="danger" size="sm" className="mr-1 mb-1" onClick={this.toggleDeleteModal}>Delete</Button>
                                        </div>
                                        :
                                        <div></div>
                                        }
                                    </div>
                                    <h2 className="text-dark article-title">{this.state.post.title}</h2>
                                    <p className="article-content">{this.state.post.content}</p>
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
                            <Button color="danger" onClick={() => {this.props.submitDeletePost(this.state.post._id); this.setRedirectHome()}}>Delete</Button> 
                            {/* onClick={this.props.submitDeletePost(this.state.post._id)} */}
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
};


export default PostDetails;