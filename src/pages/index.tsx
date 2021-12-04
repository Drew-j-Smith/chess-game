import * as React from "react"
import ChessBoard from "../components/chess-board"

const IndexPage = () => {
  return (
    <main>
      <title>Chess Game</title>
      <ChessBoard squareSize={100} darkSquareColor="lightblue" lightSquareColor="white"/>
    </main>
  );
}

export default IndexPage;
