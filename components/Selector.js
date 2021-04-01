import { Component } from 'react'
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

export default class Select extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            selectedChild:null,
        };
        this.setValue = this.setValue.bind(this);
        this.optionId = uuidv4();
        this.getSelectedChild = this.getSelectedChild.bind(this);
    }
    setValue(index) {
        this.setState({ value: index });
        if (this.props.onChange) this.props.onChange(index)
    }
    componentDidMount() {
        const { defaultValue } = this.props;
        if (defaultValue) { this.setValue(defaultValue) };
        this.getSelectedChild();
    }
    componentDidUpdate(prevProps,prevState){
        if(prevState.value != this.state.value){
            this.getSelectedChild();
        }
    }
    getSelectedChild(){
        const{options,} = this.props;
        const{value} = this.state;

        for (let i in options) {
            var option = options[i];
            if (option.value == value) {
                var child = document.getElementById("option"+this.optionId + option.value);
                this.setState({selectedChild:child});
            }
        }
    }
    render() {
        var { options, defaultValue ,textColor,backColor,activeTextColor} = this.props;
        const { value , selectedChild } = this.state;
        
        var parent = document.getElementById(this.optionId);
        var child = selectedChild;
        
       
        var x = 0;
        var width = 0;
        var height = 0;
        var y = 0;
        if (parent && child) {
            const boundParent = parent.getBoundingClientRect();
            const boundChild = child.getBoundingClientRect();
            x = boundChild.x - boundParent.x;
            y = boundChild.y - boundParent.y;
            width = boundChild.width;
            height = boundChild.height;
        }

        activeTextColor = activeTextColor || "#000";
        textColor = textColor || "#555";
        backColor = backColor || "#00a2ff";

        return (
            <div id={this.optionId} className='select-options' ref={this.Wrapper} style={styles.wrapper}>
                <motion.div
                    initial={{ left: x, top: y, width: width, height: height }}
                    animate={{ left: x, top: y, width: width, height: height }}
                    transition={{
                        type: "spring",
                        mass: 1,
                        damping: 15
                    }}
                    style={{... styles.background ,backgroundColor:backColor}}
                    className="background" />
                <div 
                style={styles.options}
                className="options">
                    {
                        options.map((item, key) => (
                            <motion.button
                                style={{... styles.option ,color:textColor}}
                                animate={item.value == value ? {color:activeTextColor} : {color:textColor}}
                                key={key}
                                id={"option"+this.optionId + item.value}
                                onClick={() => this.setValue(item.value)}
                                className={ "option"}>
                                {item.title}
                            </motion.button>
                        ))
                    }
                </div>

            </div>
        )
    }
}

const styles = {
    wrapper: {
        position: "relative",
        margin:5
    },
    background: {
        backgroundColor:"blue",
        position: "absolute",
        zIndex: 3,
        borderRadius:"3px",
    },
    options:{
        display: "flex",
        flexWrap: "wrap",
        zIndex:3,
        padding:0,

    },
    option:{
        userSelect:"none",
        cursor: "pointer",
        padding:"7px 10px",
        zIndex:4,
        backgroundColor:"transparent",
        outline: "none",
        border:0,

    }
};
