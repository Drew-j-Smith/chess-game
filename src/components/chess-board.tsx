import * as React from "react"
import "../piecesets/cburnett/cburnett.css"
import Property from "csstype"

import ChessPiece from "./chess-piece"
import { Chess } from "../chess"

type ChessBoardProps = {
    squareSize: string;
    darkSquareColor: Property.Property.BackgroundColor;
    lightSquareColor: Property.Property.BackgroundColor;
};
type ChessBoardState = {
    chess: Chess;
};

class ChessBoard extends React.Component<ChessBoardProps, ChessBoardState> {
    constructor(props: ChessBoardProps) {
        super(props);
        this.state = { chess: new Chess() };
    }

    style: React.CSSProperties = {
        display: "inline-grid",
        border: "1px solid black",
        gridTemplateRows: `repeat(8, ${this.props.squareSize})`,
        gridTemplateColumns: `repeat(8, ${this.props.squareSize})`,
        overflow: "visible",
        position: "relative"
    }


    render() {
        return <div style={this.style}>
            {
                Array(64).fill(null).map((value: any, index: number) => {
                    let file = index % 8;
                    let rank = (index - file) / 8;
                    if (file % 2 === rank % 2) {
                        return <div key={index} style={{backgroundColor: this.props.darkSquareColor}}></div>
                    } else {
                        return <div key={index} style={{backgroundColor: this.props.lightSquareColor}}></div>
                    }
                })
            }
            {
                this.state.chess.board.map((row: string[], rank: number) =>
                    [...row.map((value: string, file: number)=>{
                        if (value === "") return;
                        return <ChessPiece 
                        x={100*file}
                        y={100*rank}
                        width="100px"
                        height="100px"
                        type={value}
                        dropCallback={(prevX: number, prevY: number, xDiff: number, yDiff: number) => { 
                            console.log(prevX / 100, prevY / 100, Math.round((prevX + xDiff) / 100), Math.round((prevY + yDiff) / 100)); 
                        }} 
                    />
                    })]
                )
            }
        </div>
    }
}

export default ChessBoard;