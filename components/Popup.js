import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FiAlertTriangle } from "react-icons/fi";
import { AiFillNotification, AiFillCloseCircle } from "react-icons/ai";
import { GrCircleQuestion } from 'react-icons/gr';




const TOAST_CONTENT_ID = "PopupContainer_content";
const MODAL_CONTENT_ID = "PopupContainer_content_fullSize";

export function PopupContainer(props) {
    const position = props.position;

    return (
        <div id='PopupContainer'>
            <div id={TOAST_CONTENT_ID} className={position}>

            </div>
            <div id={MODAL_CONTENT_ID}>

            </div>
        </div>
    )
}


function makeWrapElement(name) {
    const id = uuidv4();
    var wrapdiv = document.createElement('div');
    wrapdiv.id = id;
    document.getElementById(name).appendChild(wrapdiv);
    return id;
}

export function showPopup(element, fullSize) {
    const id = fullSize ? makeWrapElement(MODAL_CONTENT_ID) : makeWrapElement(TOAST_CONTENT_ID);
    ReactDom.render(element, document.getElementById(id));
}



export class PopupWrapper extends Component {

    constructor(props) {
        super(props);
        this.destroy = this.destroy.bind(this);
        this.animateOut = this.animateOut.bind(this);
        this.state = {
            show: true,
            id: uuidv4(),
        };
        this.animateTime = 300;
        this.onClickOutSide = this.onClickOutSide.bind(this);
        this.contentRef = React.createRef();
    }
    onClickOutSide(e) {
        const { exitOnClickOutSide } = this.props;
        if (this.contentRef && this.contentRef.current && !this.contentRef.current.contains(e.target)) {
            if (exitOnClickOutSide && exitOnClickOutSide != undefined) {
                this.animateOut();
            }
        }

    }
    componentDidMount() {
        const destroy = () => {
            this.animateOut();
        }
        window.history.pushState(null, null, window.location.href);
        window.onpopstate = function (event) {
            window.history.go(1);
            destroy();
        };

        const { timeOut } = this.props;
        if (timeOut != undefined) {
            setTimeout(() => {
                if (this != null) {
                    this.animateOut();
                }
            }, timeOut);
        }
    }

    destroy() {
        const { id } = this.state;
        const parentId = document.getElementById(id).parentNode.id;

        try {
            ReactDom.unmountComponentAtNode(document.getElementById(parentId));
        } catch (error) {
            console.error(error);
        }

        setTimeout(() => {
            try { document.getElementById(parentId).remove(); }
            catch (error) { console.log(error); }
        }, 100);
    }
    animateOut() {
        const { show, id } = this.state;

        if (!show) return;
        this.setState({ show: false });
        setTimeout(() => {
            if (this != null)
                this.destroy();
        }, this.animateTime);
    }

    render() {
        const { children, message, timeOut, fullSize, exitOnClickOutSide, className } = this.props;

        const initialY = fullSize ? 0 : -300;
        const divClassName = fullSize ? 'fullSize' : '';
        const variants = {
            show: {
                opacity: 1, y: 0,
                transition: { type: 'tween', duration: this.animateTime / 1000 }
            },
            hide: {
                opacity: 0, y: initialY,
                transition: { type: 'tween', duration: this.animateTime / 1000 }
            },
        }

        const { show, id } = this.state;

        return (
            <motion.div
                id={id}
                onClick={this.onClickOutSide}
                className={divClassName}
                initial={show ? 'hide' : 'show'}
                animate={show ? 'show' : 'hide'}
                variants={variants}>
                <div
                    className={className}
                    ref={this.contentRef}
                    onClick={() => { return null }}>
                    {children}
                </div>


            </motion.div>
        )
    }
} /// END PopupWrapper

export function popupSlideShow(list, index) {
    const element = <SlideShowPopup list={list} index={index} />
    showPopup(element, true);
}
export class SlideShowPopup extends Component {
    constructor(props) {
        super(props);
        this.close = this.close.bind(this);
    }
    close() {
        if (this.PopupWrapper) {
            this.PopupWrapper.animateOut()
        }
    }
    render() {
        const { list, index } = this.props;
        return (
            <PopupWrapper
                className="slide_show_wrapper"
                exitOnClickOutSide={true}
                fullSize={true}
                ref={ref => this.PopupWrapper = ref}
            >
                <button className="close" onClick={this.close}><AiFillCloseCircle /></button>
                <SlideShow list={list} index={index} />
            </PopupWrapper>
        )
    }
}


var softConfirm = {};
softConfirm = (message, onYes, onNo, type, timeout) => {

    const element = <SoftConfirm
        message={message}
        onYes={onYes}
        onNo={onNo}
        type={type}
        timeout={timeout} />;
    showPopup(element, false);
}
softConfirm.basic = (message, onYes, onNo, timeout) => {
    softConfirm(message, onYes, onNo, 'basic', timeout);
}
softConfirm.danger = (message, onYes, onNo, timeout) => {
    softConfirm(message, onYes, onNo, 'danger', timeout);
}
softConfirm.success = (message, onYes, onNo, timeout) => {
    softConfirm(message, onYes, onNo, 'success', timeout);
}
softConfirm.warning = (message, onYes, onNo, timeout) => {
    softConfirm(message, onYes, onNo, 'warning', timeout);
}
export var softConfirm;

export class SoftConfirm extends Component {
    constructor(props) {
        super(props);

        this.BASIC = 'basic';
        this.DANGER = 'danger';
        this.SUCCESS = 'success';
        this.WARNING = 'warning';
        this.onYes = this.onYes.bind(this);
        this.onNo = this.onNo.bind(this);
        this.destroy = this.destroy.bind(this);
    }
    componentDidMount() {
        const { timeout } = this.props;
        if (timeout != undefined) {
            setTimeout(() => {
                if (this != null)
                    this.destroy();
            }, timeout);
        }
    }
    destroy() {
        if (this.PopupWrapper != null)
            this.PopupWrapper.animateOut();
    }
    onYes() {

        if (this.props.onYes != undefined) {
            this.props.onYes();
        }
        this.destroy();
    }
    onNo() {
        if (this.props.onNo != undefined) {
            this.props.onNo();
        }
        this.destroy();
    }
    render() {

        var { message, onYes, onNo, type, timeout } = this.props;
        type = type == undefined ? this.type.BASIC : type;
        return (
            <PopupWrapper
                fullSize={false}
                ref={ref => this.PopupWrapper = ref}
            >
                <div className="softConfirmWrapper">
                    <div id='type' className={type}>
                        <div className='row1'>
                            <div className='content'>
                                <p className="message">
                                    {message}
                                </p>
                            </div>
                            <div className='icon'>
                                {
                                    type == this.BASIC ?
                                        <GrCircleQuestion /> :
                                        type == this.DANGER || type == this.WARNING ?
                                            <FiAlertTriangle /> :
                                            type == this.SUCCESS &&
                                            <IoMdCheckmarkCircleOutline />

                                }

                            </div>
                        </div>
                        <div className='progressbarContainer'>
                            {
                                timeout != undefined &&
                                <motion.div
                                    className='progressbar'
                                    initial={{ width: '100%' }}
                                    animate={{ width: '0px' }}
                                    transition={{ type: 'tween', duration: timeout / 1000 }}
                                />

                            }

                        </div>
                        <div className='buttonGroup'>
                            <button onClick={this.onYes} className='primaryButton'>
                                Đồng ý
                        </button>
                            <button onClick={this.onNo} className='secondaryButton'>
                                Hủy
                        </button>
                        </div>
                    </div>

                </div>
            </PopupWrapper>
        )
    }
}

/// export confirm function
var confirm = (message, onYes, onNo, type) => {

    const element = <Confirm
        onYes={onYes}
        onNo={onNo}
        type={type}
        message={message}
    />

    showPopup(element, true);
};

confirm.basic = (message, onYes, onNo) => {
    confirm(message, onYes, onNo, 'basic');
}

confirm.warning = (message, onYes, onNo) => {
    confirm(message, onYes, onNo, 'warning');
}

confirm.danger = (message, onYes, onNo) => {
    confirm(message, onYes, onNo, 'danger');
}

export var confirm;

/// CONFIRM CLASS
export class Confirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
        };
        this.onYes = this.onYes.bind(this);
        this.onNo = this.onNo.bind(this);
        this.destroy = this.destroy.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }
    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);
    }
    handleKeyPress(e) {
        e.preventDefault();
        if (e.key === 'Enter') {
            this.onYes();
        } else if (e.key === "Escape") {
            this.destroy();
        }
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
    }
    destroy() {
        if (this.Wrapper != null)
            this.Wrapper.animateOut();
    }
    onYes() {
        if (this.props.onYes != undefined) {
            this.props.onYes();
        }
        this.destroy();
    }
    onNo() {
        if (this.props.onNo != undefined) {
            this.props.onNo();
        }
        this.destroy();
    }
    render() {
        var { message, onYes, onNo, type } = this.props;

        onYes = onYes == undefined ? () => { return (null) } : onYes;
        onNo = onNo == undefined ? () => { return (null) } : onNo;

        type = type == undefined ? 'basic' : type;

        return (
            <PopupWrapper
                className={type + ' confirmContainer'}
                fullSize={true}
                ref={ref => this.Wrapper = ref}>
                <div className='row1'>

                    <div className='content'>
                        <p className="message">
                            {message}
                        </p>
                    </div>
                    <div className='icon'>
                        {
                            type == 'confirm_basic' ?
                                <GrCircleQuestion /> :
                                <FiAlertTriangle />
                        }

                    </div>
                </div>
                <div className='buttonGroup'>
                    <button ref={ref => this.Button1 = ref} onClick={this.onYes} className="primaryButton">
                        Đồng ý
                    </button>
                    <button ref={ref => this.Button2 = ref} onClick={this.onNo} className='secondaryButton'>
                        Hủy
                    </button>
                </div>
            </PopupWrapper>
        )
    }
}

/// TOAST CLASS

export class Toast extends Component {
    render() {
        var { message, timeOut, type, progessBar } = this.props;


        timeOut = timeOut == undefined ? 3000 : timeOut;
        type = type == undefined ? 'basic' : type;
        return (
            <PopupWrapper
                fullSize={false}
                ref={ref => this.Wrapper = ref}
                timeOut={timeOut} >

                <div className={type + " toastContainer"}>
                    <div className='row1'>
                        <div className='icon'>
                            {
                                type == 'success' ?
                                    <IoMdCheckmarkCircleOutline /> :

                                    type == "danger" || type == 'warning' ?
                                        <FiAlertTriangle /> :
                                        <AiFillNotification />
                            }

                        </div>
                        <div className='content'>
                            <p className="message">
                                {message}
                            </p>

                        </div>
                    </div>

                    <motion.div
                        className={progessBar ? 'progressbar' : 'hide'}
                        initial={{ width: '100%' }}
                        animate={{ width: '0px' }}
                        transition={{ type: 'tween', duration: timeOut / 1000 }}>

                    </motion.div>
                </div>
            </PopupWrapper>
        )
    }
}


/// export toast function
var toast = (message, timeOut, type, progessBar) => {
    const element = <Toast
        progessBar={progessBar}
        type={type}
        timeOut={timeOut}
        message={message}
    />
    showPopup(element, false);

};

toast.basic = (message, timeOut, progessBar) => {
    toast(message, timeOut, 'basic', progessBar);
}
toast.warning = (message, timeOut, progessBar) => {
    toast(message, timeOut, 'warning', progessBar);
}

toast.success = (message, timeOut, progessBar) => {
    toast(message, timeOut, 'success', progessBar);
}
toast.danger = (message, timeOut, progessBar) => {
    toast(message, timeOut, 'danger', progessBar);
}
export var toast;


