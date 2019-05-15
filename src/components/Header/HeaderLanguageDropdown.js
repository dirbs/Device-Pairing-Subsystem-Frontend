import React, {Component} from 'react';
import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Dropdown
} from 'reactstrap';

class HeaderLanguageDropdown extends Component {

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
        let lang = 'English';
        if(this.props.i18n.language === 'en') {
            lang = 'English';
        } else if(this.props.i18n.language === 'es') {
            lang = 'Español';
        } else if(this.props.i18n.language === 'id') {
            lang = 'Bahasa Indonesia';
        }
        return (
            <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret>
                    {lang}
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem onClick={() => this.props.switchLanguage('en')}>
                        <i className="flag-icon flag-icon-us"></i> English</DropdownItem>
                    <DropdownItem onClick={() => this.props.switchLanguage('es')}>
                        <i className="flag-icon flag-icon-es"></i> Español</DropdownItem>
                    <DropdownItem onClick={() => this.props.switchLanguage('id')}>
                        <i className="flag-icon flag-icon-id"></i> Bahasa Indonesia</DropdownItem>
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

export default HeaderLanguageDropdown;
