import React, { Component } from 'react';
import { Media, Card,CardBody, CardHeader,CardText, ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { baseUrl } from '../shared/baseUrl';

class UserPosts extends Component  {
    constructor(props) {
        super(props);
        this.state= {
            userPosts:[],
        };
    };

    componentDidMount() {
        this.loadUserPosts(this.props.userId);
    };
    // componentDidUpdate() {
    //     this.loadUserPosts(this.props.userId);
    // };

    loadUserPosts = (userId) => {
        fetch(baseUrl + `users/${userId}`)
        .then(response => response.json())
        .then(response =>{
            console.log(response);
            this.setState({userPosts: response})
        })
        .catch(err => console.log(err))
        
    };
 
    render () {

        const posts = this.state.userPosts.map((post) => {
            return (
                <article key={post._id} className="content-section">
                    <Media>
                        <Media left>
                            <img className="rounded-circle account-img" src={post.author.image} alt="Account" />
                        </Media>
                        <Media body>
                            <div className="article-metadata">
                                {post.author.username}
                                <small className="text-muted ml-2">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day:'2-digit'}).format(new Date(Date.parse(post.datePosted)))}</small>
                            </div>
                            <h2><Link className="text-dark article-title" to={`/post/${post._id}`}>{post.title}</Link></h2>
                            <p className="article-content">{post.content}</p>
                        </Media>
                    </Media>
                </article>
            )
        }) 

        return (
            <main className="container"> 
                <div className = "row">
                    <div className= "col-12 col-md-8"> 
                    <div>
                        <h3 className="text-center">All posts by user: </h3>
                        {posts}
                    </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <Card>
                            <CardHeader className= "bg-info text-white" tag="h3">Sidebar</CardHeader>
                            <CardText className='text-muted ml-2'>Other information.</CardText>
                            <CardBody>
                                <ListGroup>
                                    <ListGroupItem className="list-group-item-light">Latest Posts</ListGroupItem>
                                    <ListGroupItem className="list-group-item-light">Announcements</ListGroupItem>
                                    <ListGroupItem className="list-group-item-light">Calendars</ListGroupItem>
                                    <ListGroupItem className="list-group-item-light">Favorites</ListGroupItem>
                                </ListGroup>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </main>
        );
        }
}

export default UserPosts;