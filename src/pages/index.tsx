import * as React from "react"
import ChessBoard from "../components/chess-board"

const IndexPage = () => {
  return (
    <main>
      <title>Chess Game</title>
      <ChessBoard squareSize="100px" darkSquareColor="lightblue" lightSquareColor="white"/>
    </main>
  );
}

export default IndexPage;
