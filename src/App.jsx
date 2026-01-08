import React, { useState } from 'react';

export default function ScientificCalculator() {
  const [display, setDisplay] = useState('0');
  const [mode, setMode] = useState('calc');
  const [stringInput, setStringInput] = useState('');
  const [stringInput2, setStringInput2] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stringResult, setStringResult] = useState('');

  const handleNumber = (num) => {
    if (display === '0' || display === 'Error') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op) => {
    if (display === 'Error') return;
    setDisplay(display + op);
  };

  const handleScientific = (func) => {
    try {
      let value = parseFloat(display);
      let result;
      
      switch(func) {
        case 'sin':
          result = Math.sin(value * Math.PI / 180);
          break;
        case 'cos':
          result = Math.cos(value * Math.PI / 180);
          break;
        case 'tan':
          result = Math.tan(value * Math.PI / 180);
          break;
        case 'log':
          result = Math.log10(value);
          break;
        case 'ln':
          result = Math.log(value);
          break;
        case 'sqrt':
          result = Math.sqrt(value);
          break;
        case 'square':
          result = value * value;
          break;
        case 'cube':
          result = value * value * value;
          break;
        case 'inv':
          result = 1 / value;
          break;
        case 'fact':
          result = factorial(Math.floor(value));
          break;
        default:
          return;
      }
      setDisplay(result.toString());
    } catch (e) {
      setDisplay('Error');
    }
  };

  const factorial = (n) => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const calculate = () => {
    try {
      let expr = display.replace(/×/g, '*').replace(/÷/g, '/');
      let result = eval(expr);
      setDisplay(result.toString());
    } catch (e) {
      setDisplay('Error');
    }
  };

  const clear = () => {
    setDisplay('0');
  };

  const deleteLast = () => {
    if (display.length === 1 || display === 'Error') {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleStringOperation = (operation) => {
    try {
      let result;
      const input = stringInput;
      const input2 = stringInput2;
      
      switch(operation) {
        case 'length':
          result = `Length: ${input.length}`;
          break;
        case 'uppercase':
          result = input.toUpperCase();
          break;
        case 'lowercase':
          result = input.toLowerCase();
          break;
        case 'reverse':
          result = input.split('').reverse().join('');
          break;
        case 'words':
          const words = input.trim().split(/\s+/);
          result = `Word count: ${input.trim() === '' ? 0 : words.length}`;
          break;
        case 'vowels':
          const vowelCount = (input.match(/[aeiouAEIOU]/g) || []).length;
          result = `Vowels: ${vowelCount}`;
          break;
        case 'consonants':
          const consonantCount = (input.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || []).length;
          result = `Consonants: ${consonantCount}`;
          break;
        case 'capitalize':
          result = input.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join(' ');
          break;
        case 'trim':
          result = input.trim();
          break;
        case 'palindrome':
          const cleaned = input.toLowerCase().replace(/[^a-z0-9]/g, '');
          const isPalindrome = cleaned === cleaned.split('').reverse().join('');
          result = `Palindrome: ${isPalindrome ? 'Yes' : 'No'}`;
          break;
        case 'concatenate':
          result = input + input2;
          break;
        case 'merge':
          result = `${input} ${input2}`;
          break;
        case 'search':
          if (!searchTerm) {
            result = 'Please enter a search term';
            break;
          }
          const index = input.indexOf(searchTerm);
          const count = (input.match(new RegExp(searchTerm, 'g')) || []).length;
          if (index === -1) {
            result = `"${searchTerm}" not found`;
          } else {
            result = `Found "${searchTerm}" at position ${index}\nOccurrences: ${count}`;
          }
          break;
        case 'replace':
          if (!searchTerm || !input2) {
            result = 'Enter search term and replacement text';
            break;
          }
          result = input.replaceAll(searchTerm, input2);
          break;
        case 'substring':
          const start = parseInt(searchTerm) || 0;
          const end = parseInt(input2) || input.length;
          result = input.substring(start, end);
          break;
        case 'split':
          const delimiter = searchTerm || ' ';
          const parts = input.split(delimiter);
          result = `Split into ${parts.length} parts:\n${parts.map((p, i) => `[${i}]: ${p}`).join('\n')}`;
          break;
        case 'compare':
          if (input === input2) {
            result = 'Strings are EQUAL';
          } else if (input.toLowerCase() === input2.toLowerCase()) {
            result = 'Strings are equal (case-insensitive)';
          } else {
            result = 'Strings are DIFFERENT';
          }
          break;
        case 'contains':
          if (!searchTerm) {
            result = 'Please enter a search term';
            break;
          }
          const contains = input.includes(searchTerm);
          result = `Contains "${searchTerm}": ${contains ? 'Yes' : 'No'}`;
          break;
        default:
          result = 'Invalid operation';
      }
      setStringResult(result);
    } catch (e) {
      setStringResult('Error in operation');
    }
  };

  const CalcButton = ({ value, onClick, className = '' }) => (
    <button
      onClick={onClick}
      className={`rounded p-3 font-semibold text-sm transition-all active:scale-95 ${className}`}
    >
      {value}
    </button>
  );

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black rounded-xl shadow-2xl border-2 border-white overflow-hidden">
          
          {/* Header */}
          <div className="bg-black px-6 py-4 border-b-2 border-white">
            <h1 className="text-white text-xl font-bold">SCIENTIFIC CALCULATOR</h1>
          </div>

          {/* Mode Toggle */}
          <div className="bg-black border-b-2 border-white p-4 flex gap-2">
            <button
              onClick={() => setMode('calc')}
              className={`flex-1 py-3 px-4 rounded font-bold transition-all border-2 border-white ${
                mode === 'calc' 
                  ? 'bg-white text-black' 
                  : 'bg-black text-white hover:bg-gray-900'
              }`}
            >
              CALCULATOR
            </button>
            <button
              onClick={() => setMode('string')}
              className={`flex-1 py-3 px-4 rounded font-bold transition-all border-2 border-white ${
                mode === 'string' 
                  ? 'bg-white text-black' 
                  : 'bg-black text-white hover:bg-gray-900'
              }`}
            >
              STRING TOOLS
            </button>
          </div>

          <div className="p-6">
            {mode === 'calc' ? (
              <>
                {/* Calculator Display */}
                <div className="bg-black rounded border-2 border-white p-6 mb-6">
                  <div className="text-right text-4xl text-white font-mono break-all min-h-[48px] flex items-center justify-end">
                    {display}
                  </div>
                </div>

                {/* Calculator Buttons */}
                <div className="grid grid-cols-5 gap-2">
                  {/* Scientific Functions Row 1 */}
                  <CalcButton value="sin" onClick={() => handleScientific('sin')} className="bg-gray-800 text-white border-2 border-white hover:bg-gray-700" />
                  <CalcButton value="cos" onClick={() => handleScientific('cos')} className="bg-gray-800 text-white border-2 border-white hover:bg-gray-700" />
                  <CalcButton value="tan" onClick={() => handleScientific('tan')} className="bg-gray-800 text-white border-2 border-white hover:bg-gray-700" />
                  <CalcButton value="log" onClick={() => handleScientific('log')} className="bg-gray-800 text-white border-2 border-white hover:bg-gray-700" />
                  <CalcButton value="ln" onClick={() => handleScientific('ln')} className="bg-gray-800 text-white border-2 border-white hover:bg-gray-700" />

                  {/* Scientific Functions Row 2 */}
                  <CalcButton value="√" onClick={() => handleScientific('sqrt')} className="bg-gray-800 text-white border-2 border-white hover:bg-gray-700" />
                  <CalcButton value="x²" onClick={() => handleScientific('square')} className="bg-gray-800 text-white border-2 border-white hover:bg-gray-700" />
                  <CalcButton value="x³" onClick={() => handleScientific('cube')} className="bg-gray-800 text-white border-2 border-white hover:bg-gray-700" />
                  <CalcButton value="1/x" onClick={() => handleScientific('inv')} className="bg-gray-800 text-white border-2 border-white hover:bg-gray-700" />
                  <CalcButton value="n!" onClick={() => handleScientific('fact')} className="bg-gray-800 text-white border-2 border-white hover:bg-gray-700" />

                  {/* Control Buttons */}
                  <CalcButton value="C" onClick={clear} className="bg-black text-white border-2 border-white hover:bg-gray-900" />
                  <CalcButton value="⌫" onClick={deleteLast} className="bg-black text-white border-2 border-white hover:bg-gray-900" />
                  <CalcButton value="(" onClick={() => handleOperator('(')} className="bg-black text-white border-2 border-white hover:bg-gray-900" />
                  <CalcButton value=")" onClick={() => handleOperator(')')} className="bg-black text-white border-2 border-white hover:bg-gray-900" />
                  <CalcButton value="÷" onClick={() => handleOperator('÷')} className="bg-black text-white border-2 border-white hover:bg-gray-900" />

                  {/* Number Pad */}
                  <CalcButton value="7" onClick={() => handleNumber('7')} className="bg-black text-white border-2 border-white hover:bg-gray-900" />
                  <CalcButton value="8" onClick={() => handleNumber('8')} className="bg-black text-white border-2 border-white hover:bg-gray-900" />
                  <CalcButton value="9" onClick={() => handleNumber('9')} className="bg-black text-white border-2 border-white hover:bg-gray-900" />
                  <CalcButton value="×" onClick={() => handleOperator('×')} className="bg-black text-white border-2 border-white hover:bg-gray-900" />
                  <CalcButton value="π" onClick={() => handleNumber(Math.PI.toString())} className="bg-gray-800 text-white border-2 border-white hover:bg-gray-700" />

                  <CalcButton value="4" onClick={() => handleNumber('4')} className="bg-black text-white border-2 border-white hover:bg-gray-900" />
                  <CalcButton value="5" onClick={() => handleNumber('5')} className="bg-black text-white border-2 border-white hover:bg-gray-900" />
                  <CalcButton value="6" onClick={() => handleNumber('6')} className="bg-black text-white border-2 border-white hover:bg-gray-900" />
                  <CalcButton value="-" onClick={() => handleOperator('-')} className="bg-black text-white border-2 border-white hover:bg-gray-900" />
                  <CalcButton value="e" onClick={() => handleNumber(Math.E.toString())} className="bg-gray-800 text-white border-2 border-white hover:bg-gray-700" />

                  <CalcButton value="1" onClick={() => handleNumber('1')} className="bg-black text-white border-2 border-white hover:bg-gray-900" />
                  <CalcButton value="2" onClick={() => handleNumber('2')} className="bg-black text-white border-2 border-white hover:bg-gray-900" />
                  <CalcButton value="3" onClick={() => handleNumber('3')} className="bg-black text-white border-2 border-white hover:bg-gray-900" />
                  <CalcButton value="+" onClick={() => handleOperator('+')} className="bg-black text-white border-2 border-white hover:bg-gray-900" />
                  <CalcButton value="^" onClick={() => handleOperator('**')} className="bg-gray-800 text-white border-2 border-white hover:bg-gray-700" />

                  <CalcButton value="0" onClick={() => handleNumber('0')} className="col-span-2 bg-black text-white border-2 border-white hover:bg-gray-900" />
                  <CalcButton value="." onClick={() => handleOperator('.')} className="bg-black text-white border-2 border-white hover:bg-gray-900" />
                  <CalcButton value="=" onClick={calculate} className="col-span-2 bg-white text-black border-2 border-white hover:bg-gray-200 text-lg" />
                </div>
              </>
            ) : (
              <>
                {/* String Operations */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-white mb-2 font-bold text-sm uppercase">String 1:</label>
                    <textarea
                      value={stringInput}
                      onChange={(e) => setStringInput(e.target.value)}
                      className="w-full bg-black border-2 border-white rounded p-3 font-mono text-white resize-none focus:outline-none placeholder-gray-500"
                      rows="2"
                      placeholder="Enter first string..."
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2 font-bold text-sm uppercase">String 2 / Replacement:</label>
                    <textarea
                      value={stringInput2}
                      onChange={(e) => setStringInput2(e.target.value)}
                      className="w-full bg-black border-2 border-white rounded p-3 font-mono text-white resize-none focus:outline-none placeholder-gray-500"
                      rows="2"
                      placeholder="Enter second string..."
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2 font-bold text-sm uppercase">Search Term / Index:</label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-black border-2 border-white rounded p-3 font-mono text-white focus:outline-none placeholder-gray-500"
                      placeholder="For search, replace, split..."
                    />
                  </div>

                  <div className="bg-black border-2 border-white rounded p-4">
                    <h3 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Basic Operations</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => handleStringOperation('length')} className="bg-black border-2 border-white text-white rounded p-2 text-sm font-bold hover:bg-gray-900 transition-all active:scale-95">
                        Length
                      </button>
                      <button onClick={() => handleStringOperation('uppercase')} className="bg-black border-2 border-white text-white rounded p-2 text-sm font-bold hover:bg-gray-900 transition-all active:scale-95">
                        UPPER
                      </button>
                      <button onClick={() => handleStringOperation('lowercase')} className="bg-black border-2 border-white text-white rounded p-2 text-sm font-bold hover:bg-gray-900 transition-all active:scale-95">
                        lower
                      </button>
                      <button onClick={() => handleStringOperation('reverse')} className="bg-black border-2 border-white text-white rounded p-2 text-sm font-bold hover:bg-gray-900 transition-all active:scale-95">
                        Reverse
                      </button>
                      <button onClick={() => handleStringOperation('capitalize')} className="bg-black border-2 border-white text-white rounded p-2 text-sm font-bold hover:bg-gray-900 transition-all active:scale-95">
                        Capitalize
                      </button>
                      <button onClick={() => handleStringOperation('trim')} className="bg-black border-2 border-white text-white rounded p-2 text-sm font-bold hover:bg-gray-900 transition-all active:scale-95">
                        Trim
                      </button>
                    </div>
                  </div>

                  <div className="bg-black border-2 border-white rounded p-4">
                    <h3 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Combine</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => handleStringOperation('concatenate')} className="bg-black border-2 border-white text-white rounded p-2 text-sm font-bold hover:bg-gray-900 transition-all active:scale-95">
                        Concatenate
                      </button>
                      <button onClick={() => handleStringOperation('merge')} className="bg-black border-2 border-white text-white rounded p-2 text-sm font-bold hover:bg-gray-900 transition-all active:scale-95">
                        Merge
                      </button>
                      <button onClick={() => handleStringOperation('compare')} className="bg-black border-2 border-white text-white rounded p-2 text-sm font-bold hover:bg-gray-900 transition-all active:scale-95">
                        Compare
                      </button>
                    </div>
                  </div>

                  <div className="bg-black border-2 border-white rounded p-4">
                    <h3 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Search & Replace</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => handleStringOperation('search')} className="bg-black border-2 border-white text-white rounded p-2 text-sm font-bold hover:bg-gray-900 transition-all active:scale-95">
                        Search
                      </button>
                      <button onClick={() => handleStringOperation('contains')} className="bg-black border-2 border-white text-white rounded p-2 text-sm font-bold hover:bg-gray-900 transition-all active:scale-95">
                        Contains
                      </button>
                      <button onClick={() => handleStringOperation('replace')} className="bg-black border-2 border-white text-white rounded p-2 text-sm font-bold hover:bg-gray-900 transition-all active:scale-95">
                        Replace
                      </button>
                      <button onClick={() => handleStringOperation('split')} className="bg-black border-2 border-white text-white rounded p-2 text-sm font-bold hover:bg-gray-900 transition-all active:scale-95">
                        Split
                      </button>
                      <button onClick={() => handleStringOperation('substring')} className="bg-black border-2 border-white text-white rounded p-2 text-sm font-bold hover:bg-gray-900 transition-all active:scale-95">
                        Substring
                      </button>
                    </div>
                  </div>

                  <div className="bg-black border-2 border-white rounded p-4">
                    <h3 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Analysis</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => handleStringOperation('words')} className="bg-black border-2 border-white text-white rounded p-2 text-sm font-bold hover:bg-gray-900 transition-all active:scale-95">
                        Word Count
                      </button>
                      <button onClick={() => handleStringOperation('vowels')} className="bg-black border-2 border-white text-white rounded p-2 text-sm font-bold hover:bg-gray-900 transition-all active:scale-95">
                        Vowels
                      </button>
                      <button onClick={() => handleStringOperation('consonants')} className="bg-black border-2 border-white text-white rounded p-2 text-sm font-bold hover:bg-gray-900 transition-all active:scale-95">
                        Consonants
                      </button>
                      <button onClick={() => handleStringOperation('palindrome')} className="bg-black border-2 border-white text-white rounded p-2 text-sm font-bold hover:bg-gray-900 transition-all active:scale-95">
                        Palindrome
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white mb-2 font-bold text-sm uppercase">Result:</label>
                    <div className="bg-black text-white rounded p-4 font-mono text-sm min-h-[120px] whitespace-pre-wrap break-all border-2 border-white">
                      {stringResult || 'Results will appear here...'}
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setStringInput('');
                      setStringInput2('');
                      setSearchTerm('');
                      setStringResult('');
                    }}
                    className="w-full bg-white text-black rounded p-3 font-bold border-2 border-white hover:bg-gray-200 transition-all active:scale-95"
                  >
                    CLEAR ALL
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
