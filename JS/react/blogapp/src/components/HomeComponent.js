import React, { Component } from 'react';
import { Media, Card,CardBody, CardHeader,CardText, ListGroup, ListGroupItem, Alert  } from 'reactstrap';

class Home extends Component  {
    // constructor(props) {
    //     super(props);
    // };

    componentDidMount() {
        // console.log('dismiss alert function', this.props.alertState.visible);
        if (this.props.alertState.visible)
            setTimeout(this.props.dismissAlert, 5000);
    };    

    render () {
    const posts = this.props.posts.map((post) => {
        return (
            <article key={post._id} className="content-section">
                <Media>
                    <Media body>
                        <div className="article-metadata">
                            <a className="mr-2" href="#">{post.author.username}</a>
                            <small className="text-muted">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day:'2-digit'}).format(new Date(Date.parse(post.datePosted)))}</small>
                        </div>
                        <h2><a className="text-dark article-title" href="#">{post.title}</a></h2>
                        <p className="article-content">{post.content}</p>
                    </Media>
                </Media>
            </article>
        )
    }) 

    return (
        <main className="container">
            {this.props.alertState.visible ? (<div className = "row">
                <div className= "col-12"> 
                    <Alert  color={this.props.alertState.category} visible={this.props.alertState.visible.toString()} toggle={this.props.dismissAlert}>
                        {this.props.alertState.message }
                    </Alert >
                </div>             
            </div>)
            :
            (<div></div>)}   
            <div className = "row">
                <div className= "col-12 col-md-8"> 
                    {posts}
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

export default Home;