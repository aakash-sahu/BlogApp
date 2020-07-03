import React, { Component } from 'react';
import { Button, FormGroup, Label, Input, Form, Media,Modal, ModalBody, ModalHeader, FormText   } from 'reactstrap';
// import { NavLink, Link } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';

const updateAccountSchema = Yup.object().shape({
    username: Yup.string().required("Name is required").min(2,"Name should be between 2-20 characters").max(20,"Name should be between 2-20 characters"),
    email: Yup.string().email("Email should be a valid email").required("Email is required")
});

class Account extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            isAccountUpdateModalOpen: false,
            modalMessage: ''
        };
        
    this.handleUpdateAccountSubmit = this.handleUpdateAccountSubmit.bind(this);
    this.toggleAccountUpdateModal = this.toggleAccountUpdateModal.bind(this);
    };

    toggleAccountUpdateModal = () => {
        this.setState({
            isAccountUpdateModalOpen: !this.state.isAccountUpdateModalOpen
        });
    };
    showAccountUpdateModal = (message) => {
        this.setState({
            modalMessage: message
        });
        this.toggleAccountUpdateModal()
    };


   handleUpdateAccountSubmit(values, actions) {
        console.log("Update user account: "+JSON.stringify({name: values.username, email: values.email, imageFile: values.file}));
        // following  modal got rendered useless as forgot about image upload
        // if (values.username === this.props.login.user.username && values.email === this.props.login.user.email) {
        //     this.showAccountUpdateModal("No changes in the account information!!")
        // }
        // else {
            //only working with FormData attribute
            var data = new FormData()
            data.append('imageFile', values.file);
            data.append('username',values.username);
            data.append('email',values.email);
            data.append('_id',this.props.login.user._id);
            this.props.updateUserAccount(data);
            // await this.props.updateUserAccount({username: values.username, email: values.email, _id: this.props.login.user._id, imageFile: values.file});
            // console.log("update account success for: ", this.props.login.user);
            // getting warning so removing this stuff -- cant-perform-a-react-state-update-on-an-unmounted-component
            // if (!this.props.login.accountUpdate){
            //     actions.setStatus(undefined);
            //     actions.setStatus({
            //         'username': this.props.login.errMess
            //     });
            //     this.showAccountUpdateModal("Errors!!");
            // }
        // }
    };
    
    render() {
        return (
            <React.Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-8 offset-md-2">
                        <h3 className="text-center">Account Info</h3>
                        <div className="content-section">
                            <Media>
                                <Media left>
                                    <img className="rounded-circle account-img" src={this.props.login.user.image} alt="Account" />
                                    {/* <Media object data-src={this.props.login.user.image} alt="Account picture" /> */}
                                </Media>
                                <Media body>
                                    <Media heading className="account-heading">
                                        {this.props.login.user.username}
                                    </Media>
                                    <p className="text-secondary">{this.props.login.user.email}</p>
                                </Media>
                            </Media>
                        </div>
                        <div className="row">
                            <div className="col-12 col-sm-8 offset-md-2">
                            <Formik
                                initialValues={{ username: this.props.login.user.username, email:this.props.login.user.email}}
                                onSubmit={this.handleUpdateAccountSubmit} 
                                validationSchema={updateAccountSchema}
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
                                        isSubmitting,
                                        setFieldValue
                                    } = props;
                                    return (
                                        <Form className="m-4" onSubmit={handleSubmit}>
                                            <legend>Update Account</legend><hr/>
                                            <FormGroup>
                                                <Label htmlFor="username">Username</Label>
                                                <Input type="text" id="username" name="username" placeholder="Username" 
                                                    value = {values.username} onChange={handleChange} onBlur={handleBlur} 
                                                    className={ 
                                                        errors.username && touched.username ? "is-invalid":""
                                                    } />
                                                {errors.username && touched.username && (<div className="invalid-feedback">{errors.username}</div>)}
                                            </FormGroup>
                                            <FormGroup>
                                                <Label htmlFor="email">Email</Label>
                                                <Input type="email" id="email" name="email" placeholder="Email" 
                                                    value = {values.email} onChange={handleChange} onBlur={handleBlur} 
                                                    className={ 
                                                        errors.email && touched.email ? "is-invalid":""
                                                    }/>
                                                {errors.email && touched.email && (<div className="invalid-feedback">{errors.email}</div>)}
                                            </FormGroup>
                                            <FormGroup className="ml-2">
                                                <Label for="file">Update profile photo</Label>
                                                <Input type="file" name="file" id="file" 
                                                    onChange = {(event) => {setFieldValue("file", event.currentTarget.files[0])} }/>
                                                <FormText color="muted">
                                                    Upload an image for your profile
                                                </FormText>
                                            </FormGroup>
                                            {/*revisit later - {status && status.username ? (<div><Alert color="danger">{status.username}</Alert></div>) : <div></div>} */}
                                                <Button type="submit" value="submit" outline color="primary" disabled={isSubmitting}>Update</Button>
                                        </Form>
                                    )} 
                                }
                            </Formik>
                            </div>
                        </div>                 
                    </div>
                </div>
            </div>
            <Modal isOpen={this.state.isAccountUpdateModalOpen} toggle={this.toggleAccountUpdateModal}>
                    <ModalHeader className="border-bottom" toggle={this.toggleAccountUpdateModal}>Account Update Status</ModalHeader>
                    <ModalBody>
                        <p>{this.state.modalMessage}</p>
                        <div className="text-center">
                            <Button color="primary" onClick={this.toggleAccountUpdateModal} >Close</Button>
                        </div>
                    </ModalBody>
                </Modal>
            </React.Fragment>
        );
    }
};


export default Account;