   class ScientificCalculator {
            constructor() {
                this.previousOperandElement = document.getElementById('previous-operand');
                this.currentOperandElement = document.getElementById('current-operand');
                this.themeToggle = document.getElementById('theme-toggle');
                this.memory = 0;
                this.clear();
                this.setupEventListeners();
                this.loadThemePreference();
            }
            
            clear() {
                this.currentOperand = '0';
                this.previousOperand = '';
                this.operation = undefined;
                this.shouldResetScreen = false;
                this.updateDisplay();
            }
            
            delete() {
                if (this.currentOperand === '0') return;
                if (this.currentOperand.length === 1) {
                    this.currentOperand = '0';
                } else {
                    this.currentOperand = this.currentOperand.slice(0, -1);
                }
                this.updateDisplay();
            }
            
            appendNumber(number) {
                if (this.shouldResetScreen) {
                    this.currentOperand = '';
                    this.shouldResetScreen = false;
                }
                
                if (number === '.' && this.currentOperand.includes('.')) return;
                if (this.currentOperand === '0' && number !== '.') {
                    this.currentOperand = number;
                } else {
                    this.currentOperand += number;
                }
                this.updateDisplay();
            }
            
            chooseOperation(operation) {
                if (this.currentOperand === '') return;
                if (this.previousOperand !== '') {
                    this.calculate();
                }
                
                this.operation = operation;
                this.previousOperand = this.currentOperand;
                this.currentOperand = '';
                this.updateDisplay();
            }
            
            calculate() {
                let computation;
                const prev = parseFloat(this.previousOperand);
                const current = parseFloat(this.currentOperand);
                
                if (isNaN(prev) || isNaN(current)) return;
                
                switch (this.operation) {
                    case 'add':
                        computation = prev + current;
                        break;
                    case 'subtract':
                        computation = prev - current;
                        break;
                    case 'multiply':
                        computation = prev * current;
                        break;
                    case 'divide':
                        if (current === 0) {
                            computation = 'Error';
                        } else {
                            computation = prev / current;
                        }
                        break;
                    case 'power':
                        computation = Math.pow(prev, current);
                        break;
                    default:
                        return;
                }
                
                this.currentOperand = computation.toString();
                this.operation = undefined;
                this.previousOperand = '';
                this.shouldResetScreen = true;
                this.updateDisplay();
            }
            
            scientificOperation(operation) {
                const current = parseFloat(this.currentOperand);
                if (isNaN(current)) return;
                
                let result;
                
                switch (operation) {
                    case 'square':
                        result = current * current;
                        break;
                    case 'cube':
                        result = current * current * current;
                        break;
                    case 'sqrt':
                        if (current < 0) {
                            result = 'Error';
                        } else {
                            result = Math.sqrt(current);
                        }
                        break;
                    case 'percent':
                        result = current / 100;
                        break;
                    case 'sin':
                        result = Math.sin(current * Math.PI / 180); // degrees to radians
                        break;
                    case 'cos':
                        result = Math.cos(current * Math.PI / 180);
                        break;
                    case 'tan':
                        result = Math.tan(current * Math.PI / 180);
                        break;
                    case 'log':
                        if (current <= 0) {
                            result = 'Error';
                        } else {
                            result = Math.log10(current);
                        }
                        break;
                    case 'ln':
                        if (current <= 0) {
                            result = 'Error';
                        } else {
                            result = Math.log(current);
                        }
                        break;
                    case 'factorial':
                        if (current < 0 || !Number.isInteger(current)) {
                            result = 'Error';
                        } else {
                            result = this.factorial(current);
                        }
                        break;
                    case 'reciprocal':
                        if (current === 0) {
                            result = 'Error';
                        } else {
                            result = 1 / current;
                        }
                        break;
                    case 'pi':
                        result = Math.PI;
                        break;
                    case 'e':
                        result = Math.E;
                        break;
                    case 'toggle-sign':
                        result = -current;
                        break;
                    default:
                        return;
                }
                
                this.currentOperand = result.toString();
                this.shouldResetScreen = true;
                this.updateDisplay();
            }
            
            factorial(n) {
                if (n === 0 || n === 1) return 1;
                let result = 1;
                for (let i = 2; i <= n; i++) {
                    result *= i;
                }
                return result;
            }
            
            memoryOperation(operation) {
                const current = parseFloat(this.currentOperand);
                
                switch (operation) {
                    case 'memory-clear':
                        this.memory = 0;
                        break;
                    case 'memory-recall':
                        this.currentOperand = this.memory.toString();
                        this.shouldResetScreen = true;
                        break;
                    case 'memory-add':
                        if (!isNaN(current)) {
                            this.memory += current;
                        }
                        break;
                    case 'memory-subtract':
                        if (!isNaN(current)) {
                            this.memory -= current;
                        }
                        break;
                }
                this.updateDisplay();
            }
            
            getDisplayNumber(number) {
                if (number === 'Error') return number;
                if (number === undefined) return '';
                
                const stringNumber = number.toString();
                if (stringNumber.includes('e')) {
                    return number.toExponential(5);
                }
                
                const integerDigits = parseFloat(stringNumber.split('.')[0]);
                const decimalDigits = stringNumber.split('.')[1];
                
                let integerDisplay;
                if (isNaN(integerDigits)) {
                    integerDisplay = '';
                } else {
                    integerDisplay = integerDigits.toLocaleString('id-ID', {
                        maximumFractionDigits: 0
                    });
                }
                
                if (decimalDigits != null) {
                    return `${integerDisplay}.${decimalDigits}`;
                } else {
                    return integerDisplay;
                }
            }
            
            updateDisplay() {
                this.currentOperandElement.textContent = this.getDisplayNumber(this.currentOperand);
                this.currentOperandElement.classList.add('display-update');
                
                setTimeout(() => {
                    this.currentOperandElement.classList.remove('display-update');
                }, 200);
                
                if (this.operation != null) {
                    const operationSymbol = this.getOperationSymbol(this.operation);
                    this.previousOperandElement.textContent = 
                        `${this.getDisplayNumber(this.previousOperand)} ${operationSymbol}`;
                } else {
                    this.previousOperandElement.textContent = '';
                }
            }
            
            getOperationSymbol(operation) {
                switch (operation) {
                    case 'add': return '+';
                    case 'subtract': return '-';
                    case 'multiply': return '×';
                    case 'divide': return '÷';
                    case 'power': return '^';
                    default: return '';
                }
            }
            
            toggleTheme() {
                const currentTheme = document.body.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                document.body.setAttribute('data-theme', newTheme);
                localStorage.setItem('calculator-theme', newTheme);
            }
            
            loadThemePreference() {
                const savedTheme = localStorage.getItem('calculator-theme');
                if (savedTheme) {
                    document.body.setAttribute('data-theme', savedTheme);
                }
            }
            
            setupEventListeners() {
                document.querySelectorAll('[data-number]').forEach(button => {
                    button.addEventListener('click', () => {
                        this.appendNumber(button.getAttribute('data-number'));
                    });
                });
                
                document.querySelectorAll('[data-action]').forEach(button => {
                    const action = button.getAttribute('data-action');
                    
                    button.addEventListener('click', () => {
                        switch (action) {
                            case 'clear':
                                this.clear();
                                break;
                            case 'delete':
                                this.delete();
                                break;
                            case 'add':
                            case 'subtract':
                            case 'multiply':
                            case 'divide':
                            case 'power':
                                this.chooseOperation(action);
                                break;
                            case 'calculate':
                                this.calculate();
                                break;
                            case 'decimal':
                                this.appendNumber('.');
                                break;
                            case 'memory-clear':
                            case 'memory-recall':
                            case 'memory-add':
                            case 'memory-subtract':
                                this.memoryOperation(action);
                                break;
                            default:
                                this.scientificOperation(action);
                                break;
                        }
                    });
                });
                
                this.themeToggle.addEventListener('click', () => {
                    this.toggleTheme();
                });
                
                document.addEventListener('keydown', (e) => {
                    if (/[0-9]/.test(e.key)) {
                        this.appendNumber(e.key);
                    } else if (e.key === '.') {
                        this.appendNumber('.');
                    } else if (e.key === '+' || e.key === '-') {
                        this.chooseOperation(e.key === '+' ? 'add' : 'subtract');
                    } else if (e.key === '*' || e.key === 'x') {
                        this.chooseOperation('multiply');
                    } else if (e.key === '/') {
                        this.chooseOperation('divide');
                    } else if (e.key === '^') {
                        this.chooseOperation('power');
                    } else if (e.key === 'Enter' || e.key === '=') {
                        e.preventDefault();
                        this.calculate();
                    } else if (e.key === 'Backspace') {
                        this.delete();
                    } else if (e.key === 'Escape') {
                        this.clear();
                    } else if (e.key === 'm' || e.key === 'M') {
                        if (e.ctrlKey) this.memoryOperation('memory-clear');
                    }
                });
            }
        }
        
        const calculator = new ScientificCalculator();