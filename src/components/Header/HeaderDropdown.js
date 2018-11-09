import React, {Component} from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown
} from 'reactstrap';

class HeaderDropdown extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  dropAccnt() {
    return (
      <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle} className='dd-itereg'>
        <DropdownToggle nav>
            Hi, <span className="mr-3 h6 d-inline-block mt-2">{((this.props.userDetails || {}).preferred_username || '')}</span>
          <span className="fa fa-caret-down"></span>
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem header tag="div" className="hide-up-md text-center">Hi, <strong>{((this.props.userDetails || {}).preferred_username || '')}</strong></DropdownItem>
          {/*<DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>*/}
          {/*<DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>*/}
          <DropdownItem onClick={this.props.kc.logout}><i className="fa fa-lock"></i> Logout</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  render() {
    return (
      this.dropAccnt()
    );
  }
}

export default HeaderDropdown;
