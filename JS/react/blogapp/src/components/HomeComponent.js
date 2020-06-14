import React, { Component } from 'react';
import { Media, Card,CardBody, CardHeader,CardText, ListGroup, ListGroupItem } from 'reactstrap';

function Home(props)  {

    const posts = props.posts.map((post) => {
        return (
            <article key={post._id} className="content-section">
                <Media>
                    <Media body>
                        <div className="article-metadata">
                            <a className="mr-2" href="#">{post.author}</a>
                            <small className="text-muted">{post.datePosted}</small>
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

export default Home;