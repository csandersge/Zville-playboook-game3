import React, { useState, useEffect } from 'react';

// Main App component
const App = () => {
  // State to hold the current play call
  const [playCall, setPlayCall] = useState('');
  
  // States to store the user's placement of X, Y, Z, and H players
  const [xPlayerPositionUser, setXPlayerPositionUser] = useState(null);
  const [yPlayerPositionUser, setYPlayerPositionUser] = useState(null);
  const [zPlayerPositionUser, setZPlayerPositionUser] = useState(null);
  // H player placement now uses a single cell to store the clicked position,
  // but the rendering logic is conditional based on the play call.
  const [hPlayerPositionUser, setHPlayerPositionUser] = useState(null);

  // States to store the CORRECT positions of X, Y, Z, and H players
  // For H player, this is an array of valid positions to handle "in-between" placements.
  const [correctXPosition, setCorrectXPosition] = useState(null);
  const [correctYPosition, setCorrectYPosition] = useState(null);
  const [correctZPosition, setCorrectZPosition] = useState(null);
  const [correctHPosition, setCorrectHPosition] = useState(null);
  
  // State to store feedback message
  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  // States to track if the user's placement for each player is correct
  const [isXPlayerCorrect, setIsXPlayerCorrect] = useState(null);
  const [isYPlayerCorrect, setIsYPlayerCorrect] = useState(null);
  const [isZPlayerCorrect, setIsZPlayerCorrect] = useState(null);
  const [isHPlayerCorrect, setIsHPlayerCorrect] = useState(null);

  // State to track which player the user is currently placing
  const [playerToPlace, setPlayerToPlace] = useState('Y');

  // Initial player positions for the offensive line and QB
  const [players, setPlayers] = useState([
    { name: 'LT', row: 1, col: 8 },
    { name: 'LG', row: 1, col: 9 },
    { name: 'C', row: 1, col: 10 },
    { name: 'RG', row: 1, col: 11 },
    { name: 'RT', row: 1, col: 12 },
    { name: 'QB', row: 4, col: 10 }
  ]);

  /**
   * Generates a new random play call and resets the game state.
   */
  const generatePlayCall = () => {
    // Arrays of possible values for the play call
    const firstNames = ["Right", "Rip", "Rock", "Left", "Liz", "Lex"];
    const secondValues = ["1", "2", "3", "4", "A", "B", "C", "D"];
    const thirdValuesDecades = [10, 20, 40, 50, 60, 70];

    let randomFirstName, randomSecondValue, randomThirdValue, tempPlayCall;

    // Use a do-while loop to generate a new call until it is not a forbidden combination.
    do {
      randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      randomSecondValue = secondValues[Math.floor(Math.random() * secondValues.length)];
      tempPlayCall = randomFirstName + ' ' + randomSecondValue;
    } while (
      tempPlayCall === "Rip C" ||
      tempPlayCall === "Liz C" ||
      tempPlayCall === "Rock D" ||
      tempPlayCall === "Lex D"
    );

    // Generate the third value from the specified decades
    const randomDecade = thirdValuesDecades[Math.floor(Math.random() * thirdValuesDecades.length)];
    const randomDigit = Math.floor(Math.random() * 10);
    randomThirdValue = randomDecade + randomDigit;

    // Final concatenated value with all three parts
    const finalPlayCall = `${tempPlayCall} ${randomThirdValue}`;

    // --- Logic to pre-calculate CORRECT positions for X, Y, Z, and H players based on the play call ---
    let newCorrectXPosition, newCorrectYPosition, newCorrectZPosition, newCorrectHPosition;
    
    // Y-Player Logic
    switch (randomFirstName) {
      case 'Right':
        newCorrectYPosition = { row: 1, col: 13 };
        break;
      case 'Rip':
        newCorrectYPosition = { row: 2, col: 13 };
        break;
      case 'Rock':
        newCorrectYPosition = { row: 2, col: 16 };
        break;
      case 'Left':
        newCorrectYPosition = { row: 1, col: 7 };
        break;
      case 'Liz':
        newCorrectYPosition = { row: 2, col: 7 };
        break;
      case 'Lex':
        newCorrectYPosition = { row: 2, col: 4 };
        break;
      default:
        newCorrectYPosition = null; // Should not happen with the current logic
        break;
    }

    // X and Z Player Logic
    switch (randomFirstName) {
      case 'Left':
        newCorrectXPosition = { row: 2, col: 1 };
        newCorrectZPosition = { row: 1, col: 19 }; 
        break;
      case 'Liz':
      case 'Lex':
        newCorrectXPosition = { row: 1, col: 1 };
        newCorrectZPosition = { row: 1, col: 19 };
        break;
      case 'Right':
        newCorrectXPosition = { row: 1, col: 1 };
        newCorrectZPosition = { row: 2, col: 19 };
        break;
      case 'Rip':
      case 'Rock':
        newCorrectXPosition = { row: 1, col: 1 };
        newCorrectZPosition = { row: 1, col: 19 };
        break;
      default:
        newCorrectXPosition = { row: 1, col: 1 };
        newCorrectZPosition = { row: 1, col: 19 };
        break;
    }

    // H-Player Logic (updated for "in-between" placements)
    const yIsOnRight = ['Right', 'Rip', 'Rock'].includes(randomFirstName);
    const secondValueIsLetter = ['A', 'B', 'C', 'D'].includes(randomSecondValue);
    const hIsOnRight = (yIsOnRight && secondValueIsLetter) || (!yIsOnRight && !secondValueIsLetter);

    // Determine H's position based on the second value and the side
    switch (randomSecondValue) {
      case 'A':
      case '1':
        // These are single-cell placements
        newCorrectHPosition = hIsOnRight ? [{ row: 5, col: 11 }] : [{ row: 5, col: 9 }];
        break;
      case 'B':
      case '2':
        // For B and 2, the user can click on either of the two adjacent cells
        newCorrectHPosition = hIsOnRight ? [{ row: 2, col: 11 }, { row: 2, col: 12 }] : [{ row: 2, col: 8 }, { row: 2, col: 9 }];
        break;
      case 'C':
      case '3':
        newCorrectHPosition = hIsOnRight ? [{ row: 2, col: 14 }] : [{ row: 2, col: 6 }];
        break;
      case 'D':
      case '4':
        newCorrectHPosition = hIsOnRight ? [{ row: 2, col: 17 }] : [{ row: 2, col: 3 }];
        break;
      default:
        newCorrectHPosition = null;
        break;
    }

    // Update state with new play call and reset the game for a new round
    setPlayCall(finalPlayCall);
    setCorrectXPosition(newCorrectXPosition);
    setCorrectYPosition(newCorrectYPosition);
    setCorrectZPosition(newCorrectZPosition);
    setCorrectHPosition(newCorrectHPosition);
    
    setXPlayerPositionUser(null);
    setYPlayerPositionUser(null);
    setZPlayerPositionUser(null);
    setHPlayerPositionUser(null);
    
    // Initial feedback for the new placement order
    setFeedbackMessage('Place the Y player on the grid.');
    setIsXPlayerCorrect(null);
    setIsYPlayerCorrect(null);
    setIsZPlayerCorrect(null);
    setIsHPlayerCorrect(null);
    
    // Start the placement with 'Y'
    setPlayerToPlace('Y');
  };

  // Generate the initial play call when the component mounts
  useEffect(() => {
    generatePlayCall();
  }, []);
  
  /**
   * Handles the user's click on a grid cell.
   */
  const handleCellClick = (row, col) => {
    const newPosition = { row: row + 1, col: col + 1 };

    // Clear any previous feedback colors and message
    setIsXPlayerCorrect(null);
    setIsYPlayerCorrect(null);
    setIsZPlayerCorrect(null);
    setIsHPlayerCorrect(null);
    setFeedbackMessage('');

    // Check if the clicked cell is occupied by a fixed player (OL or QB)
    const isFixedOccupied = players.some(p => p.row === newPosition.row && p.col === newPosition.col);
    if (isFixedOccupied) {
      setFeedbackMessage("That cell is already occupied by a fixed player!");
      return;
    }
    
    // Logic to handle "picking up" a user-placed player
    if (yPlayerPositionUser && yPlayerPositionUser.row === newPosition.row && yPlayerPositionUser.col === newPosition.col) {
        setYPlayerPositionUser(null);
        setPlayerToPlace('Y');
        setFeedbackMessage('You picked up the Y player. Place it in a new spot.');
        return;
    }
    if (xPlayerPositionUser && xPlayerPositionUser.row === newPosition.row && xPlayerPositionUser.col === newPosition.col) {
        setXPlayerPositionUser(null);
        setPlayerToPlace('X');
        setFeedbackMessage('You picked up the X player. Place it in a new spot.');
        return;
    }
    if (zPlayerPositionUser && zPlayerPositionUser.row === newPosition.row && zPlayerPositionUser.col === newPosition.col) {
        setZPlayerPositionUser(null);
        setPlayerToPlace('Z');
        setFeedbackMessage('You picked up the Z player. Place it in a new spot.');
        return;
    }
    if (hPlayerPositionUser && hPlayerPositionUser.row === newPosition.row && hPlayerPositionUser.col === newPosition.col) {
        setHPlayerPositionUser(null);
        setPlayerToPlace('H');
        setFeedbackMessage('You picked up the H player. Place it in a new spot.');
        return;
    }

    // Check if the new position is occupied by another user-placed player
    const isUserOccupied = (xPlayerPositionUser && xPlayerPositionUser.row === newPosition.row && xPlayerPositionUser.col === newPosition.col) ||
                           (yPlayerPositionUser && yPlayerPositionUser.row === newPosition.row && yPlayerPositionUser.col === newPosition.col) ||
                           (zPlayerPositionUser && zPlayerPositionUser.row === newPosition.row && zPlayerPositionUser.col === newPosition.col) ||
                           (hPlayerPositionUser && hPlayerPositionUser.row === newPosition.row && hPlayerPositionUser.col === newPosition.col);
    if (isUserOccupied) {
      setFeedbackMessage("That cell is already occupied by a player!");
      return;
    }

    // Place the current player in the clicked cell
    switch (playerToPlace) {
      case 'Y':
        setYPlayerPositionUser(newPosition);
        if (!xPlayerPositionUser) {
          setPlayerToPlace('X');
          setFeedbackMessage('Place the X player on the grid.');
        } else if (!zPlayerPositionUser) {
          setPlayerToPlace('Z');
          setFeedbackMessage('Place the Z player on the grid.');
        } else if (!hPlayerPositionUser) {
          setPlayerToPlace('H');
          setFeedbackMessage('Place the H player on the grid.');
        } else {
          setPlayerToPlace(null);
          setFeedbackMessage('All players are placed. When ready, click the "Check Alignment" button below to see how you did.');
        }
        break;
      case 'X':
        setXPlayerPositionUser(newPosition);
        if (!zPlayerPositionUser) {
          setPlayerToPlace('Z');
          setFeedbackMessage('Place the Z player on the grid.');
        } else if (!hPlayerPositionUser) {
          setPlayerToPlace('H');
          setFeedbackMessage('Place the H player on the grid.');
        } else if (!yPlayerPositionUser) {
          setPlayerToPlace('Y');
          setFeedbackMessage('Place the Y player on the grid.');
        } else {
          setPlayerToPlace(null);
          setFeedbackMessage('All players are placed. When ready, click the "Check Alignment" button below to see how you did.');
        }
        break;
      case 'Z':
        setZPlayerPositionUser(newPosition);
        if (!hPlayerPositionUser) {
          setPlayerToPlace('H');
          setFeedbackMessage('Place the H player on the grid.');
        } else if (!yPlayerPositionUser) {
          setPlayerToPlace('Y');
          setFeedbackMessage('Place the Y player on the grid.');
        } else if (!xPlayerPositionUser) {
          setPlayerToPlace('X');
          setFeedbackMessage('Place the X player on the grid.');
        } else {
          setPlayerToPlace(null);
          setFeedbackMessage('All players are placed. When ready, click the "Check Alignment" button below to see how you did.');
        }
        break;
      case 'H':
        setHPlayerPositionUser(newPosition);
        if (!yPlayerPositionUser) {
          setPlayerToPlace('Y');
          setFeedbackMessage('Place the Y player on the grid.');
        } else if (!xPlayerPositionUser) {
          setPlayerToPlace('X');
          setFeedbackMessage('Place the X player on the grid.');
        } else if (!zPlayerPositionUser) {
          setPlayerToPlace('Z');
          setFeedbackMessage('Place the Z player on the grid.');
        } else {
          setPlayerToPlace(null);
          setFeedbackMessage('All players are placed. When ready, click the "Check Alignment" button below to see how you did.');
        }
        break;
      default:
        // If all players are already placed and no player was "picked up",
        // the user is clicking on an empty space. We reset the placement.
        setXPlayerPositionUser(null);
        setYPlayerPositionUser(null);
        setZPlayerPositionUser(null);
        setHPlayerPositionUser(null);
        setPlayerToPlace('Y');
        setFeedbackMessage('You have cleared the previous placements. Start by placing the Y player on the grid.');
        break;
    }
  };

  /**
   * Checks if the user's player placements are correct based on the play call.
   */
  const checkAlignment = () => {
    // Check if all players have been placed
    if (!xPlayerPositionUser || !yPlayerPositionUser || !zPlayerPositionUser || !hPlayerPositionUser) {
      setFeedbackMessage("Please place all four players before checking.");
      return;
    }
    
    // Compare user's positions with the correct positions.
    const xCorrect = xPlayerPositionUser.row === correctXPosition.row && xPlayerPositionUser.col === correctXPosition.col;
    const yCorrect = yPlayerPositionUser.row === correctYPosition.row && yPlayerPositionUser.col === correctYPosition.col;
    const zCorrect = zPlayerPositionUser.row === correctZPosition.row && zPlayerPositionUser.col === correctZPosition.col;
    const hCorrect = correctHPosition.some(pos => pos.row === hPlayerPositionUser.row && pos.col === hPlayerPositionUser.col);
    
    // Set the correctness states, which will trigger the useEffect below to update the message
    setIsXPlayerCorrect(xCorrect);
    setIsYPlayerCorrect(yCorrect);
    setIsZPlayerCorrect(zCorrect);
    setIsHPlayerCorrect(hCorrect);
  };

  /**
   * This effect runs whenever the correctness states are updated after a check.
   * It's responsible for setting the final feedback message.
   */
  useEffect(() => {
    // Only run this when a check has actually been performed
    if (isXPlayerCorrect !== null && isYPlayerCorrect !== null && isZPlayerCorrect !== null && isHPlayerCorrect !== null) {
      if (isXPlayerCorrect && isYPlayerCorrect && isZPlayerCorrect && isHPlayerCorrect) {
        setFeedbackMessage("Correct! Great job! Click \"Generate New Play\" to go again.");
        setPlayerToPlace(null);
      } else {
        let message = 'Feedback:';
        message += ` X: ${isXPlayerCorrect ? 'Correct' : 'Try again'}.`;
        message += ` Y: ${isYPlayerCorrect ? 'Correct' : 'Try again'}.`;
        message += ` Z: ${isZPlayerCorrect ? 'Correct' : 'Try again'}.`;
        message += ` H: ${isHPlayerCorrect ? 'Correct' : 'Try again'}.`;
        setFeedbackMessage(message + ' To try again, click on a player to move them, or click on an empty cell to start over.');
      }
    }
  }, [isXPlayerCorrect, isYPlayerCorrect, isZPlayerCorrect, isHPlayerCorrect]);
  
  const getPlayerColorClass = (isCorrect, isUserPlaced) => {
    if (!isUserPlaced) {
      return 'bg-slate-600 border-slate-400'; // Default color for fixed players
    }
    if (isCorrect === true) {
      return 'bg-green-500 border-green-300';
    } else if (isCorrect === false) {
      return 'bg-red-500 border-red-300';
    }
    // New logic: if it's a user-placed player but hasn't been checked yet, use the yellow class
    return 'bg-yellow-300 border-yellow-100 text-black';
  };

  // Helper function to check if the play call is one of the 'in-between' ones
  const isHInBetweenPlay = () => {
    if (!playCall) return false;
    const secondValue = playCall.split(' ')[1];
    return secondValue === 'B' || secondValue === '2';
  };

  // Helper function to get the position for the in-between H player
  const getHInBetweenPosition = () => {
    // This is the key logic to only show the "in-between" visual for the correct plays and user placements
    if (!hPlayerPositionUser || !isHInBetweenPlay()) return null;
    
    // Check if the user's placement is in one of the two valid "in-between" spots
    const isRightSidePlacement = hPlayerPositionUser.row === 2 && (hPlayerPositionUser.col === 11 || hPlayerPositionUser.col === 12);
    const isLeftSidePlacement = hPlayerPositionUser.row === 2 && (hPlayerPositionUser.col === 8 || hPlayerPositionUser.col === 9);

    if (isRightSidePlacement) {
        return {
          row: 2,
          col: 12
        };
    } else if (isLeftSidePlacement) {
        return {
          row: 2,
          col: 9
        };
    }
    return null; // Return null if the user clicked a cell that is not part of the "in-between" placement
  };

  const hInBetweenPos = getHInBetweenPosition();

  return (
    <div className="bg-neutral-800 text-white min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="max-w-4xl w-full bg-neutral-900 rounded-xl shadow-2xl p-6 md:p-8 flex flex-col gap-8">
        {/* Header and Play Call Display */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-400 mb-2">Offensive Play Call</h1>
          <div className="bg-neutral-700 rounded-lg p-4 font-mono text-xl md:text-3xl text-yellow-300 tracking-wider shadow-inner">
            {playCall}
          </div>
        </div>

        {/* The Football Field Visual */}
        <div className="bg-emerald-700 rounded-lg shadow-lg p-4 flex flex-col items-center">
          
          {/* Grid Container */}
          <div className="w-full max-w-[calc(19*50px)] border border-neutral-600 rounded-lg overflow-hidden relative">
            {/* Loop to create 5 rows */}
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex">
                {/* Loop to create 19 cells per row */}
                {Array.from({ length: 19 }).map((_, colIndex) => {
                  const cellRow = rowIndex + 1;
                  const cellCol = colIndex + 1;
                  
                  const playerInCell = players.find(p => p.row === cellRow && p.col === cellCol);
                  const xPlayerInCell = xPlayerPositionUser && xPlayerPositionUser.row === cellRow && xPlayerPositionUser.col === cellCol;
                  const yPlayerInCell = yPlayerPositionUser && yPlayerPositionUser.row === cellRow && yPlayerPositionUser.col === cellCol;
                  const zPlayerInCell = zPlayerPositionUser && zPlayerPositionUser.row === cellRow && zPlayerPositionUser.col === cellCol;
                  
                  // Only render the H player inside a cell if it's a single-cell placement
                  const hPlayerInCell = hPlayerPositionUser && hPlayerPositionUser.row === cellRow && hPlayerPositionUser.col === cellCol && !isHInBetweenPlay();
                  
                  return (
                    <div 
                      key={colIndex} 
                      className="w-1/19 bg-emerald-700 border-r border-b border-neutral-600 aspect-square flex items-center justify-center relative cursor-pointer"
                      style={{ width: `calc(100% / 19)` }}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                    >
                      {playerInCell && (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white bg-slate-600 border-2 border-slate-400">
                          {playerInCell.name}
                        </div>
                      )}
                      {xPlayerInCell && (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white border-2 ${getPlayerColorClass(isXPlayerCorrect, true)}`}>
                          X
                        </div>
                      )}
                      {yPlayerInCell && (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${getPlayerColorClass(isYPlayerCorrect, true)}`}>
                          Y
                        </div>
                      )}
                      {zPlayerInCell && (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white border-2 ${getPlayerColorClass(isZPlayerCorrect, true)}`}>
                          Z
                        </div>
                      )}
                      {hPlayerInCell && (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white border-2 ${getPlayerColorClass(isHPlayerCorrect, true)}`}>
                          H
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
            {/* Visual element for "in-between" H player placement */}
            {hInBetweenPos && (
                <div
                    className={`absolute z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white border-2 ${getPlayerColorClass(isHPlayerCorrect, true)}`}
                    style={{
                        top: `${(hInBetweenPos.row - 1) * (100 / 5)}%`,
                        left: `${(hInBetweenPos.col - 1) * (100 / 19)}%`,
                        transform: 'translate(-50%, 0)'
                    }}
                >
                    H
                </div>
            )}
          </div>
          {feedbackMessage && (
            <p className={`mt-4 text-center font-bold text-lg ${
                isXPlayerCorrect === null && isYPlayerCorrect === null && isZPlayerCorrect === null && isHPlayerCorrect === null
                ? 'text-white'
                : isXPlayerCorrect && isYPlayerCorrect && isZPlayerCorrect && isHPlayerCorrect
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}>
              {feedbackMessage}
            </p>
          )}
        </div>
        
        {/* Control Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={generatePlayCall}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            {/* Replaced lucide-react with an inline SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M21.5 2v6h-6"/><path d="M2.5 22v-6h6"/><path d="M2.5 16a9 9 0 0 1 14.8-9 9 9 0 0 1 5.2 7.7L21.5 16"/><path d="M21.5 16a9 9 0 0 1-14.8 9 9 9 0 0 1-5.2-7.7L2.5 16"/>
            </svg>
            Generate New Play
          </button>
          <button
            onClick={checkAlignment}
            disabled={!xPlayerPositionUser || !yPlayerPositionUser || !zPlayerPositionUser || !hPlayerPositionUser}
            className={`flex items-center gap-2 px-6 py-3 font-bold rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-opacity-50
              ${(!xPlayerPositionUser || !yPlayerPositionUser || !zPlayerPositionUser || !hPlayerPositionUser)
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                : 'bg-yellow-500 hover:bg-yellow-600 text-black focus:ring-yellow-500'}`
            }
          >
            Check Alignment
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
