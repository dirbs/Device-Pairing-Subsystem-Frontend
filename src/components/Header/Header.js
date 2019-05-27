import React, {Component} from 'react';
import {
  Nav,
  NavbarToggler,
  NavbarBrand
} from 'reactstrap';
import i18n from './../../i18n';
import HeaderDropdown from './HeaderDropdown';
import HeaderLanguageDropdown from './HeaderLanguageDropdown';

class Header extends Component {

  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  render() {
    return (
      <header className="app-header navbar">
        <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>
          <span className="navbar-toggler-icon"></span>
        </NavbarToggler>
        <NavbarBrand href="#">
            <h5 className="navbar-brand-minimized">DPS</h5>
            <h5 className="navbar-brand-full">{i18n.t('title')}</h5>
        </NavbarBrand>
        <NavbarToggler className="d-none" onClick={this.sidebarToggle}>
          <span className="navbar-toggler-icon"></span>
        </NavbarToggler>
        <Nav navbar>
          <HeaderDropdown {...this.props}/>
          <HeaderLanguageDropdown {...this.props} switchLanguage={this.props.switchLanguage} />
        </Nav>
      </header>
    );
  }
}

export default Header;
