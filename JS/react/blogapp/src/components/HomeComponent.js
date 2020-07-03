import React, { Component } from 'react';
import { Media, Card,CardBody, CardHeader,CardText, ListGroup, ListGroupItem, Alert, Pagination, PaginationItem, PaginationLink  } from 'reactstrap';
import { Link, NavLink } from 'react-router-dom';
// import { fetchPosts } from '../redux/ActionCreators';

class Home extends Component  {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state= {
            page:1,
        };
    };

    componentDidMount() {
        // console.log('dismiss alert function', this.props.alertState.visible);
        this._isMounted = true;
        if (this._isMounted){
            if (this.props.alertState.visible)
            setTimeout(this.props.dismissAlert, 2000);
        }
        const params = new URLSearchParams(this.props.location.search);
        const page = parseInt(params.get('page')) ||1;
        // console.log("Page query param: ", page, this.props.posts.currentPage, this.props.posts.totalPages);
        if ((page !== this.props.posts.currentPage)){  // check after putting pagination with Link --&& (this.props.posts.currentPage <= this.props.posts.totalPages) 
            this.props.fetchPosts(page);
        }
        // this.setState({paginationArray:[...Array(this.props.posts.totalPages).keys()].map(i => i +1)});
        // console.log(this.state.paginationArray);
        this.setState({page: page})
        
    };   

    componentWillUnmount() {
        this._isMounted = false;
      };

    render () {
        // console.log("Page state: ", this.state.page);
        const paginationArray = [...Array(this.props.posts.totalPages).keys()].map(i => i +1);
        const paginationDisplay = paginationArray.map(pagenum => {
            return (
                <PaginationItem disabled={this.state.page === pagenum?true: false} key={pagenum}>
                    <PaginationLink><Link to={`/home/?page=${pagenum}`} className={this.state.page === pagenum?"text-muted": ""}>{pagenum}</Link></PaginationLink>
                </PaginationItem>
            )
        });

        const posts = this.props.posts.posts.map((post) => {
            return (
                <article key={post._id} className="content-section">
                    <Media>
                        <Media left>
                            <img className="rounded-circle account-img" src={post.author.image} alt="Account" />
                        </Media>
                        <Media body>
                            <div className="article-metadata">
                                <Link to ="/home">{post.author.username}</Link>
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
                {this.props.alertState.visible ? 
                (<div className = "row">
                    <div className= "col-12 col-md-6 position-absolute alert-bar"> 
                        <Alert color={this.props.alertState.category} visible={this.props.alertState.visible.toString()} toggle={this.props.dismissAlert}>
                            {this.props.alertState.message }
                        </Alert >
                    </div>             
                </div>)
                :
                (<div></div>)}   
                <div className = "row">
                    <div className= "col-12 col-md-8"> 
                    <div>
                        {posts}
                    </div>
                        <Pagination aria-label="Post navigation">
                            <PaginationItem disabled={this.state.page === 1?true: false}>
                                <PaginationLink><NavLink to={`/home/?page=1`} className={this.state.page === 1?"text-muted": ""}><span aria-hidden="true">&laquo;</span></NavLink></PaginationLink>
                            </PaginationItem>
                            <PaginationItem disabled={this.state.page === 1?true: false}>
                                <PaginationLink ><Link to={`/home/?page=${this.state.page -1}`} className={this.state.page === 1?"text-muted": ""}><span aria-hidden="true">&lsaquo;</span></Link></PaginationLink>
                            </PaginationItem>
                            {paginationDisplay}
                            <PaginationItem disabled={this.state.page === this.props.posts.totalPages?true: false}>
                            <PaginationLink><Link to={`/home/?page=${this.state.page +1}`} className={this.state.page === this.props.posts.totalPages?"text-muted": ""}><span aria-hidden="true">&rsaquo;</span></Link></PaginationLink>
                            </PaginationItem>
                            <PaginationItem className={this.state.page === this.props.posts.totalPages?"disabled": ""}>
                                <PaginationLink><Link to={`/home/?page=${this.props.posts.totalPages}`} className={this.state.page === this.props.posts.totalPages?"text-muted": ""}><span aria-hidden="true">&raquo;</span></Link></PaginationLink>
                            </PaginationItem>
                        </Pagination>
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