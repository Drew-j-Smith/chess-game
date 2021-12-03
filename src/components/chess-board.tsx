import * as React from "react"
import "../styles/styles.css"

type ChessBoardProps = { };
type ChessBoardState = { };

class ChessBoard extends React.Component<ChessBoardProps, ChessBoardState> {
    constructor(props: ChessBoardProps) {
        super(props);
        this.state = {};
    }
    render() {
        return <div className="chess-board"> 
            {
                Array(64).fill(null).map((value: any, index: number) => {
                    let file = index % 8;
                    let rank = (index - file) / 8;
                    if (file % 2 === rank % 2) {
                        return <div className="chess-square dark-square"></div>
                    } else {
                        return <div className="chess-square light-square"></div>
                    }
                })
            }
        </div>
    }
}

export default ChessBoard;