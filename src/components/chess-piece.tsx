import React from "react";
import Draggable from "react-draggable";
import Property from "csstype"

type ChessPieceProps = {
    width: Property.Property.Width,
    height: Property.Property.Height,
    x: number,
    y: number,
    type: string,
    dropCallback: (prevX: number, prevY: number, x: number, y: number) => void;
};
type ChessPieceState = {
    dragging: boolean;
};

class ChessPiece extends React.Component<ChessPieceProps, ChessPieceState> {
    constructor(props: ChessPieceProps) {
        super(props);
        this.state = {
            dragging: false
        };
    }

    style: React.CSSProperties = {
        backgroundSize: "contain",
        position: "absolute",
        width: this.props.width,
        height: this.props.height,
        left: this.props.x,
        top: this.props.y
    }

    draggingStyle: React.CSSProperties = {
        ...this.style,
        backgroundColor: "cadetblue",
        opacity: "50%"
    }

    render() {
        return <div>
            <Draggable 
                onStart={()=> this.setState({dragging: true})}
                onStop={(e, data) => { 
                    this.setState({dragging: false});
                    this.props.dropCallback(this.props.x, this.props.y, data.lastX , data.lastY); 
                }}
                position={{x: 0, y: 0}}>
                <div className={this.props.type} style={{...this.style, zIndex: this.state.dragging ? 100 : 1}}></div>
            </Draggable>
            {
                this.state.dragging && <div className={this.props.type} style={this.draggingStyle}></div>
            }
        </div>
    }
}

export default ChessPiece;