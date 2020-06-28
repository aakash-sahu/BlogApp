import React, { Component } from 'react';
import { Button, FormGroup, Label, Input, Form, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';

const postSchema = Yup.object().shape({
    title: Yup.string().required("Title is required").min(4,"Title should be between 4-20 characters").max(50,"Title should be between 2-50 characters"),
    content: Yup.string().required("Content is required")
});

class PostDetails extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            redirectHome: false
        };
        
    this.handlePostSubmit = this.handlePostSubmit.bind(this);
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
        // this.props.history.push('/home/');
        this.setRedirectHome();
        // console.log('redirect to home now');
        // return <Redirect to='/home' />;
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
                    <div className="col-12 col-md-8 offset-md-2">
                        <div className="content-section">
                        <Formik
                                initialValues={{ title: '', content:''}}
                                onSubmit={this.handlePostSubmit} 
                                validationSchema={postSchema}
                                enableReinitialize={true} 
                                >
                                {(props) => {
                                    const {
                                        values,
                                        touched,
                                        errors,
                                        // dirty,
                                        handleChange,
                                        handleBlur,
                                        handleSubmit,
                                        handleReset,
                                        isSubmitting
                                    } = props;
                                    return (
                                        <Form className="m-4" onSubmit={handleSubmit}>
                                            <legend>Post Details</legend><hr/>
                                            <FormGroup>
                                                <Label htmlFor="title">Title</Label>
                                                <Input type="text" id="title" name="title" placeholder="Title" 
                                                    value = {values.title} onChange={handleChange} onBlur={handleBlur} 
                                                    className={ 
                                                        errors.title && touched.title ? "is-invalid":""
                                                    } />
                                                {errors.title && touched.title && (<div className="invalid-feedback">{errors.title}</div>)}
                                            </FormGroup>
                                            <FormGroup>
                                                <Label htmlFor="content">Content</Label>
                                                <Input type="textarea" id="content" name="content" placeholder="Content" rows="7"
                                                    value = {values.content} onChange={handleChange} onBlur={handleBlur} 
                                                    className={ 
                                                        errors.content && touched.content ? "is-invalid":""
                                                    }/>
                                                {errors.content && touched.content && (<div className="invalid-feedback">{errors.content}</div>)}
                                            </FormGroup>
                                            {/*revisit later - {status && status.title ? (<div><Alert color="danger">{status.title}</Alert></div>) : <div></div>} */}
                                            <div className="text-right">
                                                <Button type="submit" value="submit" outline color="primary" disabled={isSubmitting} className="">Create Post</Button>
                                            </div>
                                        </Form>
                                    )} 
                                }
                            </Formik>
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