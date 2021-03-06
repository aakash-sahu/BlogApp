import React, { Component } from 'react';
import { Navbar, NavbarBrand, NavItem, Nav, NavbarToggler, Collapse, Button, Modal, ModalBody, ModalHeader,
        FormGroup, Label, Input, Form, Alert, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem  } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';

const RegisterValidateSchema = Yup.object().shape({
    username: Yup.string().required("Name is required").min(2,"Name should be between 2-20 characters").max(20,"Name should be between 2-20 characters"),
    email: Yup.string().email("Email should be a valid email").required("Email is required"),
    password: Yup.string().required("Password is required").min(2, "Password should be atleast 2 characters"),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], "Passwords should match").required("Required").min(2),
});

const LoginValidateSchema = Yup.object().shape({
    username: Yup.string().required("Name is required").min(2,"Name should be between 2-20 characters").max(20,"Name should be between 2-20 characters"),
    // email: Yup.string().email("Email should be a valid email").required("Email is required"),
    password: Yup.string().required("Password is required").min(2, "Password should be atleast 2 characters"),
});

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isNavOpen: false,
            isRegisterModalOpen: false,
            isLoginModalOpen: false,
        };
        this.toggleNav = this.toggleNav.bind(this);
        this.toggleRegisterModal = this.toggleRegisterModal.bind(this);
        this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
        this.toggleLoginModal = this.toggleLoginModal.bind(this);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
        this.toggleLoginToRegister = this.toggleLoginToRegister.bind(this);
        this.toggleRegisterToLogin = this.toggleRegisterToLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    };

    toggleNav() {
        this.setState({
            isNavOpen: !this.state.isNavOpen
        });
    }

    toggleRegisterModal() {
        this.setState({
            isRegisterModalOpen: !this.state.isRegisterModalOpen
        });
    };
    
    toggleLoginModal() {
        this.setState({
            isLoginModalOpen: !this.state.isLoginModalOpen
        });
    };

   async handleRegisterSubmit(values, actions) {
        console.log("Register user state: "+JSON.stringify(values));
        // alert("Register user: "+JSON.stringify(values));
        // event.preventDefault();
        
        await this.props.registerUser({username: values.username, email: values.email, password: values.password });
        console.log("register success", this.props.registration.registerSuccess);
        if (!this.props.registration.registerSuccess){
            actions.setStatus(undefined);
            actions.setStatus({
                'username': this.props.registration.errMess
            });
        }
        else {
            this.toggleRegisterModal();
            this.props.showAlert("success", "You are successfully registered!! You can log in now!");
        }
        // console.log(this.props.registration.registerSuccess);
        // console.log(this.props.login.errMess);
        //add togglemodal later and also look for a flash message
    };
    
    //Handle submit - //doesn't handle all erros. for e.g. when server is down.
    async handleLoginSubmit(values, actions) {
        console.log("Login user state: "+JSON.stringify(values));
        // alert("Login user: "+JSON.stringify(values));
        // event.preventDefault();
        await this.props.loginUser({username: values.username, password: values.password });
        console.log("is Auth: ", this.props.login.isAuthenticated);
        if (!this.props.login.isAuthenticated) {
            // console.log(this.props.login.isAuthenticated);
            // console.log(this.props.login.errMess.err);
            actions.setStatus(undefined);
            actions.setStatus({
                'username': this.props.login.errMess.err    //change in both handles to use other than username
            });
            // console.log(status)
        }
        else {
            this.toggleLoginModal();
            this.props.showAlert("success", "You are logged in!!");
        }
        //add togglemodal later and also look for a flash message
    };

    toggleLoginToRegister() {
        this.toggleLoginModal();
        this.toggleRegisterModal();
    }

    toggleRegisterToLogin() {
        this.toggleRegisterModal();
        this.toggleLoginModal();
    }

    async handleLogout() {
       await this.props.logoutUser();
        this.props.showAlert("success", "You are successfully logged out!!");
    }

    render() {
        return (
            <React.Fragment>
                <Navbar dark expand="sm" className="fixed-top">
                    <div className="container">
                        <NavbarToggler onClick={this.toggleNav} />
                        <NavbarBrand href="/home" className="mr-4">Blog Space</NavbarBrand>
                        <Collapse isOpen={this.state.isNavOpen} navbar>
                            <Nav navbar>
                                <NavItem>
                                    <NavLink className="nav-link" to="/home">Home</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to="/about">About</NavLink>
                                </NavItem>
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle nav caret>
                                        Models
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem>
                                            <NavLink to="/models" className="text-primary nav-link">Stock Charts &amp; Prediction</NavLink>
                                        </DropdownItem>
                                        <DropdownItem>
                                            <NavLink to="/char-model" className="text-primary nav-link">Text Generator</NavLink>
                                        </DropdownItem>
                                        <DropdownItem>
                                            <NavLink to="/digit-recog" className="text-primary nav-link">Digit Recognition</NavLink>
                                        </DropdownItem>
                                        <DropdownItem>
                                            <NavLink to="/keyphrase-extract" className="text-primary nav-link">Keyphrase Extraction with BERT</NavLink>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>                                    
                            </Nav>
                            <Nav className="ml-auto" navbar>
                                {this.props.login.isAuthenticated ?
                                <React.Fragment> 
                                    <NavItem className="mr-2 mt-auto">
                                    <NavLink className="nav-link" to="/account">{this.props.login.user.username}</NavLink>
                                    </NavItem>
                                    <NavItem className="mr-2 mt-auto">
                                    <NavLink className="nav-link" to="/post"><span className="fa fa-file-text-o"></span>New Post</NavLink>
                                    </NavItem>
                                    <NavItem className="mr-2 mt-auto">
                                        <NavLink className="nav-link" to="/account"><span className="fa fa-user-circle-o"></span>Account</NavLink>
                                    </NavItem>
                                    <NavItem className="ml-5 mt-1">
                                        <Button outline size="sm" color="light" onClick={this.handleLogout}  >
                                            <span className="fa fa-sign-out"></span> Logout
                                        </Button>
                                    </NavItem>
                                </React.Fragment>
                                    :
                                    <React.Fragment> 
                                        <NavItem className="mr-2 mt-1">
                                            <Button outline size="sm" color="light" onClick={this.toggleLoginModal} className="" >
                                                <span className="fa fa-sign-in"></span> Login
                                            </Button>
                                        </NavItem>
                                        <NavItem className="mr-2 mt-1">
                                            <Button outline size="sm" color="light" onClick={this.toggleRegisterModal} className="">
                                                <span className="fa fa-circle"></span> Register
                                            </Button>
                                        </NavItem> 
                                    </React.Fragment>
                                }                       
                            </Nav>                    
                        </Collapse>
                    </div>
                </Navbar>
                {/* Register form */}
                <Modal isOpen={this.state.isRegisterModalOpen} toggle={this.toggleRegisterModal} className="modal-lg">
                    <ModalHeader className="border-bottom" toggle={this.toggleRegisterModal}>Register</ModalHeader>
                    <ModalBody>
                        <Formik
                            initialValues={{ username: "", email:"", password:"", confirmPassword:""}}
                            onSubmit={this.handleRegisterSubmit} 
                            validationSchema={RegisterValidateSchema} >
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
                                    isSubmitting,
                                    status
                                } = props;
                                return (
                                    <Form className="m-4" onSubmit={handleSubmit}>
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
                                        <FormGroup>
                                            <Label htmlFor="password">Password</Label>
                                            <Input type="password" id="password" name="password" placeholder="Password" 
                                                value = {values.password} onChange={handleChange} onBlur={handleBlur} 
                                                className={ 
                                                       errors.password && touched.password ? "is-invalid":""
                                                   }/>
                                            {errors.password && touched.password && (<div className="invalid-feedback">{errors.password}</div>)}
                                        </FormGroup>
                                        <FormGroup>
                                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                                            <Input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm password"
                                                value = {values.confirmPassword} onChange={handleChange} onBlur={handleBlur} 
                                                className={ 
                                                       errors.confirmPassword && touched.confirmPassword ? "is-invalid":""
                                                   } />
                                            {errors.confirmPassword && touched.confirmPassword && (<div className="invalid-feedback">{errors.confirmPassword}</div>)}
                                        </FormGroup>
                                        {status && status.username ? (<div><Alert color="danger">{status.username}</Alert></div>) : <div></div>}
                                            <Button type="button" outline color="secondary" onClick={handleReset} disabled={isSubmitting}>Reset</Button> {'   '}
                                            <Button type="submit" value="submit" outline color="primary" disabled={isSubmitting}>Register</Button>
                                    </Form>
                                )
                            } 
                            }
                        </Formik>
                        <div className="border-top pt-3 mb-3">
                            <small className="text-muted">Already have an account?
                                <button type="button" onClick={this.toggleRegisterToLogin} className="ml-2 btn btn-link">Sign In here</button>
                            </small>
                        </div>
                    </ModalBody>
                </Modal>
                {/* Register form ends */}
                {/* Login form */}
                <Modal isOpen={this.state.isLoginModalOpen} toggle={this.toggleLoginModal}>
                    <ModalHeader className="border-bottom" toggle={this.toggleLoginModal}>Login</ModalHeader>
                    <ModalBody>
                        <Formik
                        //Change to username now to test
                            initialValues={{  username:"", password:""}}
                            onSubmit={this.handleLoginSubmit} 
                            validationSchema={LoginValidateSchema} >
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
                                    isSubmitting,
                                    status
                                } = props;
                                return (
                                    <Form className="m-2" onSubmit={handleSubmit}>
                                        <FormGroup>
                                            <Label htmlFor="username">Username</Label>
                                            <Input type="text" id="username" name="username" placeholder="Username" 
                                                value = {values.username} onChange={handleChange} onBlur={handleBlur} 
                                                className={ 
                                                       errors.username && touched.username ? "is-invalid":""
                                                   }/>
                                            {errors.username && touched.username && (<div className="invalid-feedback">{errors.username}</div>)}
                                        </FormGroup>
                                        <FormGroup>
                                            <Label htmlFor="password">Password</Label>
                                            <Input type="password" id="password" name="password" placeholder="Password" 
                                                value = {values.password} onChange={handleChange} onBlur={handleBlur} 
                                                className={ 
                                                       errors.password && touched.password ? "is-invalid":""
                                                   }/>
                                            {errors.password && touched.password && (<div className="invalid-feedback">{errors.password}</div>)}
                                        </FormGroup>
                                        {status && status.username ? (<div><Alert color="danger">{status.username}</Alert></div>) : <div></div>}
                                            <Button type="button" outline color="secondary" onClick={handleReset} disabled={isSubmitting} className="mr-1">Reset</Button>
                                            <Button type="submit" value="submit" outline color="primary" disabled={isSubmitting}>Login</Button>
                                    </Form>
                                )
                            } 
                            }
                        </Formik>
                        <div className="border-top pt-3 mb-3">
                            <small className="text-muted">Don't have an account?  
                                <button onClick={this.toggleLoginToRegister} className="btn btn-link">Register Here</button>
                            </small>
                        </div>
                    </ModalBody>
                </Modal>
                {/* Login form ends */}
            </React.Fragment>
        );
    }
};

export default Header;