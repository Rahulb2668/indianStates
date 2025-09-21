import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import IndiaMap from "react-svgmap-india";
import styles from "../styles/Home.module.css";

// Indian states data with aliases for matching
const indianStates = [
  { name: "Andhra Pradesh", aliases: ["andhra pradesh", "ap"] },
  { name: "Arunachal Pradesh", aliases: ["arunachal pradesh", "arunachal"] },
  { name: "Assam", aliases: ["assam"] },
  { name: "Bihar", aliases: ["bihar"] },
  { name: "Chhattisgarh", aliases: ["chhattisgarh", "chattisgarh"] },
  { name: "Goa", aliases: ["goa"] },
  { name: "Gujarat", aliases: ["gujarat"] },
  { name: "Haryana", aliases: ["haryana"] },
  { name: "Himachal Pradesh", aliases: ["himachal pradesh", "himachal"] },
  { name: "Jharkhand", aliases: ["jharkhand"] },
  { name: "Karnataka", aliases: ["karnataka"] },
  { name: "Kerala", aliases: ["kerala"] },
  { name: "Madhya Pradesh", aliases: ["madhya pradesh", "mp"] },
  { name: "Maharashtra", aliases: ["maharashtra"] },
  { name: "Manipur", aliases: ["manipur"] },
  { name: "Meghalaya", aliases: ["meghalaya"] },
  { name: "Mizoram", aliases: ["mizoram"] },
  { name: "Nagaland", aliases: ["nagaland"] },
  { name: "Odisha", aliases: ["odisha", "orissa"] },
  { name: "Punjab", aliases: ["punjab"] },
  { name: "Rajasthan", aliases: ["rajasthan"] },
  { name: "Sikkim", aliases: ["sikkim"] },
  { name: "Tamil Nadu", aliases: ["tamil nadu", "tamilnadu"] },
  { name: "Telangana", aliases: ["telangana"] },
  { name: "Tripura", aliases: ["tripura"] },
  { name: "Uttar Pradesh", aliases: ["uttar pradesh", "up"] },
  { name: "Uttarakhand", aliases: ["uttarakhand"] },
  { name: "West Bengal", aliases: ["west bengal", "bengal"] },
];

// Union Territories data with aliases for matching
const indianUnionTerritories = [
  {
    name: "Andaman and Nicobar Islands",
    aliases: ["andaman and nicobar", "andaman"],
  },
  { name: "Chandigarh", aliases: ["chandigarh"] },
  {
    name: "Dadra and Nagar Haveli and Daman and Diu",
    aliases: ["daman and diu", "dadra and nagar haveli"],
  },
  { name: "Delhi", aliases: ["delhi", "nct"] },
  { name: "Jammu and Kashmir", aliases: ["jammu and kashmir", "j&k"] },
  { name: "Ladakh", aliases: ["ladakh"] },
  { name: "Lakshadweep", aliases: ["lakshadweep"] },
  { name: "Puducherry", aliases: ["puducherry", "pondicherry"] },
];

// Combine states and UTs for game logic
const indianStatesAndUTs = [...indianStates, ...indianUnionTerritories];

// Add this mapping at the top of your file
const stateIdMap: Record<string, string> = {
  "Andhra Pradesh": "AP",
  "Arunachal Pradesh": "AR",
  Assam: "AS",
  Bihar: "BR",
  Chhattisgarh: "CT",
  Goa: "GA",
  Gujarat: "GJ",
  Haryana: "HR",
  "Himachal Pradesh": "HP",
  Jharkhand: "JH",
  Karnataka: "KA",
  Kerala: "KL",
  "Madhya Pradesh": "MP",
  Maharashtra: "MH",
  Manipur: "MN",
  Meghalaya: "ML",
  Mizoram: "MZ",
  Nagaland: "NL",
  Odisha: "OR",
  Punjab: "PB",
  Rajasthan: "RJ",
  Sikkim: "SK",
  "Tamil Nadu": "TN",
  Telangana: "TG",
  Tripura: "TR",
  "Uttar Pradesh": "UP",
  Uttarakhand: "UT",
  "West Bengal": "WB",
  // Union Territories
  "Andaman and Nicobar Islands": "AN",
  Chandigarh: "CH",
  "Dadra and Nagar Haveli and Daman and Diu": "DD",
  Delhi: "DL",
  "Jammu and Kashmir": "JK",
  Ladakh: "LA",
  Lakshadweep: "LD",
  Puducherry: "PY",
};

export default function Home() {
  const [guessedStates, setGuessedStates] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState("");
  const [gameComplete, setGameComplete] = useState(false);

  // Memoized function to update map styling
  const updateMapStyling = useCallback((states: string[]) => {
    if (states.length === 0) return;

    const timer = setTimeout(() => {
      let svg =
        document.querySelector(".mapContainer svg") ||
        document.querySelector("svg") ||
        document.querySelector(".mapContainer > div svg") ||
        document.querySelector(".mapContainer div svg");

      if (!svg) {
        const allSvgs = document.querySelectorAll("svg");
        if (allSvgs.length > 0) {
          svg = allSvgs[0];
        }
      }

      if (svg) {
        // Remove previous guessed state styling
        svg.querySelectorAll("path").forEach((path) => {
          path.classList.remove("guessedState");
          path.style.fill = "";
          path.style.stroke = "";
          path.style.strokeWidth = "";
        });

        // Add styling to guessed states using ID mapping
        states.forEach((stateName) => {
          const stateId = stateIdMap[stateName];
          if (!stateId) return;

          const statePath = svg.querySelector(`path[id="${stateId}"]`);
          if (statePath) {
            statePath.classList.add("guessedState");
            const pathElement = statePath as SVGPathElement;
            pathElement.style.fill = "#22c55e";
            pathElement.style.stroke = "#16a34a";
            pathElement.style.strokeWidth = "2";
          }
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Update map styling when guessed states change
  useEffect(() => {
    const cleanup = updateMapStyling(guessedStates);
    return cleanup;
  }, [guessedStates, updateMapStyling]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const input = inputValue.trim().toLowerCase();
    const foundState = indianStatesAndUTs.find(
      (state) =>
        state.name.toLowerCase() === input || state.aliases.includes(input)
    );

    if (foundState && !guessedStates.includes(foundState.name)) {
      setGuessedStates((prev) => [...prev, foundState.name]);
      setFeedback("Correct! 🎉");
      setInputValue("");

      if (guessedStates.length + 1 === indianStatesAndUTs.length) {
        setGameComplete(true);
        setFeedback(
          "Congratulations! You guessed all Indian states and UTs! 🏆"
        );
      }
    } else if (guessedStates.includes(foundState?.name || "")) {
      setFeedback("You already guessed this state or UT!");
    } else {
      setFeedback("Wrong! Try again.");
    }

    // Clear feedback after 2 seconds
    setTimeout(() => setFeedback(""), 2000);
  };

  const resetGame = () => {
    setGuessedStates([]);
    setInputValue("");
    setFeedback("");
    setGameComplete(false);
  };

  return (
    <>
      <Head>
        <title>Guess Indian States & UTs</title>
        <meta
          name="description"
          content="A fun game to guess all Indian states and union territories"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            Guess Indian States & Union Territories
          </h1>
          <p className={styles.subtitle}>
            Type the names of Indian states or union territories and see them
            appear on the map!
          </p>
        </header>

        <div className={styles.gameArea}>
          <div className={styles.mapContainer}>
            <IndiaMap
              size="600px"
              mapColor="#f8fafc"
              strokeColor="#9ca3af"
              strokeWidth="1"
              hoverColor="#d1d5db"
              onClick={() => {
                // No click interactions - map is display only
              }}
            />
          </div>

          <div className={styles.inputSection}>
            <form onSubmit={handleSubmit} className={styles.inputForm}>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter state or UT name..."
                  className={styles.input}
                  disabled={gameComplete}
                />
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={gameComplete}
                >
                  Submit
                </button>
              </div>
            </form>

            {feedback && (
              <div
                className={`${styles.feedback} ${
                  feedback.includes("Correct") ? styles.success : styles.error
                }`}
              >
                {feedback}
              </div>
            )}

            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Correct:</span>
                <span className={styles.statValue}>{guessedStates.length}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Total:</span>
                <span className={styles.statValue}>
                  {indianStatesAndUTs.length}
                </span>
              </div>
            </div>

            <div className={styles.guessedStates}>
              <h3>Guessed States & UTs:</h3>
              <div className={styles.stateList}>
                {guessedStates.map((state) => (
                  <span key={state} className={styles.stateTag}>
                    {state}
                  </span>
                ))}
              </div>
            </div>

            {gameComplete && (
              <button onClick={resetGame} className={styles.resetBtn}>
                Play Again
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
