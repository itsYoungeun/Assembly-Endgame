import { useState, useEffect, useRef } from "react"
import { languages } from "./languages"
import { clsx } from "clsx"

function AssemblyEndgame() {
  const [ currentWord, setCurrentWord ] = useState("react")
  const [ guessedLetters, setGuessedLetters ] = useState([])
  const newGameButtonRef = useRef(null)

  const wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length
  const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
  const isGameLost = wrongGuessCount >= languages.length - 1
  const isGameOver = isGameWon || isGameLost

  const alphabet = "abcdefghijklmnopqrstuvwxyz"

  function addGuessedLetter(letter) {
      setGuessedLetters(prevLetters => {
        const lettersSet = new Set(prevLetters)
        lettersSet.add(letter)
        return Array.from(lettersSet)
      })
      // prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
  }

  useEffect(() => {
    if (isGameOver && newGameButtonRef.current) {
      newGameButtonRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [isGameOver])

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

  const letterElements = currentWord.split("").map((letter, index) => (
    <span 
      className="letter"
      key={index}
    >
      {guessedLetters.includes(letter) ? letter.toUpperCase() : "_"}
    </span>
  ))

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
      >
        {key.toUpperCase()}
      </button>
    )
})

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
  }
  )

  return (
    <main>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word within 8 attempts to keep the programming world safe from Assembly!
        </p>
      </header>

      <section className={gameStatusClass}>
        {isGameOver ? (
            isGameWon ? (
                <>
                    <h2>You win!</h2>
                    <p>Well done! 🎉</p>
                </>
            ) : (
                <>
                    <h2>Game over!</h2>
                    <p>You lose! Better start learning Assembly 😭</p>
                </>
            )
        ) : (
                null
            )
        }
      </section>

      <section className="language-list">
        {languageElements}
      </section>

      <section className="word">
        {letterElements}
      </section>

      <section className="keyboard">
        {keyboardElements}
      </section>
      
      {isGameOver && 
        <button 
          ref={newGameButtonRef}
          className="new-game">
          New Game
        </button>
      }
    </main>
  )
}

export default AssemblyEndgame
