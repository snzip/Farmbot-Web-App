import * as React from "react";
import { t } from "i18next";
import { NavBarProps, NavBarState } from "./interfaces";
import { EStopButton } from "../devices/components/e_stop_btn";
import { Session } from "../session";
import { Row, Col } from "../ui";
import { history } from "../history";
import { updatePageInfo, isMobile } from "../util";
import { SyncButton } from "./sync_button";
import { NavLinks } from "./nav_links";
import { TickerList } from "./ticker_list";
import { AdditionalMenu } from "./additional_menu";
import { MobileMenu } from "./mobile_menu";
import {
  Popover,
  Position,
  PopoverInteractionKind
} from "@blueprintjs/core/dist";

export class NavBar extends React.Component<NavBarProps, Partial<NavBarState>> {

  state: NavBarState = {
    mobileMenuOpen: false,
    tickerListOpen: false,
    accountMenuOpen: false
  };

  logout = () => Session.clear();

  toggle = (name: keyof NavBarState) => () =>
    this.setState({ [name]: !this.state[name] });

  close = (name: keyof NavBarState) => () =>
    this.setState({ [name]: false });

  render() {
    const hasName = this.props.user && this.props.user.body.name;

    const firstName = hasName && !isMobile() ?
      `${hasName.split(" ")[0]} ▾` : `${t("Menu")} ▾`;

    const menuIconClassNames: string[] = [
      "fa", "fa-bars", "mobile-menu-icon"
    ];

    /** The way our app is laid out, we'll pretty much always want this bit. */
    const pageName = history.getCurrentLocation().pathname.split("/")[2] || "";

    /** Change document meta title on every route change. */
    updatePageInfo(pageName);

    const { toggle, close } = this;
    const { mobileMenuOpen, tickerListOpen, accountMenuOpen } = this.state;
    const { logs } = this.props;

    return (
      <div className="nav-wrapper">
        <nav role="navigation">
          <Row>
            <Col xs={12}>
              <div>
                <TickerList { ...{ logs, tickerListOpen, toggle } } />
                <div className="nav-group">
                  <div className="nav-left">
                    <i
                      className={menuIconClassNames.join(" ")}
                      onClick={this.toggle("mobileMenuOpen")} />
                    <span className="mobile-menu-container">
                      {MobileMenu({ close, mobileMenuOpen })}
                    </span>
                    <span className="top-menu-container">
                      {NavLinks({ close })}
                    </span>
                  </div>
                  <div className="nav-right">
                    <Popover
                      inline
                      interactionKind={PopoverInteractionKind.HOVER}
                      target={
                        <div className="nav-name"
                          onClick={this.toggle("accountMenuOpen")}>
                          {firstName}
                        </div>}
                      position={Position.BOTTOM_RIGHT}
                      content={AdditionalMenu({ logout: this.logout, close })}
                      isOpen={accountMenuOpen}
                      onClose={this.close("accountMenuOpen")} />
                    <EStopButton
                      bot={this.props.bot}
                      user={this.props.user} />
                    <SyncButton
                      bot={this.props.bot}
                      user={this.props.user}
                      dispatch={this.props.dispatch} />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </nav>
      </div>
    );
  }
}
