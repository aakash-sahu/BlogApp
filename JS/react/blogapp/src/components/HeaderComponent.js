import React, { Component } from 'react';
import { Navbar, NavbarBrand, NavItem, NavLink, Nav, NavbarToggler, Collapse,  } from 'reactstrap';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isNavOpen: false
        };
        this.toggleNav = this.toggleNav.bind(this);
    };

    toggleNav() {
        this.setState({
            isNavOpen: !this.state.isNavOpen
        });
    }

    render() {
        return (
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
                                <NavLink href="#"><span class="fa fa-sign-in"></span> Login</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="#"><span class="fa fa-circle"></span> Register</NavLink>
                            </NavItem>                        
                        </Nav>                    
                    </Collapse>
                </div>
            </Navbar>
        );
    }
};

export default Header;