import React from "react";
import "./App.css";

const ROWS = 6;
const COLUMNS = 7;
const VICTORY_LENGTH = 4;

type Row = (string | null)[];
type Board = Row[];

function App() {
  return (
    <body>
      <div className="App">
        <Game />
      </div>
    </body>
  );
}

class Game extends React.Component<{}, { board: Board; xIsNext: boolean }> {
  constructor(props: any) {
    super(props);

    this.state = {
      board: Array(ROWS).fill(Array(COLUMNS).fill("Empty")),
      xIsNext: true,
    };
  }

  /**
   * Returns the string containing victor name, null if no victor yet.
   */
  calculateVictor(board: Board): string | null {
    // TODO: Implement diagonal victory check
    // Implement victory condition check for if a single row is victorious
    const rowConditionChecker = (row: Row, winner: string): boolean => {
      // Creates a substring to search for victory (e.g. XXXX)
      const victoryString = Array(VICTORY_LENGTH).fill(winner).join();
      // Checks if this substring exissts in this row.
      return row.join().includes(victoryString);
    };

    const arrayConditionChecker = (board: Board, winner: string): boolean => {
      return board.filter((row) => rowConditionChecker(row, winner)).length > 0;
    };

    const transposedBoard = Array(COLUMNS)
      .fill(null)
      .map((_, index) => this.getColumn(index));

    const xWins =
      arrayConditionChecker(board, "X") ||
      arrayConditionChecker(transposedBoard, "X");
    const oWins =
      arrayConditionChecker(board, "O") ||
      arrayConditionChecker(transposedBoard, "O");

    if (xWins) {
      return "X";
    }

    if (oWins) {
      return "O";
    }

    return null;
  }

  /*
   * Sets state when a user adds a coin to a column.
   */
  handleClick(column: number): void {
    this.setState({
      board: this.depositCoin(column, this.state.xIsNext ? "X" : "O"),
      xIsNext: !this.state.xIsNext,
    });
  }

  /**
   * Helper method.
   */
  depositCoin(column_index: number, new_val: string): Board {
    const board = this.state.board.slice();

    const row_index = this.getRowIndexToDeposit(column_index);
    if (row_index < 0) {
      alert("Coin overflow!");
      return board;
    }
    const row = board[row_index].slice();
    row[column_index] = new_val;
    board[row_index] = row;
    return board;
  }

  /**
   * Returns the column as an array
   */
  getColumn(column_index: number): Row {
    return this.state.board.slice().map((row) => row[column_index]);
  }

  /**
   * Returns the row index that has yet to have a coin deposited.
   */
  getRowIndexToDeposit(column_index: number): number {
    const board = this.state.board.slice();
    const board_column = board.map((row) => row[column_index]);
    const row_index = board_column.findIndex((row_item) => {
      // TypeScript catches that sometimes findIndex will pass in a null
      // which we handle.
      if (row_item === null) {
        return false;
      }
      const matches = row_item.match(/^(X|O)$/);
      return matches !== null && matches.length > 0;
    });

    // If no coins are found, deposit coin at the bottom.
    if (row_index === -1) {
      return this.state.board.length - 1;
    }

    return row_index - 1;
  }

  render() {
    let status = "Player " + (this.state.xIsNext ? "X" : "O") + " goes next.";
    const victor = this.calculateVictor(this.state.board);
    if (victor !== null) {
      status = "Player " + victor + " has won.";
    }
    return (
      <div>
        <p>{status}</p>
        <table>
          <thead>
            <tr>
              {Array(COLUMNS)
                .fill(null)
                .map((i, index) => (
                  <th>
                    <Button
                      column={index}
                      key={index}
                      onClick={() => this.handleClick(index)}
                    />
                  </th>
                ))}
            </tr>
            {this.state.board.map((row_num, index) => (
              <tr key={index}>
                {this.state.board[index].map((i, column_index) => (
                  <td key={column_index}>
                    {this.state.board[index][column_index]}
                  </td>
                ))}
              </tr>
            ))}
          </thead>
        </table>
      </div>
    );
  }
}

function Button(props: { onClick: () => void; column: number }) {
  return (
    <button type="button" onClick={() => props.onClick()}>
      {"Row" + props.column}
    </button>
  );
}

export default App;
