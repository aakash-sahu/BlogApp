import React, { Component } from 'react';
import { Navbar, NavbarBrand, NavItem, NavLink, Nav, NavbarToggler, Collapse, Button, Modal, ModalBody, ModalHeader,
        FormGroup, Label, Input, Form  } from 'reactstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';

const RegisterValidateSchema = Yup.object().shape({
    username: Yup.string().required("Name is required").min(2,"Name should be between 2-20 characters").max(20,"Name should be between 2-20 characters"),
    email: Yup.string().email("Email should be a valid email").required("Email is required"),
    password: Yup.string().required("Password is required").min(2, "Password should be atleast 2 characters"),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], "Passwords should match").required("Required").min(2),
});

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isNavOpen: false,
            isRegisterModalOpen: false
        };
        this.toggleNav = this.toggleNav.bind(this);
        this.toggleRegsiterModal = this.toggleRegsiterModal.bind(this);
        this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
    };

    toggleNav() {
        this.setState({
            isNavOpen: !this.state.isNavOpen
        });
    }
    toggleRegsiterModal() {
        this.setState({
            isRegisterModalOpen: !this.state.isRegisterModalOpen
        })
    }
    handleRegisterSubmit(values, actions, event) {
        console.log("Current state: "+JSON.stringify(values));
        alert("Current state: "+JSON.stringify(values));
        // event.preventDefault();
        this.toggleRegsiterModal();
        //add togglemodal later and also look for a flash message
    }

    render() {
        return (
            <React.Fragment>
                <Navbar dark expand="md" className="fixed-top">
                    <div className="container">
                        <NavbarToggler onClick={this.toggleNav} />
                        <NavbarBrand className="mr-4" href="/home">Blog Space</NavbarBrand>
                        <Collapse isOpen={this.state.isNavOpen} navbar>
                            <Nav navbar>
                                <NavItem>
                                    <NavLink href="/home">Home</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href="/about">About</NavLink>
                                </NavItem>                        
                            </Nav>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <Button outline size="sm" color="light" className="mr-2"><span className="fa fa-sign-in"></span> Login</Button>
                                </NavItem>
                                <NavItem>
                                    <Button outline size="sm" color="light" onClick={this.toggleRegsiterModal}
                                        ><span className="fa fa-circle"></span> Register
                                    </Button>
                                </NavItem>                        
                            </Nav>                    
                        </Collapse>
                    </div>
                </Navbar>
                <Modal isOpen={this.state.isRegisterModalOpen} toggle={this.toggleRegsiterModal} className="modal-lg">
                    <ModalHeader className="border-bottom" toggle={this.toggleRegsiterModal}>Register</ModalHeader>
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
                                    isSubmitting
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
                                            <Button type="button" outline color="primary" onClick={handleReset} disabled={isSubmitting}>Reset</Button> {'   '}
                                            <Button type="submit" value="submit" outline color="primary" disabled={isSubmitting}>Register</Button>
                                    </Form>
                                )
                            }
                            
                            }
                            
                        </Formik>
                    </ModalBody>
                </Modal>
            </React.Fragment>
        );
    }
};

export default Header;