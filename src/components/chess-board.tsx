import * as React from "react"
import "../piecesets/cburnett/cburnett.css"
import Property from "csstype"

import ChessPiece from "./chess-piece"

type ChessBoardProps = {
    squareSize: string;
    darkSquareColor: Property.Property.BackgroundColor;
    lightSquareColor: Property.Property.BackgroundColor;
};
type ChessBoardState = {};

class ChessBoard extends React.Component<ChessBoardProps, ChessBoardState> {
    constructor(props: ChessBoardProps) {
        super(props);
        this.state = {};
    }

    style: React.CSSProperties = {
        display: "inline-grid",
        border: "1px solid black",
        gridTemplateRows: `repeat(8, ${this.props.squareSize})`,
        gridTemplateColumns: `repeat(8, ${this.props.squareSize})`,
        overflow: "visible",
        position: "relative"
    }

    squareStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }


    render() {
        return <div style={this.style}>
            {
                Array(64).fill(null).map((value: any, index: number) => {
                    let file = index % 8;
                    let rank = (index - file) / 8;
                    if (file % 2 === rank % 2) {
                        return <div key={index} style={{...this.squareStyle, backgroundColor: this.props.darkSquareColor}}></div>
                    } else {
                        return <div key={index} style={{...this.squareStyle, backgroundColor: this.props.lightSquareColor}}></div>
                    }
                })
            }
            <ChessPiece 
                x={100}
                y={100}
                width="100px"
                height="100px"
                type="r"
                dropCallback={(prevX: number, prevY: number, x: number, y: number) => { console.log(prevX + x, prevY + y); }} 
            />
        </div>
    }
}

export default ChessBoard;