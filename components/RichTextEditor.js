import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { decode, encode } from "html-entities";
import {
	faBold,
	faItalic,
	faUnderline,
	faListUl,
	faListOl,
	faQuoteLeft,
	faAlignLeft,
	faAlignRight,
	faAlignCenter,
	faHeading,
	faFont,
	faPaintBrush,
	faTint,
} from "@fortawesome/free-solid-svg-icons";

import {
	Button,
	UncontrolledPopover,
	PopoverHeader,
	PopoverBody,
} from "reactstrap";

import ReactHtmlParser from "react-html-parser";
import styles from "./styles/rich-text.module.css";

export function encodePost(post) {
	return encode(escape(post));
}
export function decodePost(post) {
	return unescape(decode(post));
}

export default class Editor extends Component {
	constructor(props) {
		super(props);
		this.execute = this.execute.bind(this);
		this.insertHTML = this.insertHTML.bind(this);
		this.setHTML = this.setHTML.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}
	onSubmit() {
		if (this.props.onSubmit != undefined) {
			this.props.onSubmit(this.getValue());
		}
	}
	reset() {
		this.InputRef.innerHTML = "";
		this.ImageInput.reset();
	}

	getValue() {
		return encodePost(this.InputRef.innerHTML);
	}
	getImages() {
		return this.ImageInput.getFiles();
	}
	addGif(src) {
		this.insertHTML(`<img class='gif' src='${src}' alt='gif'/>`);
	}
	insertHTML(html) {
		this.InputRef.innerHTML += html;
	}
	execute(cmd, value) {
		document.execCommand(cmd, false, value);
	}
	setHTML(html) {
		this.InputRef.innerHTML = html;
	}
	componentDidMount() {
		const { defaultHTML } = this.props;
		if (defaultHTML != undefined) {
			this.setHTML(decodePost(defaultHTML));
		}
	}
	componentDidUpdate(prevProps) {
		if(prevProps.defaultHTML != this.props.defaultHTML) {
			const { defaultHTML } = this.props;
			if (defaultHTML != undefined) {
				this.setHTML(decodePost(defaultHTML));
			}
		}

	}
	render() {
		return (
			<div className={styles.editorWrapper}>
				<div
					ref={(ref) => (this.EditorWrap = ref)}
					className={styles.editorMain}
				>
					<div className={styles.toolBar}>
						<EditorButton
							icon={faFont}
							data="formatBlock"
							value="div"
						/>
						<EditorButton name="H1" data="formatBlock" value="h1" />
						<EditorButton name="H2" data="formatBlock" value="h2" />
						<EditorButton name="H3" data="formatBlock" value="h3" />
						<EditorButton name="H4" data="formatBlock" value="h4" />
						<EditorButton
							icon={faQuoteLeft}
							data="formatBlock"
							value="blockquote"
						/>
						<ColorPicker />
                        <BackgroundColorPicker/>

						<EditorButton icon={faBold} data="bold" />
						<EditorButton icon={faItalic} data="italic" />
						<EditorButton icon={faUnderline} data="underline" />

						<EditorButton
							icon={faListUl}
							data="insertUnorderedList"
						/>
						<EditorButton
							icon={faListOl}
							data="insertOrderedList"
						/>

						<EditorButton icon={faAlignLeft} data="justifyLeft" />
						<EditorButton
							icon={faAlignCenter}
							data="justifyCenter"
						/>
						<EditorButton icon={faAlignRight} data="justifyRight" />
					</div>

					<div
						className={styles.editor + " form-control"}
						ref={(ref) => (this.InputRef = ref)}
						contentEditable={true}
					/>
				</div>
			</div>
		);
	}
}
export class DisplayContent extends Component {
	render() {
		const { content } = this.props;
		return (
			<div className={styles.DisplayContent}>
				{ReactHtmlParser(decodePost(content))}
			</div>
		);
	}
}

class EditorButton extends Component {
	constructor(props) {
		super(props);
		this.execute = this.execute.bind(this);
	}

	execute() {
		const { data, value } = this.props;
		document.execCommand(data, false, value);
	}

	render() {
		const { icon, name } = this.props;
		return (
			<button
				onClick={this.execute}
				className={"btn btn-sm btn-secondary " + styles.button}
			>
				{icon && <FontAwesomeIcon icon={icon} />}
				{name && name}
			</button>
		);
	}
}

class ColorButton extends Component {
	constructor(props) {
		super(props);
		this.execute = this.execute.bind(this);
	}

	execute() {
		const { data, value,onClick } = this.props;
		document.execCommand(data, false, value);
        if(onClick){
            onClick()
        }
	}

	render() {
		const { value } = this.props;
		return (
			<button
				onClick={this.execute}
				className={"btn btn-sm " + styles.colorBtn}
				style={{ backgroundColor: `#${value}` }}
			></button>
		);
	}
}


function ColorPicker() {
	const [isOpen, setIsOpen] = React.useState(false);

    const wrapperRef = React.useRef(null);
    function blur(){
        setIsOpen(false);
    }
    React.useEffect(() => {
        document.addEventListener('mousedown',  handleClickOutside);
        return ()=> document.removeEventListener('mousedown', handleClickOutside);
    })
    function handleClickOutside(event) {
        if (wrapperRef && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
           blur()
        }
    }
	return (
		<div ref={wrapperRef}>
			<button
				id="UncontrolledPopover"
				onClick={() => setIsOpen(!isOpen)}
				className={"btn btn-sm btn-secondary " + styles.button}
			>
				<FontAwesomeIcon icon={faPaintBrush} />
			</button>

			<UncontrolledPopover
				placement="bottom"
				target="UncontrolledPopover"
                isOpen={isOpen}
                
                
			>
				<PopoverHeader>Chọn màu chữ</PopoverHeader>
				<PopoverBody>
                    <ColorButton data="foreColor" value="000000" onClick={blur}/>
					<ColorButton data="foreColor" value="666666" onClick={blur}/>
					<ColorButton data="foreColor" value="0000cc" onClick={blur}/>
					<ColorButton data="foreColor" value="ff3300" onClick={blur}/>
                    <ColorButton data="foreColor" value="cc9900" onClick={blur}/>
                    <ColorButton data="foreColor" value="669900" onClick={blur}/>
                    <ColorButton data="foreColor" value="ffffff" onClick={blur}/>
                    <ColorButton data="foreColor" value="ffff99" onClick={blur}/>
                    <ColorButton data="foreColor" value="99ff99" onClick={blur}/>
                    <ColorButton data="foreColor" value="66ffff" onClick={blur}/>
                    <ColorButton data="foreColor" value="cc99ff" onClick={blur}/>
                    <ColorButton data="foreColor" value="ff6699" onClick={blur}/>
				</PopoverBody>
			</UncontrolledPopover>
		</div>
	);
}

function BackgroundColorPicker() {
	const [isOpen, setIsOpen] = React.useState(false);
    const wrapperRef = React.useRef(null);
    function blur(){
        setIsOpen(false);
    }
    React.useEffect(() => {
        document.addEventListener('mousedown',  handleClickOutside);
        return ()=> document.removeEventListener('mousedown', handleClickOutside);
    })
    function handleClickOutside(event) {
        if (wrapperRef && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
           blur()
        }
    }
	return (
		<div ref={wrapperRef}>
			<button
				id="backgroundcolorpicker"
				onClick={() => setIsOpen(!isOpen)}
				className={"btn btn-sm btn-secondary " + styles.button}
			>
				<FontAwesomeIcon icon={faTint} />
			</button>

			<UncontrolledPopover
				placement="bottom"
				target="backgroundcolorpicker"
                isOpen={isOpen}
                
                
			>
				<PopoverHeader>Chọn màu nền</PopoverHeader>
				<PopoverBody>
                    <ColorButton data="hilitecolor" value="000000" onClick={blur}/>
					<ColorButton data="hilitecolor" value="666666" onClick={blur}/>
					<ColorButton data="hilitecolor" value="0000cc" onClick={blur}/>
					<ColorButton data="hilitecolor" value="ff3300" onClick={blur}/>
                    <ColorButton data="hilitecolor" value="cc9900" onClick={blur}/>
                    <ColorButton data="hilitecolor" value="669900" onClick={blur}/>
                    <ColorButton data="hilitecolor" value="ffffff" onClick={blur}/>
                    <ColorButton data="hilitecolor" value="ffff99" onClick={blur}/>
                    <ColorButton data="hilitecolor" value="99ff99" onClick={blur}/>
                    <ColorButton data="hilitecolor" value="66ffff" onClick={blur}/>
                    <ColorButton data="hilitecolor" value="cc99ff" onClick={blur}/>
                    <ColorButton data="hilitecolor" value="ff6699" onClick={blur}/>
				</PopoverBody>
			</UncontrolledPopover>
		</div>
	);
}