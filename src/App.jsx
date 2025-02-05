import { useState, useEffect, useRef } from "react"
import { languages } from "./data/languages"
import { clsx } from "clsx"
import { getFarewellText, getRandomWord } from "./utils/utils"
import Confetti from "react-confetti"

function AssemblyEndgame() {
  const [ currentWord, setCurrentWord ] = useState(() => getRandomWord())
  const [ guessedLetters, setGuessedLetters ] = useState([])
  const newGameButtonRef = useRef(null)

  const numGuessesLeft = languages.length - 1
  const wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length
  const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
  const isGameLost = wrongGuessCount >= numGuessesLeft
  const isGameOver = isGameWon || isGameLost
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

  const alphabet = "abcdefghijklmnopqrstuvwxyz"

  // add guessed letter to the array of guessed letters
  function addGuessedLetter(letter) {
      setGuessedLetters(prevLetters => {
        const lettersSet = new Set(prevLetters)
        lettersSet.add(letter)
        return Array.from(lettersSet)
      })
      // prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
  }

  // display languages
  const languageElements = languages.map((language, index) => {
    const isLanguageLost = index < wrongGuessCount
    const className = clsx("language", isLanguageLost && "lost")
    return (
      <span 
        className={className}
        key={language.name} 
        style={{ backgroundColor: language.backgroundColor, color: language.color }}
      >
        {language.name}
      </span>
    )
  })

  // display word
  const letterElements = currentWord.split("").map((letter, index) => {
    const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
    const letterClassName = clsx(
      isGameLost && !guessedLetters.includes(letter) && "missed-letter"
    )
    return (
      <span 
        className={letterClassName}
        key={index}
      >
        {shouldRevealLetter ? letter.toUpperCase() : "_"}
      </span>
    )
})

  // display keyboard
  const keyboardElements = alphabet.split("").map((key, index) => {
    const isGuessed = guessedLetters.includes(key)
    const isCorrect = isGuessed && currentWord.includes(key)
    const isWrong = isGuessed && !currentWord.includes(key)
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    })
    return (
      <button
        className={className}
        key={index}
        onClick={() => addGuessedLetter(key)}
        disabled={isGameOver}
        aria-disabled={guessedLetters.includes(key)}
        aria-label={`Key ${key}`}
      >
        {key.toUpperCase()}
      </button>
    )
  })

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: isLastGuessIncorrect && !isGameOver
  }
  )

  function renderGameStatus() {
    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      )
    } else if (isGameLost) {
      return (
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </>
      )
    } else if (!isGameOver && isLastGuessIncorrect) {
      return (
        <>
          <p className="farewell-message">{getFarewellText(languages[wrongGuessCount - 1].name)}</p>
        </>
      )
    } else {
      return null
    }
  }

  function startNewGame() {
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
  }

  // scroll to new game button when game is over
  useEffect(() => {
    if (isGameOver && newGameButtonRef.current) {
      newGameButtonRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [isGameOver])

  return (
    <main>
      {isGameWon && <Confetti className="confetti" recycle={false} numberOfPieces={1000} />}
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word within 8 attempts to keep the programming world safe from Assembly!
        </p>
      </header>

      <section className={gameStatusClass} aria-live="polite" role="status">
        {renderGameStatus()}
      </section>

      <section className="language-list">
        {languageElements}
      </section>

      <section className="word">
        {letterElements}
      </section>

      {/* Combined visually-hidden aria-live region for status updates */}
      <section className="sr-only" aria-live="polite" role="status">
        <p>
          {currentWord.includes(lastGuessedLetter) ? 
          `Correct! The letter ${lastGuessedLetter} is in the word.` : 
          `Incorrect! The letter ${lastGuessedLetter} is not in the word.`}
          You have {numGuessesLeft} attempts left.
        </p>
        <p>
          Current word: {currentWord.split("").map(letter =>
          guessedLetters.includes(letter) ? letter + "." : "blank.").join(" ")}
        </p>
      </section>

      <section className="keyboard">
        {keyboardElements}
      </section>
      
      {isGameOver && 
        <button 
          ref={newGameButtonRef}
          className="new-game"
          onClick={startNewGame}
        >
          New Game
        </button>
      }
    </main>
  )
}

export default AssemblyEndgame
