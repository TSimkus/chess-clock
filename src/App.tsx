import { useEffect, useState } from 'react'
import Timer from './components/Timer';
import Settings from './components/Settings';
import { TimerId, SettingsState } from './constants'
import { convertToMinutes } from './helpers'
import { TiCog, TiMediaPause, TiMediaPlay, TiRefresh } from "react-icons/ti";
import { keepSceenAwake } from './wakeLock';


function App() {
  const [timerKey, setTimerKey] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [activeTimer, setActiveTimer] = useState<TimerId|null>();

  const [countdownPaused, setCountdownPaused] = useState<boolean>(true);

  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<SettingsState>({
    timeControl: 10,
  });

  const [topTimerDuration, setTopTimerDuration] = useState<number>(convertToMinutes(settings.timeControl));
  const [bottomTimerDuration, setBottomTimerDuration] = useState<number>(convertToMinutes(settings.timeControl));

  const toggleTimer = (id?: TimerId) => {
    if (gameStarted) setActiveTimer(activeTimer === TimerId.TOP ? TimerId.BOTTOM : TimerId.TOP);
    else {
        setGameStarted(true);
        togglePause();
        setActiveTimer(id === TimerId.TOP ? TimerId.BOTTOM : TimerId.TOP)
    }
  }

  const stopTimers = () => setActiveTimer(null);

  const togglePause = () => {
    setCountdownPaused(!countdownPaused)
  }

  const restart = () => {
    setTimerKey(timerKey + 1);
    setActiveTimer(null);
    setCountdownPaused(true);
    setGameStarted(false);
  }

  const updateSettings = (newSettings: SettingsState) => {
    setSettings(newSettings);
  }

  useEffect(() => {
    setTopTimerDuration(convertToMinutes(settings.timeControl));
    setBottomTimerDuration(convertToMinutes(settings.timeControl));

    restart();
  }, [settings]);

  useEffect(() => {
    if (!countdownPaused) keepSceenAwake();
  }, [countdownPaused])

  return (
    <>
      <div className='flex justify-center items-center'>
        <div className='flex flex-col w-screen h-dvh text-center'>
          <Timer 
            key={`${TimerId.TOP}-${timerKey}`} 
            id={TimerId.TOP} 
            active={activeTimer === TimerId.TOP} 
            timeLeft={topTimerDuration} 
            timerClicked={toggleTimer} 
            timeIsUp={() => stopTimers} 
            pause={countdownPaused} 
            gameStarted={gameStarted}
            flip={true}
          />

          <div className='flex justify-center items-center text-3xl'>
            <span onClick={() => togglePause()}>{ 
              countdownPaused 
                ? gameStarted && <TiMediaPlay />
                : <TiMediaPause /> 
            }</span>

            { countdownPaused && 
              <>
                { gameStarted && <TiRefresh onClick={restart} /> }
                <TiCog onClick={() => setSettingsOpen(true)}/>
              </>
            }
          </div>
          
          <Timer 
            key={`${TimerId.BOTTOM}-${timerKey}`} 
            id={TimerId.BOTTOM} 
            active={activeTimer === TimerId.BOTTOM} 
            timeLeft={bottomTimerDuration} 
            timerClicked={toggleTimer} 
            timeIsUp={() => stopTimers} 
            pause={countdownPaused} 
            gameStarted={gameStarted}
            flip={false}
          />
        </div>
      </div>

      {settingsOpen && 
        <Settings 
          closeSettings={() => setSettingsOpen(false)}
          settings={settings}
          onSubmit={updateSettings}
        ></Settings>
      }
    </>
  )
}

export default App
