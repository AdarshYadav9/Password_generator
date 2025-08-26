import { useState, useCallback, useEffect, useRef } from "react";

function App() {
  const [length, setLength] = useState(8);
  const [numberallowed, setNumberallowed] = useState(false);
  const [charallowed, setCharallowed] = useState(false);
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState({ label: "", score: 0 });
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef(null);
  const buttonRef = useRef(null);

  // Password generator
  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if (numberallowed) str += "0123456789";
    if (charallowed) str += "!#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

    for (let i = 0; i < length; i++) {
      const char = Math.floor(Math.random() * str.length);
      pass += str.charAt(char);
    }
    setPassword(pass);
    setStrength(passwordStrength(pass));
  }, [length, numberallowed, charallowed]);

  // Copy
  const copyPasswordToClipboard = useCallback(() => {
    window.navigator.clipboard.writeText(password);
    buttonRef.current?.blur();
  }, [password]);

  useEffect(() => {
    passwordGenerator();
  }, [length, numberallowed, charallowed, passwordGenerator]);

  // Strength calculator
  const passwordStrength = (string) => {
    let score = 0;

    if (string.length >= 8) score++;
    if (/[0-9]/.test(string)) score++;
    if (/[A-Z]/.test(string)) score++;
    if (/[^A-Za-z0-9]/.test(string)) score++;

    if (score <= 1) return { label: "Weak", score: 33 };
    if (score === 2) return { label: "Medium", score: 66 };
    return { label: "Strong", score: 100 };
  };

  // Time to crack (based on score %)
  const getTimeToCrack = (score) => {
    if (score === 0) return "";
    if (score < 40) return "Instantly";
    if (score < 70) return "Hours to days";
    if (score < 90) return "Months to years";
    return "Thousands of years";
  };

  // Helpers for UI
  const getColorClasses = () => {
    if (strength.label === "Weak") return "bg-red-500";
    if (strength.label === "Medium") return "bg-yellow-400";
    return "bg-emerald-500";
  };

  const getTextColorClass = () => {
    if (strength.label === "Weak") return "text-red-500";
    if (strength.label === "Medium") return "text-yellow-400";
    return "text-emerald-500";
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md p-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl shadow-2xl border border-emerald-300">
        <h1 className="text-4xl font-extrabold text-center text-white mb-8 drop-shadow-lg tracking-wide">
          Password Generator
        </h1>

        {/* Generated password box */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={password}
            className="flex-1 bg-slate-900 text-white placeholder-gray-400 rounded-lg px-4 py-3 outline-none text-lg font-mono border border-slate-700"
            placeholder="Password"
            readOnly
            ref={passwordRef}
          />
          <button
            type="button"
            onClick={() => {
              alert("Password is Copied to Clipboard!");
              copyPasswordToClipboard();
            }}
            ref={buttonRef}
            className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Copy
          </button>
        </div>

        {/* Strength Bar */}
        {password && (
          <div className="bg-white rounded-xl shadow p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-800 font-medium">Security score</span>
              <span
                className={`px-3 py-1 rounded-lg text-sm font-semibold ${getColorClasses()} text-black`}
              >
                {strength.label}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${getColorClasses()}`}
                style={{ width: `${strength.score}%` }}
              />
            </div>

            <p className="mt-4 text-center text-sm text-gray-700">
              {getTimeToCrack(strength.score)} to hack this password
            </p>
            <p className="mt-1 text-center text-sm text-blue-600 underline cursor-pointer">
              Is my password vulnerable?
            </p>
          </div>
        )}

        {/* Length & Options */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <label className="text-white font-medium">
              Length: <span className="font-bold">{length}</span>
            </label>
            <input
              type="range"
              min={6}
              max={100}
              value={length}
              className="w-2/3 accent-green-400"
              onChange={(e) => setLength(Number(e.target.value))}
            />
          </div>

          <div className="flex items-center gap-6 justify-center">
            <label className="text-white flex items-center gap-2">
              <input
                type="checkbox"
                checked={numberallowed}
                className="accent-green-400 w-5 h-5"
                onChange={() => setNumberallowed((prev) => !prev)}
              />
              <span className="font-medium">Numbers</span>
            </label>
            <label className="text-white flex items-center gap-2">
              <input
                type="checkbox"
                checked={charallowed}
                className="accent-green-400 w-5 h-5"
                onChange={() => setCharallowed((prev) => !prev)}
              />
              <span className="font-medium">Characters</span>
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <button
          className="w-full bg-slate-900 hover:bg-slate-700 text-white font-bold py-3 rounded-xl shadow transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
          onClick={passwordGenerator}
        >
          Generate New
        </button>

        {/* Privacy Note */}
        <p className="mt-4 text-center text-sm text-gray-200 opacity-80">
          🔒 We take care of your privacy. Your passwords are never stored.
        </p>
      </div>
    </div>
  );
}

export default App;
