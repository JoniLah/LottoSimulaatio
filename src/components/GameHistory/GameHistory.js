import React, { useEffect, useState, useContext } from 'react';
import { Accordion } from 'react-bootstrap';
import SelectedNumbers from '../SelectedNumbers/SelectedNumbers';
import SettingsContext from '../../context/SettingsContext';
import EurojackpotContext from '../../context/EurojackpotContext';
//import './GameHistory.css';

const GameHistory = (props) => {
    const { winningPrizes } = useContext(EurojackpotContext);
    const { hideRows } = useContext(SettingsContext);

    const calculateMatchedNumbers = (selectedNumbers, winningNumbers) => {
        return selectedNumbers.filter(number => winningNumbers.includes(number)).length;
    };

    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
          const offset = window.scrollY;
          const threshold = 100; // Adjust this value based on when you want the header to become sticky
    
          setIsSticky(offset > threshold);
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <Accordion defaultActiveKey="0" flush>
            {props.previousGames.map((game, index) => (
            <Accordion.Item eventKey={index} key={index}>
                <div className={`game-history-item ${isSticky ? 'sticky' : ''}`}>
                    <div className="card">
                        <div className="card-header past-game__container">
                            <Accordion.Header className="mb-0">
                                <div className="btn btn-link w-100">
                                    <div className="d-flex flex-row justify-content-between align-items-center w-100 past-game__accordion">
                                        <h4>Eurojackpot</h4>
                                        <div className="d-flex flex-column align-items-end">
                                            <span>Hinta: <strong>{game.cost}</strong></span>
                                            <span>Arvottu: <strong>{game.date}</strong></span>
                                        </div>
                                    </div>
                                </div>
                            </Accordion.Header>
                        </div>

                        <Accordion.Body>
                            <div className="card-body">
                                <div>
                                    <h5><strong>Edellisen kierroksen tiedot:</strong></h5>
                                    <p><strong>Kierros:</strong> {game.roundNumber}</p>
                                    <p><strong>Voittorivin numerot:</strong> {game.winningNumbers.sort((a, b) => a - b).join(', ')}</p>
                                    <p><strong>Ajankohta:</strong> {game.timestamp}</p>
                                    <p><strong>Hinta:</strong> {game.cost}</p>
                                    {game.winnings > 0 ? (
                                    <p><strong>Voitot:</strong> {game.winnings.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' })}</p>
                                    ) : (<strong>Ei voittoa</strong>)}
                                </div>
                            </div>

                            {!hideRows ? (
                            <table className="w-100 past-game__table table table-striped">
                                <thead>
                                    <tr>
                                    <th>Rivi</th>
                                    <th>Numerot</th>
                                    <th>Osumia</th>
                                    <th>Voitto</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {props.rows.map((row, index) => (
                                        <tr className="past-game__row" key={row.key}>
                                            <td><small className="mx-2 past-game__index">{index + 1}.</small></td>

                                            <td>
                                                <div className="selected-row">
                                                    <div className="d-flex flex-row align-items-center">
                                                        <SelectedNumbers
                                                            selectedNumbers={row.numbers}
                                                            selectedExtraNumbers={row.extraNumbers}
                                                            winningNumbers={game.winningNumbers}
                                                            winningExtraNumbers={game.winningExtraNumbers}
                                                            handleResetRow={() => {}}
                                                            showResetButton={false}
                                                            winningNumbersHistory={game.winningNumbers.sort((a, b) => a - b).join(', ')}
                                                            winningExtraNumbersHistory={game.winningExtraNumbers.sort((a, b) => a - b).join(', ')}
                                                        />
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                {calculateMatchedNumbers(row.numbers, game.winningNumbers)}
                                            </td>

                                            <td>
                                                {props.calculateWinnings(props.calculateMatchedNumbers(row.numbers, game.winningNumbers)) > 0 && (
                                                    <>
                                                    {winningPrizes[props.calculateMatchedNumbers(row.numbers, game.winningNumbers)].toLocaleString('fi-FI', {
                                                        style: 'currency',
                                                        currency: 'EUR',
                                                    })}
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>)
                            : (
                                <div className="d-flex align-items-center"><i>Rivit on piilotettu. Aseta ne näkyviksi asetuksista.</i></div>
                            )}
                        </Accordion.Body>
                    </div>
                </div>
            </Accordion.Item>
            ))}
        </Accordion>
    );
};

export default GameHistory;