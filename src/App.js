import './index.css';
import { ReactComponent as CaretIcon } from './icons/caret.svg';
import { ReactComponent as ChevronIcon } from './icons/chevron.svg';
import { ReactComponent as ArrowIcon } from './icons/arrow.svg';

import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

function App() {
  return (
      <NavItem icon={<CaretIcon />}>
        <DropdownMenu></DropdownMenu>
      </NavItem>
  );
}

function NavItem(props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="nav-item">
      <a href="#" className={`icon-button dropdown-button ${open?"open":"closed"}`} onClick={() => setOpen(!open)}>
        {props.icon}
      </a>

      {open && props.children}
    </div>
  );
}

function getIndex(menu){
  switch(menu){
    case "MAIN" : return 1;
    case "PLAYBACK SPEED" : return 2;
    case "CLOSED CAPTIONS" : return 2;
    case "FONT COLOR" : return 4;
    case "FONT STYLE" : return 4;
    case "BACKGROUND OPACITY" : return 4;
    case "BACKGROUND COLOR" : return 4;
    case "CC SETTINGS" : return 3;
    default : return 0;
  }
}

function DropdownMenu() {
  const [activeMenu, setActiveMenu] = useState('MAIN');
  const [menuHeight, setMenuHeight] = useState(null);
  const [activeIndex, setActiveIndex] = useState(1);
  const [prevIndex, setPrevIndex] = useState(1);

  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [fontColor, setFontColor] = useState("WHITE");
  const [fontsize, setFontStyle] = useState("HELVETICA");
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.75);
  const [backgroundColor, setbackgroundColor] = useState("BLACK");
  const [closedCaptions, setClosedCaptions] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    setMenuHeight(dropdownRef.current?.firstChild.offsetHeight)
  }, [])

  function calcHeight(el) {
    const height = el.offsetHeight;
    setMenuHeight(height);
  }

  function stateUpdate({event,data}){
    switch(event){
      case "PLAYBACK SPEED":
        setPlaybackSpeed(data);
        break;
      case "FONT COLOR":
        setFontColor(data);
        break;
      case "FONT STYLE":
        setFontStyle(data);
        break;
      case "BACKGROUND OPACITY":
        setBackgroundOpacity(data);
        break;
      case "BACKGROUND COLOR":
        setbackgroundColor(data);
        break;
      case "TOGGLE CC":
        setClosedCaptions(data);
        break;
    }
  }

  function DropdownItem(props) {
    return (
      <a href="#" className="menu-item" onClick={
        () => {
          if(props.goToMenu){
            setActiveMenu(props.goToMenu);
            setPrevIndex(activeIndex);
            setActiveIndex(getIndex(props.goToMenu));
          }
          if(props.event && props.data) stateUpdate({event:props.event,data:props.data})
        }}>
        {props.leftIcon && <span className="icon-button">{props.leftIcon}</span>}
        {props.children}
        {props.rightIcon && <span className="icon-right">{props.rightIcon}</span>}
      </a>
    );
  }

  return (
    <div className="dropdown" style={{ height: menuHeight }} ref={dropdownRef}>

      <CSSTransition
        in={activeMenu === 'MAIN'}
        timeout={500}
        classNames={`menu-s`}
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem
            rightIcon={<ChevronIcon />}
            goToMenu="PLAYBACK SPEED">
            PLAYBACK SPEED<span className={"toggleStatus"}>{`${playbackSpeed}x`}</span>
          </DropdownItem>
          <DropdownItem
            rightIcon={<ChevronIcon />}
            goToMenu="CLOSED CAPTIONS">
            CLOSED CAPTIONS<span className={"toggleStatus"}>{closedCaptions? "ON":"OFF"}</span>
          </DropdownItem>

        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'PLAYBACK SPEED'}
        timeout={500}
        classNames={`menu-e`}
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="MAIN" leftIcon={<ArrowIcon />}>
            <h4>PLAYBACK SPEED</h4>
          </DropdownItem>
          <DropdownItem event={'PLAYBACK SPEED'} data={0.75}>0.75x</DropdownItem>
          <DropdownItem event={'PLAYBACK SPEED'} data={1}>1x (Default)</DropdownItem>
          <DropdownItem event={'PLAYBACK SPEED'} data={1.5}>1.5x</DropdownItem>
          <DropdownItem event={'PLAYBACK SPEED'} data={2}>2x</DropdownItem>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'CLOSED CAPTIONS'}
        timeout={500}
        classNames={`menu-i${activeIndex>prevIndex?"slideLeft":"slideRight"}`}
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="MAIN" leftIcon={<ArrowIcon />}>
            <h4>CLOSED CAPTIONS</h4>
          </DropdownItem>
          <DropdownItem event={"TOGGLE CC"} data={false}>
            TURN OFF</DropdownItem>
          <DropdownItem event={"TOGGLE CC"} data={true}>
            ENGLISH</DropdownItem>
          <DropdownItem 
            rightIcon={<ChevronIcon />}
            goToMenu="CC SETTINGS">
            CC SETTINGS</DropdownItem>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'CC SETTINGS'}
        timeout={500}
        classNames={`menu-i${activeIndex>prevIndex?"slideLeft":"slideRight"}`}
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="CLOSED CAPTIONS" leftIcon={<ArrowIcon />}>
            <h4>CC SETTINGS</h4>
          </DropdownItem>
          <DropdownItem 
              rightIcon={<ChevronIcon />}
              goToMenu="FONT COLOR">
              FONT COLOR</DropdownItem>
          <DropdownItem 
              rightIcon={<ChevronIcon />}
              goToMenu="FONT STYLE">
              FONT SIZE</DropdownItem>
          <DropdownItem 
              rightIcon={<ChevronIcon />}
              goToMenu="BACKGROUND COLOR">
              BACKGROUND COLOR</DropdownItem>
          <DropdownItem 
              rightIcon={<ChevronIcon />}
              goToMenu="BACKGROUND OPACITY">
              BACKGROUND OPACITY</DropdownItem>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'FONT COLOR'}
        timeout={500}
        classNames={`menu-e`}
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="CC SETTINGS" leftIcon={<ArrowIcon />}>
            <h4>FONT COLORS</h4>
          </DropdownItem>
          <DropdownItem >RED</DropdownItem>
          <DropdownItem >BLUE</DropdownItem>
          <DropdownItem >GREEN</DropdownItem>
          <DropdownItem >YELLOW</DropdownItem>
          <DropdownItem >BLACK</DropdownItem>
          <DropdownItem >WHITE (Default)</DropdownItem>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'FONT STYLE'}
        timeout={500}
        classNames={`menu-e`}
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="CC SETTINGS" leftIcon={<ArrowIcon />}>
            <h4>FONT STYLES</h4>
          </DropdownItem>
          <DropdownItem >HELVETICA</DropdownItem>
          <DropdownItem >SANS-SERIF (Default)</DropdownItem>
          <DropdownItem >CURSIVE</DropdownItem>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'BACKGROUND COLOR'}
        timeout={500}
        classNames={`menu-e`}
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="CC SETTINGS" leftIcon={<ArrowIcon />}>
            <h4>BACKGROUND COLOR</h4>
          </DropdownItem>
          <DropdownItem >WHITE</DropdownItem>
          <DropdownItem >BLACK (Default)</DropdownItem>
          <DropdownItem >RED</DropdownItem>
          <DropdownItem >GREEN</DropdownItem>
          <DropdownItem >BLUE</DropdownItem>
          <DropdownItem >YELLOW</DropdownItem>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'BACKGROUND OPACITY'}
        timeout={500}
        classNames={`menu-e`}
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="CC SETTINGS" leftIcon={<ArrowIcon />}>
            <h4>BACKGROUND OPACITY</h4>
          </DropdownItem>
          <DropdownItem >0</DropdownItem>
          <DropdownItem >25</DropdownItem>
          <DropdownItem >50</DropdownItem>
          <DropdownItem >75 (Default)</DropdownItem>
          <DropdownItem >100</DropdownItem>
        </div>
      </CSSTransition>

    </div>
  );
}

export default App;
