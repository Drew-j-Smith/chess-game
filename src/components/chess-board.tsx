import * as React from "react"
import "../piecesets/cburnett/cburnett.css"
import Property from "csstype"

import ChessPiece from "./chess-piece"
import { Chess } from "../chess"

// typescipt doesn't understand i guess
// @ts-ignore
import moveAudioUrl from "../sounds/public_sound_standard_Move.mp3"
// @ts-ignore
import captureAudioUrl from "../sounds/public_sound_standard_Capture.mp3"

type ChessBoardProps = {
    squareSize: number; //in pixels
    darkSquareColor: Property.Property.BackgroundColor;
    lightSquareColor: Property.Property.BackgroundColor;
};
type ChessBoardState = {
    chess: Chess;
};

class ChessBoard extends React.Component<ChessBoardProps, ChessBoardState> {
    moveAudio: HTMLAudioElement | undefined = undefined;
    captureAudio: HTMLAudioElement | undefined = undefined;

    constructor(props: ChessBoardProps) {
        super(props);
        this.state = { chess: new Chess() };
        if (typeof Audio !== 'undefined') {
            this.moveAudio = new Audio(moveAudioUrl);
            this.captureAudio = new Audio(captureAudioUrl);
        }
    }

    style: React.CSSProperties = {
        display: "inline-grid",
        border: "1px solid black",
        gridTemplateRows: `repeat(8, ${this.props.squareSize}px)`,
        gridTemplateColumns: `repeat(8, ${this.props.squareSize}px)`,
        overflow: "visible",
        position: "relative"
    }


    render() {
        return <div style={this.style}>
            <script></script>
            {
                Array(64).fill(null).map((value: any, index: number) => {
                    let file = index % 8;
                    let rank = (index - file) / 8;
                    if (file % 2 === rank % 2) {
                        return <div key={index} style={{ backgroundColor: this.props.darkSquareColor }}></div>
                    } else {
                        return <div key={index} style={{ backgroundColor: this.props.lightSquareColor }}></div>
                    }
                })
            }
            {
                this.state.chess.board.map((row: string[], rank: number) =>
                    [...row.map((value: string, file: number) => {
                        if (value === "") return;
                        return <ChessPiece
                            key={rank * 8 + file}
                            x={this.props.squareSize * file}
                            y={this.props.squareSize * rank}
                            width={`${this.props.squareSize}px`}
                            height={`${this.props.squareSize}px`}
                            type={value}
                            dropCallback={(prevX: number, prevY: number, xDiff: number, yDiff: number) => {
                                let start = { file: prevX / this.props.squareSize, rank: prevY / this.props.squareSize };
                                let dst = { file: Math.round((prevX + xDiff) / this.props.squareSize), rank: Math.round((prevY + yDiff) / this.props.squareSize) };
                                let move = this.state.chess.valid(start, dst);
                                
                                if (move) {
                                    
                                    
                                    if (move.remove && move.remove(this.state.chess) || this.state.chess.board[dst.rank][dst.file] !== "") {
                                        if (this.captureAudio) {
                                            this.captureAudio.play();
                                        }
                                    } else {
                                        if (this.moveAudio){
                                            this.moveAudio.play();
                                        }
                                    }
                                    

                                    this.setState((prevState) => {
                                        let newState = new Chess(prevState.chess);
                                        // I don't know why ts thinks move can be undefinded
                                        // @ts-ignore
                                        newState.move(start, dst, move);
                                        return { chess: newState};
                                    })
                                    return true;
                                }
                                return false;
                                
                            }}
                        />
                    })]
                )
            }
        </div>
    }
}

export default ChessBoard;