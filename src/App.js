import React, { useState } from 'react';
import NumberPicker from './NumberPicker/NumberPicker';
import SelectedNumbers from './SelectedNumbers/SelectedNumbers';

function App() {
  const [selectedNumbers, setSelectedNumbers] = useState([]);

  const handleNumberClick = (number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(prevSelected => prevSelected.filter(num => num !== number));
    } else {
      if (selectedNumbers.length < 7) {
        setSelectedNumbers(prevSelected => [...prevSelected, number]);
      } else {
        // Optionally, you can show a message to the user that they can't select more than 7 numbers.
      }
    }
  };

  return (
    <div className="App">
      <h1>Lottery Number Picker</h1>
      <NumberPicker selectedNumbers={selectedNumbers} onNumberClick={handleNumberClick} />
      <SelectedNumbers selectedNumbers={selectedNumbers} />
    </div>
  );
}

export default App;