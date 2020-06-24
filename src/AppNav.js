import React, { Component } from 'react';
import {Nav,Navbar,NavLink,NavItem,NavbarBrand} from 'reactstrap';
class AppNav extends Component {
    state = {  }
    render() { 
        return (
            <div>
              <Navbar style={{justifyContent:"right",anItligems: "right"}} color="dark" dark expand="md">
                <NavbarBrand href="/">Goal Setting Web Application</NavbarBrand>
                  <Nav navbar>
                      <NavItem>
                      <NavLink href="/">Home</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href="/categories">Categories</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href="/expenses">Expenses</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href="/goal">Goal</NavLink>
                    </NavItem>
                  </Nav>
              </Navbar>
            </div>
          );
    }
}
 
export default AppNav;