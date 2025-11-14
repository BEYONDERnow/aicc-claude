# CLAUDE.md - AI Assistant Development Guide

**AI Compliance Checker v2.10.4**
**Last Updated:** 2025-11-14
**Purpose:** Comprehensive guide for AI assistants working on this codebase

---

## 🎯 Project Overview

**AI Compliance Checker** is a Chrome browser extension (Manifest V3) that provides real-time privacy compliance checking for AI platforms (ChatGPT, Claude, Gemini). It detects sensitive data in user inputs using a hybrid approach: pattern-based detection (regex) + ML-quality Named Entity Recognition (Compromise.js).

**Key Characteristics:**
- 100% local processing (GDPR/DSG compliant)
- No external API calls for data processing
- ~93% accuracy (critical: 100%, warnings: ~87%)
- 6 entity types: Names, Dates, Places, Money, Organizations + Critical data
- Real-time analysis with debouncing (300-800ms)
- Inline highlighting + warning modals

---

## 🤖 AI Assistant Behavior Guidelines

### Professional Profile

You are a professional developer with decades of experience in Chrome extension development. You possess deep knowledge in:
- Software architecture and design patterns
- Performance optimization and best practices
- UX design for broad target audiences
- Manifest V3 Chrome Extensions
- Security and privacy-by-design principles

### Communication Style

**Language:**
- **Primary: Deutsch** - Project language is German (comments/docs can be EN/DE mixed)
- Use technical precision and professional tone
- No unnecessary superlatives or filler words

**Interaction Style:**
- **Technically rigorous** - Advisory and precise
- **Clear sentences** - No unnecessary explanations or placeholders
- **Proactive but not intrusive** - Make suggestions, but let user decide
- **Ask when uncertain** - Better to clarify than assume

### Working Methodology

**Follow this 5-step process for every task:**

#### 1. **Ziel klären (Clarify Goal)**
- Briefly describe the goal and purpose of the change or response
- Understand user requirements before starting
- Identify success criteria

#### 2. **Plan erstellen (Create Plan)**
- Describe architecture, affected files, and approach
- Use TodoWrite to track all steps
- Identify potential risks or breaking changes

#### 3. **Implementieren (Implement)**
- Proceed step by step
- Before each step, verify assumptions are correct
- Check for logical, structural, or security-related errors
- Read files before editing (always use Read tool first)

#### 4. **Holistischer Check (Holistic Check)**
- Review UX, security, performance, and compatibility
- No isolated fixes - validate every change in overall context
- Test on multiple platforms (ChatGPT, Claude, Gemini)
- Check browser console for errors

#### 5. **Readme und Changelog (Documentation)**
- Describe changes in CHANGELOG.md (Keep a Changelog format)
- Summarize for users in README.md (details in parentheses)
- Update version everywhere (manifest, package.json, popup, etc.)
- Use `npm run version:*` for automated version management

### Development Best Practices

#### Security

**Input Validation:**
- Validate all inputs before processing or storing
- Sanitize user input before displaying in UI
- Use `textContent` instead of `innerHTML` for user data
- Never trust external data sources

**Message Security:**
- Verify message origins for authenticity
- Use structured message types with validation
- Implement CSP (Content Security Policy) compliance

**Secrets Management:**
- Never commit API keys, tokens, or credentials
- Use empty defaults in config.js
- Document how users should add their own keys
- Check .gitignore before committing

**Code Examples:**
```javascript
// ✅ GOOD: Sanitize user input
function sanitizeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;  // Auto-escapes HTML
  return div.innerHTML;
}

// ❌ BAD: XSS vulnerability
element.innerHTML = userInput;

// ✅ GOOD: Validate message origin
chrome.runtime.onMessage.addListener((message, sender) => {
  if (!sender.id || sender.id !== chrome.runtime.id) {
    return; // Reject external messages
  }
  // Process message
});
```

#### Performance

**Event Handling:**
- Avoid polling loops, use events and listeners
- Implement debounce/throttle for frequent events
- Use MutationObserver for DOM changes (not setInterval)

**Resource Loading:**
- Implement lazy loading for resources and modules
- Load heavy libraries only when needed
- Use dynamic imports for code splitting

**Data Storage:**
- Store data efficiently with `chrome.storage.local` instead of global variables
- Use WeakMap for element-associated data (automatic garbage collection)
- Clear unused data to prevent memory leaks

**Code Examples:**
```javascript
// ✅ GOOD: Debounced input handler
const debouncedAnalyze = debounce((text) => {
  analyze(text);
}, text.length > 5000 ? 800 : 300);

// ❌ BAD: Polling loop
setInterval(() => checkElement(), 100);

// ✅ GOOD: MutationObserver
const observer = new MutationObserver(() => {
  findAndMonitorInputs();
});
observer.observe(document.body, { childList: true, subtree: true });
```

#### Stability

**Error Handling:**
- Catch all asynchronous errors with `try/catch`
- Provide fallback values for failed operations
- Log errors with context information
- Never let unhandled promises fail silently

**Resilience:**
- Implement retry mechanisms with exponential backoff
- Define timeouts for all external calls
- Use structured logs with clear error messages
- Add feature flags for critical functions (enable easy rollbacks)

**Defensive Programming:**
- Check for `null`/`undefined` before accessing properties
- Validate chrome API availability before use
- Handle edge cases explicitly
- Document assumptions in comments

**Code Examples:**
```javascript
// ✅ GOOD: Error handling with fallback
async function getSetting(key) {
  try {
    if (!chrome?.storage?.local) {
      console.warn('[AICC] chrome.storage not available');
      return DEFAULT_VALUE;
    }
    const result = await chrome.storage.local.get(key);
    return result[key] ?? DEFAULT_VALUE;
  } catch (error) {
    console.error('[AICC] Storage error:', error);
    return DEFAULT_VALUE;
  }
}

// ✅ GOOD: Retry with exponential backoff
async function pushWithRetry(branch, maxRetries = 4) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await git.push('origin', branch);
      return true;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s, 8s
      await sleep(delay);
    }
  }
}
```

### Data Detection Criteria

**This extension must detect the following sensitive data types:**

#### Personal Data (GDPR Art. 4)
- Full name (Vollständiger Name)
- Address (Adresse)
- Date of birth (Geburtsdatum)
- Social security number (AHV-/Sozialversicherungsnummer)
- Phone number (Telefonnummer)
- Email address (E-Mail-Adresse)
- Photo ID number (Ausweisnummer)
- ID card photo (Foto eines Ausweises)
- Signature (Unterschrift)

#### Financial Data
- Bank account number (Kontonummer)
- Credit card number (Kreditkartennummer)
- IBAN
- Financial figures (Finanzzahlen: CHF, €, $, £)
- Revenue (Umsätze)
- Salaries (Löhne)
- Pricing strategies (Preisstrategien)

#### Access Credentials
- Login credentials (Login-Daten)
- Passwords (Passwörter)
- Tokens
- API Keys
- System access credentials (Zugangsdaten zu Systemen)
- API access credentials (Zugangsdaten zu APIs)

#### Location Data
- Location data (Standortdaten)
- Geodata (Geodaten)

#### Health Data (GDPR Art. 9 - Special Categories)
- Health information (Gesundheitsdaten)
- Diagnoses (Diagnosen)
- Medications (Medikationen)
- Test results (Testergebnisse)
- Genetic data (Genetische Daten)

#### Biometric Data (GDPR Art. 9)
- Biometric data (Biometrische Daten)
- Fingerprint (Fingerabdruck)
- Face scan (Gesichtsscan)

#### Sensitive Personal Data (GDPR Art. 9)
- Political opinions (Politische Meinungen)
- Religious beliefs (Religiöse Überzeugungen)
- Philosophical beliefs (Weltanschauliche Überzeugungen)
- Trade union membership (Gewerkschaftszugehörigkeit)
- Sexual orientation (Sexuelle Orientierung)
- Details about sex life (Details zum Sexualleben)
- Criminal records (Strafrechtlich relevante Informationen)

#### Confidential Business Data
- Customer data (Kundendaten)
- Internal documents (Interne Dokumente)
- Contract contents (Vertragsinhalte)
- Unpublished products (Nicht veröffentlichte Produkte)

### Project-Specific Rules

#### Git Workflow

**Branch Naming (CRITICAL):**
```bash
# MUST follow this pattern or push fails with 403
claude/<feature-name>-<session-id>

# Example:
claude/claude-md-mhz0dc8tsb2tektm-01E9gauScnM2aUNY5qYFvNhd
```

**Push Requirements:**
```bash
# Always use -u flag for first push
git push -u origin <branch-name>

# Implement retry logic for network errors
# Max 4 retries with exponential backoff: 2s, 4s, 8s, 16s
```

**Forbidden Git Actions:**
- ❌ Never use `--no-verify` (skips hooks)
- ❌ Never force push to main/master
- ❌ Never use `--amend` without checking authorship
- ❌ Never push directly to main/master

#### Version Management

**Always use automated scripts:**
```bash
npm run version:patch   # Bugfixes: 2.10.4 → 2.10.5
npm run version:minor   # Features: 2.10.4 → 2.11.0
npm run version:major   # Breaking: 2.10.4 → 3.0.0
```

**What gets updated automatically:**
1. `extension/manifest.json`
2. `package.json`
3. `extension/popup.html`
4. `extension/scripts/version.js`
5. `README.md`
6. `extension/scripts/content.js`

#### Pre-Commit Checklist

Before committing code changes:
- [ ] `npm run build` successful
- [ ] Tested on chrome://extensions/ (reload extension)
- [ ] Tested on at least 2 AI platforms (ChatGPT, Claude, or Gemini)
- [ ] Browser console shows no errors
- [ ] Version updated if needed (`npm run version:*`)
- [ ] CHANGELOG.md updated with detailed changes
- [ ] README.md updated if user-facing changes
- [ ] All TodoWrite tasks marked as completed

#### Decision Framework

**Proceed Autonomously:**
- ✅ Quick bug fixes (typos, obvious errors)
- ✅ Adding detection patterns (well-defined)
- ✅ Documentation updates
- ✅ Code formatting/style improvements
- ✅ Performance optimizations (non-breaking)

**Ask User First:**
- ⚠️ Breaking changes to API/architecture
- ⚠️ Major UX changes
- ⚠️ New dependencies
- ⚠️ Changes to build system
- ⚠️ Modifying .gitignore
- ⚠️ Anything security-related

**Absolutely Forbidden (Never Do):**
- 🚫 Skip git hooks
- 🚫 Force push to main/master
- 🚫 Commit secrets/tokens/API keys
- 🚫 Create markdown docs without request
- 🚫 Modify privacy/data handling without explicit approval
- 🚫 Deploy without testing

---

## 📁 Codebase Structure

```
aicc-claude/
├── extension/                          # Main extension directory
│   ├── manifest.json                   # Chrome Extension config (Manifest V3)
│   ├── background.js                   # Service worker (screenshot capture)
│   ├── popup.html/popup.js             # Extension popup UI
│   │
│   ├── scripts/                        # Core JavaScript modules
│   │   ├── detector.js                 # ⭐ Detection engine (patterns + NER integration)
│   │   ├── compromise-ner.js           # ⭐ NER wrapper for Compromise.js
│   │   ├── content.js                  # ⭐ DOM monitoring & UI management
│   │   ├── version.js                  # Central version source of truth
│   │   ├── config.js                   # GitHub feedback config (optional)
│   │   ├── github-feedback.js          # GitHub issue submission
│   │   ├── feedback-modal.js           # Feedback form UI
│   │   ├── screenshot-capture.js       # Screenshot utility (deprecated in v2.10.4)
│   │   ├── names-lexicon.js            # 6600+ name database (fallback)
│   │   ├── enhanced-ner.js             # Legacy NER (deprecated v2.5.0+)
│   │   └── german-nouns.js             # German noun filtering
│   │
│   ├── styles/
│   │   ├── content.css                 # Main UI styling (27KB)
│   │   ├── feedback.css                # Feedback modal styling (11KB)
│   │   └── fonts.css                   # Font imports
│   │
│   ├── dist/
│   │   └── detector.bundle.js          # Rollup bundled output (~342KB)
│   │
│   ├── icons/                          # Extension icons (16/48/128px)
│   └── fonts/                          # Montserrat & Poppins (TTF files gitignored)
│
├── scripts/
│   └── update-version.js               # ⭐ Automated version management
│
├── rollup.config.js                    # ⭐ Build configuration
├── package.json                        # Dependencies & npm scripts
├── .gitignore
│
└── Documentation/
    ├── README.md                       # User-facing documentation
    ├── CHANGELOG.md                    # Keep a Changelog format
    ├── ERKANNTE_DATEN.md               # Complete list of detected data types
    ├── GITHUB_APP_SETUP.md             # GitHub App setup for feedback
    └── CLAUDE.md                       # This file (AI assistant guide)
```

**⭐ = Critical files you'll most frequently modify**

---

## 🏗️ Architecture & Data Flow

### Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    UI Layer                              │
│  • Popup (popup.html/js) - Settings                     │
│  • Inline Icons - Status indicators                     │
│  • Warning Modals - Pre-submission alerts               │
│  • Feedback Modal - GitHub issue submission             │
└─────────────────────────────────────────────────────────┘
                          ↓ ↑
┌─────────────────────────────────────────────────────────┐
│            Content Script (content.js)                   │
│  • ComplianceMonitor class                              │
│  • Platform detection (ChatGPT/Claude/Gemini)           │
│  • DOM monitoring (MutationObserver)                    │
│  • Event handlers (input/paste/keydown)                 │
│  • Overlay creation & highlighting                      │
│  • Submit interception & modal display                  │
└─────────────────────────────────────────────────────────┘
                          ↓ ↑
┌─────────────────────────────────────────────────────────┐
│          Detection Engine (detector.js)                  │
│  • ComplianceDetector class                             │
│  • Pattern-based detection (15+ patterns)               │
│  • NER integration (via compromise-ner.js)              │
│  • Severity classification (critical/warning/safe)      │
│  • Position tracking for highlighting                   │
│  • i18n support (DE/EN)                                 │
└─────────────────────────────────────────────────────────┘
                          ↓ ↑
┌─────────────────────────────────────────────────────────┐
│            NER Engine (compromise-ner.js)                │
│  • CompromiseNER class                                  │
│  • Compromise.js v14.14.4 wrapper                       │
│  • Named entity extraction (people/dates/places/etc.)   │
│  • Context-aware detection                              │
│  • Stopword & false-positive filtering                  │
└─────────────────────────────────────────────────────────┘
```

### Real-Time Analysis Flow

```
User Input (typing/paste)
    ↓
content.js: handleInput()
    ↓
debounce(300-800ms based on text length)
    ↓
content.js: analyzeElement()
    ↓
detector.js: analyze(text, lang)
    ├─→ Pattern Detection Loop
    │   ├─ Email, IBAN, Credit Cards
    │   ├─ Phone, Postal Codes, IPs
    │   └─ Passwords, API Keys
    │
    └─→ NER Integration
        ├─ compromise-ner.js: detectAll()
        │   ├─ Names (.people())
        │   ├─ Dates (.dates())
        │   ├─ Places (.places())
        │   ├─ Money (.money())
        │   └─ Organizations (.organizations())
        │
        └─ Filter & merge results
    ↓
Return: { status, detections, highlightRanges }
    ↓
content.js: Update UI
    ├─ updateStatusIcon()
    ├─ highlightText()
    └─ Store in currentAnalysis WeakMap
```

### Submission Blocking Flow

```
User presses Enter / Clicks Submit
    ↓
content.js: handleKeyDown() / attachSubmitButtonHandler()
    ↓
Check: analysis.status === 'critical' or 'warning'?
    ├─ YES → preventDefault() + showWarningModal()
    │         ├─ Render detection table
    │         ├─ Show validation report (if developer mode)
    │         └─ User choice:
    │             ├─ Cancel → refocus input
    │             └─ Send Anyway → simulateSubmit()
    │
    └─ NO (safe) → Allow normal submission
```

---

## 🔧 Key Technologies & Dependencies

### Runtime Dependencies

```json
{
  "compromise": "^14.14.4"  // NER engine (~284KB)
}
```

**Why Compromise.js?**
- ML-quality NER without ML dependencies
- Context-aware name detection ("Ich traf Maria" → recognizes "Maria")
- Multi-language support (DE/EN/FR/IT)
- No training required, works out-of-the-box
- Active maintenance (last update: Jan 2025)

### Build Dependencies

```json
{
  "@rollup/plugin-commonjs": "^25.0.7",
  "@rollup/plugin-node-resolve": "^15.2.3",
  "@rollup/plugin-terser": "^0.4.4",
  "rollup": "^4.9.6"
}
```

### Build System (Rollup)

**Configuration:** `rollup.config.js`

```javascript
// Input: extension/scripts/detector.js
// Output: extension/dist/detector.bundle.js (IIFE format)
// Plugins: nodeResolve, commonjs, terser
```

**Build Commands:**
```bash
npm run build       # One-time production build
npm run watch       # Auto-rebuild on changes (dev mode)
npm run dev         # Alias for watch
```

**Bundle Output:**
- Format: IIFE (Immediately Invoked Function Expression)
- Size: ~342KB (minified)
- Sourcemap: Disabled
- Console logs: Preserved (debugging)

---

## 🚀 Development Workflows

### 1. Version Management (Automated)

**Central Version Source:** `extension/scripts/version.js`

```javascript
export const VERSION = '2.10.4';
export const VERSION_LABEL = 'BETA';
```

**Version Update Commands:**
```bash
npm run version:patch   # Bugfixes:        2.10.4 → 2.10.5
npm run version:minor   # New features:    2.10.4 → 2.11.0
npm run version:major   # Breaking changes: 2.10.4 → 3.0.0
npm run version:sync    # Sync current version (no bump)
```

**What Gets Updated Automatically:**
1. `extension/manifest.json` - Chrome Extension version
2. `package.json` - NPM package version
3. `extension/popup.html` - Displayed version string
4. `extension/scripts/version.js` - Source of truth
5. `README.md` - Documentation version
6. `extension/scripts/content.js` - Validation report version

**Version Script Features:**
- ✅ Semantic versioning (SemVer 2.0)
- ✅ Colored console output
- ✅ Shows changed files with line numbers
- ✅ Suggests next steps (build, commit, push)
- ✅ Creates Git tags automatically

**Typical Version Workflow:**
```bash
# 1. Update version
npm run version:minor

# 2. Build extension
npm run build

# 3. Commit changes
git add -A
git commit -m "chore: bump version to 2.11.0"

# 4. Push to remote
git push origin <your-branch>
```

### 2. Feature Development Workflow

**Step-by-Step Process:**

```bash
# 1. Ensure you're on the correct branch
git status  # Should be on claude/claude-md-mhz0dc8tsb2tektm-01E9gauScnM2aUNY5qYFvNhd

# 2. Install dependencies (if first time)
npm install

# 3. Start watch mode for auto-rebuild
npm run watch

# 4. Make changes to source files
# - detector.js: Add/modify detection patterns
# - compromise-ner.js: Improve NER filtering
# - content.js: Update UI/UX behavior

# 5. Test in Chrome
# - Open chrome://extensions/
# - Click "Reload" on AI Compliance Checker
# - Test on ChatGPT/Claude/Gemini

# 6. Update documentation if needed
# - README.md: User-facing features
# - CHANGELOG.md: Detailed change log (follow Keep a Changelog)
# - CLAUDE.md: Architecture changes

# 7. Commit with conventional commits
git add -A
git commit -m "feat: add Swiss passport detection pattern"

# 8. Push to remote
git push -u origin claude/claude-md-mhz0dc8tsb2tektm-01E9gauScnM2aUNY5qYFvNhd
```

### 3. Adding New Detection Patterns

**Location:** `extension/scripts/detector.js` → `initializePatterns()` method

**Pattern Structure:**
```javascript
{
  id: 'pattern_id',                     // Unique identifier
  pattern: /regex-pattern/g,            // JavaScript regex
  severity: 'critical' | 'warning',     // Risk level
  category: 'contact' | 'financial' | 'personal' | 'confidential',
  nameDE: 'Deutsche Bezeichnung',
  nameEN: 'English Name',
  descDE: 'Beschreibung auf Deutsch',
  descEN: 'Description in English',
  customValidator: (match, detector) => {  // Optional
    // Custom validation logic
    return true; // false = ignore this match
  }
}
```

**Example - Adding Swiss Passport Pattern:**

```javascript
// In detector.js, add to patterns array:
{
  id: 'swiss_passport',
  pattern: /\bCH[A-Z0-9]{7}\b/g,
  severity: 'critical',
  category: 'personal',
  nameDE: 'Schweizer Reisepass',
  nameEN: 'Swiss Passport',
  descDE: 'Schweizer Reisepassnummer (CHxxxxxxx)',
  descEN: 'Swiss passport number (CHxxxxxxx)',
  customValidator: (match) => {
    // Optional: Validate checksum or format
    return match.length === 9;
  }
}
```

**Best Practices:**
- ✅ Use word boundaries (`\b`) to avoid partial matches
- ✅ Test with false-positive examples
- ✅ Add to both `nameDE`/`descDE` and `nameEN`/`descEN`
- ✅ Use `customValidator` for complex validation
- ✅ Consider case sensitivity (use `(?i)` for case-insensitive)
- ⚠️ Avoid overly broad patterns (high false-positive rate)

### 4. Improving NER Detection

**Location:** `extension/scripts/compromise-ner.js`

**Common NER Improvements:**

**A. Adding Stopwords/Blacklists**
```javascript
// In detectNames() method:
const STOPWORDS = [
  'HR', 'IT', 'AI', 'CEO',  // Abbreviations
  'GitHub', 'TypeScript',    // Tech terms
  'Monday', 'Tuesday',       // Days
  // Add your stopwords here
];

if (STOPWORDS.includes(text.trim())) {
  return []; // Ignore
}
```

**B. Improving Date Detection (v2.10.3 pattern)**
```javascript
// In detectDates() method:
isValidDateFormat(text) {
  // Common date patterns
  const datePatterns = [
    /^\d{1,2}\.\d{1,2}\.\d{4}$/,  // DD.MM.YYYY
    /^\d{4}-\d{2}-\d{2}$/,        // YYYY-MM-DD
    /^\d{1,2}\/\d{1,2}\/\d{4}$/,  // MM/DD/YYYY
  ];
  return datePatterns.some(p => p.test(text));
}
```

**C. Adding Organization Whitelist**
```javascript
// Organizations that are NOT sensitive:
const TECH_ORGS = ['GitHub', 'Google', 'Microsoft', 'OpenAI'];
```

### 5. Testing Workflow

**⚠️ NOTE:** This project currently has **no automated tests**.

**Manual Testing Process:**

```bash
# 1. Build extension
npm run build

# 2. Load in Chrome
# - Open chrome://extensions/
# - Enable "Developer mode"
# - Click "Reload" on extension

# 3. Test on each platform
# - ChatGPT: https://chat.openai.com
# - Claude: https://claude.ai
# - Gemini: https://gemini.google.com

# 4. Test cases to cover:
# - ✅ Emails: john@example.com
# - ✅ IBAN: CH93 0076 2011 6238 5295 7
# - ✅ Phone: +41 79 328 70 70
# - ✅ Names: "My name is Hans Peter"
# - ✅ Dates: "Born on 15.03.1985"
# - ✅ Money: "2.5 Millionen CHF"
# - ✅ False positives: "GitHub", "TypeScript", "CEO"

# 5. Check developer console for errors
# - Open DevTools (F12)
# - Check Console tab for errors
# - Should see: "[AI Compliance Checker] v2.10.4..."

# 6. Test developer mode features
# - Click extension icon
# - Toggle "Developer Mode"
# - Check validation report appears
```

**Testing Recommendations for AI Assistants:**
- When adding new patterns, test with 5-10 real-world examples
- Include false-positive test cases (should NOT detect)
- Test on all three platforms (ChatGPT, Claude, Gemini)
- Check browser console for errors
- Verify highlighting positions are correct

### 6. Adding New Platform Support

**Location:** `extension/scripts/content.js` → `detectPlatform()` method

**Example - Adding Perplexity.ai:**

```javascript
// 1. Add host permission to manifest.json
"host_permissions": [
  "https://www.perplexity.ai/*"
]

// 2. Add to content_scripts matches in manifest.json
"matches": [
  "https://www.perplexity.ai/*"
]

// 3. Add platform detection in content.js
detectPlatform() {
  const hostname = window.location.hostname;

  // ... existing platforms ...

  else if (hostname.includes('perplexity.ai')) {
    return {
      name: 'Perplexity',
      inputSelectors: [
        'textarea[placeholder*="Ask"]',
        'div[contenteditable="true"]'
      ],
      submitSelectors: [
        'button[aria-label="Submit"]'
      ]
    };
  }
}

// 4. Test thoroughly on new platform
```

---

## 📐 Code Conventions & Standards

### JavaScript Style

**Modern ES6+ Style:**
- ✅ Use `const`/`let`, never `var`
- ✅ Use arrow functions `() => {}` for callbacks
- ✅ Use template literals `` `string ${var}` ``
- ✅ Use destructuring `{ prop } = object`
- ✅ Use async/await over `.then()` chains
- ✅ Use ES modules `import`/`export`

**Class Structure:**
```javascript
class MyClass {
  constructor() {
    this.property = value;
  }

  // Public methods
  publicMethod() {
    this.#privateMethod();
  }

  // Private methods (prefix with #)
  #privateMethod() {
    // Implementation
  }
}
```

**Error Handling:**
```javascript
// Always use try-catch for async operations
async analyze(text) {
  try {
    const result = await this.detector.detect(text);
    return result;
  } catch (error) {
    console.error('[AI Compliance Checker] Error:', error);
    return this.#getFallbackResult();
  }
}
```

**Console Logging:**
```javascript
// Always prefix with extension name
console.log('[AI Compliance Checker] Message here');
console.error('[AI Compliance Checker] Error:', error);

// Use colors for readability (content.js pattern)
console.log('%c[AI Compliance Checker]', 'color: #667eea; font-weight: bold', 'Message');
```

### Naming Conventions

**Variables & Functions:**
- `camelCase` for variables and functions
- `UPPER_SNAKE_CASE` for constants
- Descriptive names (no abbreviations unless obvious)

```javascript
// Good
const userInputText = element.value;
const MAX_RETRY_COUNT = 3;

function detectEmailAddresses(text) { }

// Bad
const txt = element.value;  // Too short
const maxrc = 3;  // Unclear
function detEmls(t) { }  // Cryptic
```

**Classes:**
- `PascalCase` for class names
- Prefix with noun describing entity

```javascript
class ComplianceDetector { }
class CompromiseNER { }
class FeedbackModal { }
```

**CSS Classes:**
- `kebab-case` for CSS classes
- Prefix with `aicc-` (namespace)

```css
.aicc-overlay { }
.aicc-modal-header { }
.aicc-status-icon { }
```

**File Names:**
- `kebab-case.js` for JavaScript files
- Descriptive, not abbreviated

```
detector.js              ✅ Good
compromise-ner.js        ✅ Good
content.js               ✅ Good
det.js                   ❌ Too short
compNER.js               ❌ Mixed case
```

### Comments & Documentation

**File Headers:**
```javascript
/**
 * AI Compliance Checker - Detection Engine
 *
 * @description Core detection logic using pattern matching and NER
 * @version 2.10.4
 * @author BEYONDER
 */
```

**Function Documentation:**
```javascript
/**
 * Analyzes text for sensitive data
 *
 * @param {string} text - Text to analyze
 * @param {string} lang - Language code (de/en)
 * @returns {Promise<AnalysisResult>} Detection results
 * @throws {Error} If text is invalid
 */
async analyze(text, lang = 'de') {
  // Implementation
}
```

**Inline Comments:**
```javascript
// Purpose: Explain WHY, not WHAT
// Good:
// Prevent detection of Swiss postal code 1980 as birth year
if (isPostalCode(match)) return false;

// Bad:
// Check if postal code
if (isPostalCode(match)) return false;
```

**TODO Comments:**
```javascript
// TODO(feature): Add support for Austrian passport format
// FIXME: False positive for "CEO" detected as name
// NOTE: This regex is intentionally broad (high recall, lower precision)
// HACK: Workaround for Gemini's dynamic textarea loading
```

### Git Conventions

**Branch Naming:**
- Always start with `claude/` prefix (required for push)
- Include session ID suffix
- Format: `claude/feature-name-sessionid`

```bash
# Example (from gitStatus):
claude/claude-md-mhz0dc8tsb2tektm-01E9gauScnM2aUNY5qYFvNhd
```

**Commit Messages (Conventional Commits):**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, no logic change)
- `refactor`: Code restructuring (no feature/fix)
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Build process, dependencies, tooling

**Examples:**
```bash
# Feature
git commit -m "feat(detector): add Swiss passport number detection"

# Bug fix
git commit -m "fix(ner): prevent HR from being detected as date"

# Documentation
git commit -m "docs: update CLAUDE.md with testing workflow"

# Breaking change
git commit -m "feat(detector): migrate to Compromise.js v15

BREAKING CHANGE: Requires Node.js 18+
Old lexicon-based detection removed"

# Chore
git commit -m "chore: bump version to 2.11.0"
```

**Commit Best Practices:**
- ✅ Use imperative mood ("add" not "added")
- ✅ First line ≤ 50 characters
- ✅ Body ≤ 72 characters per line
- ✅ Reference issues: `Fixes #123`
- ⚠️ Commit atomically (one logical change per commit)

**Push Workflow:**
```bash
# Always push to branch starting with 'claude/' and matching session ID
git push -u origin claude/claude-md-mhz0dc8tsb2tektm-01E9gauScnM2aUNY5qYFvNhd

# Retry with exponential backoff on network errors
# (Max 4 retries: 2s, 4s, 8s, 16s)
```

---

## 🔍 Common Tasks for AI Assistants

### Task 1: Add New Detection Pattern

**Scenario:** User requests detection for Swiss license plate numbers

**Steps:**
```javascript
// 1. Add pattern to detector.js
{
  id: 'swiss_license_plate',
  pattern: /\b[A-Z]{2}[\s-]?\d{1,6}\b/gi,
  severity: 'warning',
  category: 'personal',
  nameDE: 'Kennzeichen (CH)',
  nameEN: 'License Plate (CH)',
  descDE: 'Schweizer Fahrzeugkennzeichen (z.B. ZH 123456)',
  descEN: 'Swiss vehicle license plate (e.g. ZH 123456)'
}

// 2. Test with examples:
// - "ZH 123456" ✅ Should detect
// - "AG-45678" ✅ Should detect
// - "AB" ❌ Should NOT detect (too short)

// 3. Update ERKANNTE_DATEN.md
// 4. Add to CHANGELOG.md under next version
// 5. Build & test
npm run build
```

### Task 2: Fix False Positive

**Scenario:** "HR" (Human Resources) falsely detected as birthdate

**Root Cause Analysis:**
```javascript
// compromise-ner.js detectDates() method
// Problem: Short abbreviations matched date patterns

// Solution (v2.10.3):
isDateAbbreviation(text) {
  const abbreviations = [
    'HR', 'IT', 'AI', 'CEO', 'CTO', 'VP',
    'Jr', 'Sr', 'Dr', 'Prof', 'Inc', 'Ltd',
    // ... more abbreviations
  ];
  return abbreviations.includes(text.trim());
}

// Apply filter:
if (this.isDateAbbreviation(match)) {
  continue; // Skip this match
}
```

**Testing:**
```javascript
// Before fix:
"Contact HR department" → ❌ Detects "HR" as date

// After fix:
"Contact HR department" → ✅ No detection
"Born 1985" → ✅ Still detects date
```

### Task 3: Add New Platform Support

**Scenario:** Add support for Microsoft Copilot

**Steps:**
```javascript
// 1. Update manifest.json
{
  "host_permissions": [
    "https://copilot.microsoft.com/*"
  ],
  "content_scripts": [{
    "matches": [
      "https://copilot.microsoft.com/*"
    ]
  }]
}

// 2. Add platform detection in content.js
else if (hostname.includes('copilot.microsoft.com')) {
  return {
    name: 'Copilot',
    inputSelectors: [
      'textarea.copilot-input',
      'div[role="textbox"]'
    ],
    submitSelectors: [
      'button[aria-label*="Send"]'
    ]
  };
}

// 3. Test manually on copilot.microsoft.com
// 4. Update README.md platform list
// 5. Update CHANGELOG.md
```

### Task 4: Improve NER Accuracy

**Scenario:** Reduce false positives for tech terms

**Approach:**
```javascript
// compromise-ner.js

// 1. Expand tech whitelist
const TECH_WHITELIST = [
  // Programming languages
  'JavaScript', 'TypeScript', 'Python', 'Java',

  // Frameworks/Tools
  'React', 'Vue', 'Angular', 'Node',

  // Companies (not sensitive)
  'Google', 'Microsoft', 'Apple',

  // File formats
  'JSON', 'XML', 'CSV', 'PDF'
];

// 2. Add context validation
isValidName(name, context) {
  // Check if preceded by article (indicator for name)
  const hasArticle = /\b(der|die|das|ein|eine)\s+/i.test(context);

  // Check if in tech context
  const techContext = /\b(import|export|from|class|function)\b/.test(context);

  return hasArticle && !techContext;
}

// 3. Test with edge cases
```

### Task 5: Update Version & Release

**Scenario:** Release new minor version (2.10.4 → 2.11.0)

**Workflow:**
```bash
# 1. Update version
npm run version:minor
# Output: Version erhöht: 2.10.4 → 2.11.0
# Automatically updates 6 files + creates git tag

# 2. Manually update CHANGELOG.md
# Add detailed changes under ## [2.11.0] - 2025-11-XX

# 3. Build extension
npm run build

# 4. Test thoroughly
# - Load in chrome://extensions/
# - Test all platforms
# - Verify version shows "2.11.0 BETA" in popup

# 5. Commit & push
git add -A
git commit -m "chore: release v2.11.0

- New feature X
- Bug fix Y
- Performance improvement Z"

git push -u origin claude/claude-md-mhz0dc8tsb2tektm-01E9gauScnM2aUNY5qYFvNhd

# 6. Push git tag (optional)
git push origin v2.11.0
```

---

## 🧪 Testing Strategy

### Current State

**⚠️ No Automated Tests:** This project currently has no unit tests, integration tests, or E2E tests.

### Manual Testing Checklist

**When to Test:**
- After adding new patterns
- After modifying NER logic
- After changing UI/UX
- Before version releases

**Test Matrix:**

| Platform | Input Type | Test Case | Expected Result |
|----------|-----------|-----------|-----------------|
| ChatGPT | Textarea | Email: `john@test.com` | 🔴 Critical detection |
| Claude | ContentEditable | IBAN: `CH93 0076 2011 6238 5295 7` | 🔴 Critical detection |
| Gemini | Rich Textarea | Name: `Hans Peter` | 🟠 Warning (if context) |
| All | All | Tech term: `GitHub` | ✅ No detection |

**Developer Mode Testing:**
```javascript
// 1. Enable developer mode in popup
// 2. Type test text
// 3. Check overlay shows validation report
// 4. Verify report includes:
//    - Annotated prompt ([1:EMAIL], [2:NAME])
//    - Context (±50 chars)
//    - Detection method (Pattern/NER)
//    - Metrics (Precision/Recall/F1)
```

### Recommended Future Tests (for contributors)

**Unit Tests (Vitest/Jest):**
```javascript
// detector.test.js
describe('ComplianceDetector', () => {
  test('detects Swiss IBAN', () => {
    const detector = new ComplianceDetector();
    const result = detector.detectIBAN('CH93 0076 2011 6238 5295 7');
    expect(result).toHaveLength(1);
    expect(result[0].severity).toBe('critical');
  });
});

// compromise-ner.test.js
describe('CompromiseNER', () => {
  test('filters HR abbreviation from dates', () => {
    const ner = new CompromiseNER();
    const result = ner.detectDates('Contact HR department');
    expect(result).toHaveLength(0);
  });
});
```

**E2E Tests (Playwright):**
```javascript
// e2e/chatgpt.spec.js
test('shows warning modal on ChatGPT', async ({ page }) => {
  await page.goto('https://chat.openai.com');
  await page.fill('textarea', 'My email is john@test.com');
  await page.press('textarea', 'Enter');

  // Should show warning modal
  await expect(page.locator('.aicc-modal')).toBeVisible();
  await expect(page.locator('.aicc-modal')).toContainText('E-Mail');
});
```

---

## ⚠️ Common Pitfalls & Gotchas

### 1. Text Extraction from DOM

**Problem:** Using `innerText` vs `textContent`

```javascript
// ❌ BAD: innerText may truncate long content
const text = element.innerText;

// ✅ GOOD: textContent gets full content
const text = element.textContent || element.value;
```

**v2.9.1 Lesson:** Long prompts (>10k chars) were truncated because `innerText` only returns visible/rendered text.

### 2. False Positives from DOM Text Merging

**Problem:** Adjacent block elements merged without spaces

```javascript
// HTML: <div>Arbeits</div><div>tasks</div>
// Bad extraction: "Arbeitstasks" (detected as name!)

// ✅ Solution: Use normalizeTextWithSpaces()
function normalizeTextWithSpaces(element) {
  const blockElements = ['DIV', 'P', 'LI', 'H1', 'H2', 'H3'];

  if (blockElements.includes(element.tagName)) {
    return ' ' + element.textContent + ' ';
  }
  return element.textContent;
}
```

**v2.3.4 Lesson:** ~80% of false positives came from word concatenation.

### 3. Regex Word Boundaries with Special Chars

**Problem:** `\b` doesn't work with `+` or `()`

```javascript
// ❌ BAD: Doesn't match "+41 (0) 79..."
/\b\+41\s*\(0\)\s*\d+/g

// ✅ GOOD: Use lookbehind
/(?<=^|\s)\+41\s*\(0\)\s*\d+/g
```

**v2.1.1 Lesson:** International phone numbers with `+41` were missed.

### 4. Submit Button Detection Timing

**Problem:** Submit buttons may be dynamically added

```javascript
// ❌ BAD: Only checks once
const submitButton = document.querySelector('button.submit');

// ✅ GOOD: Use MutationObserver
this.observer = new MutationObserver(() => {
  this.findAndMonitorInputs();
});
this.observer.observe(document.body, {
  childList: true,
  subtree: true
});
```

### 5. Chrome Storage Undefined Race Condition

**Problem:** `chrome.storage` may be undefined during extension reload

```javascript
// ❌ BAD: Assumes chrome.storage exists
const settings = await chrome.storage.local.get('key');

// ✅ GOOD: Defensive check
async function getSetting(key) {
  try {
    if (!chrome?.storage?.local) {
      console.warn('chrome.storage not available, using default');
      return DEFAULT_VALUE;
    }
    const result = await chrome.storage.local.get(key);
    return result[key] ?? DEFAULT_VALUE;
  } catch (error) {
    console.error('Storage error:', error);
    return DEFAULT_VALUE;
  }
}
```

**v2.9.1 Lesson:** TypeError during extension initialization caused crashes.

### 6. NER Stopword Filtering Timing

**Problem:** Compromise.js may detect stopwords as entities

```javascript
// ❌ BAD: Only filter after detection
const people = nlp(text).people().out('array');

// ✅ GOOD: Pre-filter + post-filter
const people = nlp(text)
  .people()
  .out('array')
  .filter(name => !STOPWORDS.includes(name.trim()));
```

### 7. Debouncing Duration

**Problem:** Fixed debounce delay may be too short/long

```javascript
// ❌ BAD: Fixed delay
const DEBOUNCE_DELAY = 300;

// ✅ GOOD: Dynamic based on text length
const getDebounceDelay = (text) => {
  return text.length > 5000 ? 800 : 300;
};
```

**Performance:** Prevents excessive analysis calls while maintaining responsiveness.

---

## 🔐 Privacy & Security Considerations

### Privacy by Design

**Core Principles:**
1. **100% Local Processing** - No data leaves the browser
2. **No Telemetry** - Zero tracking or analytics
3. **Minimal Permissions** - Only `storage` and `activeTab`
4. **GDPR Compliant** - No personal data collection

**Code Audit Checklist:**
- ✅ No `fetch()` or `XMLHttpRequest` for user data
- ✅ No `chrome.identity` for user login
- ✅ No third-party analytics (Google Analytics, etc.)
- ✅ No background data transmission
- ✅ No localStorage/IndexedDB for sensitive data

**Exception:** GitHub Feedback System
- Requires explicit user opt-in
- Privacy notice displayed prominently
- No automatic data transmission
- User controls what information is shared

### Security Considerations

**Content Security Policy (CSP):**
- Extension follows Manifest V3 CSP
- No inline scripts allowed
- No eval() or Function() constructors
- All code bundled statically

**Input Sanitization:**
```javascript
// When displaying user input in UI
function sanitizeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;  // Auto-escapes HTML
  return div.innerHTML;
}

// Never use innerHTML with user input
element.innerHTML = userInput;  // ❌ XSS risk
element.textContent = userInput;  // ✅ Safe
```

**API Key Storage:**
```javascript
// Never commit API keys
// config.js uses empty defaults
window.GITHUB_CONFIG = {
  token: ''  // User must add manually
};

// .gitignore pattern
extension/scripts/config.js  // Not ignored (default values committed)
# Users use: git update-index --assume-unchanged
```

---

## 📚 Additional Resources

### Documentation Files

- **README.md** - User-facing documentation, features, installation
- **CHANGELOG.md** - Detailed version history (Keep a Changelog format)
- **ERKANNTE_DATEN.md** - Complete list of detected data types
- **GITHUB_APP_SETUP.md** - GitHub App configuration for feedback
- **CLAUDE.md** - This file (AI assistant development guide)

### External Resources

- **Compromise.js Docs:** https://github.com/spencermountain/compromise
- **Chrome Extension Docs:** https://developer.chrome.com/docs/extensions/
- **Manifest V3 Migration:** https://developer.chrome.com/docs/extensions/mv3/
- **Semantic Versioning:** https://semver.org/
- **Keep a Changelog:** https://keepachangelog.com/
- **Conventional Commits:** https://www.conventionalcommits.org/

### Browser DevTools Tips

**Debugging Content Scripts:**
```javascript
// 1. Open DevTools on the target page (F12)
// 2. Go to Console tab
// 3. Select content script context (dropdown at top)
// 4. Check for errors prefixed with [AI Compliance Checker]

// Useful console commands:
window.complianceMonitor  // Access monitor instance (if exposed)
chrome.storage.local.get(console.log)  // View stored settings
```

**Inspecting Extension Popup:**
```javascript
// Right-click extension icon → Inspect popup
// Console will show popup.js logs
```

**Service Worker Debugging:**
```javascript
// Go to chrome://extensions/
// Click "Service worker" link under extension
// Console shows background.js logs
```

---

## 🚨 Emergency Procedures

### Critical Bug in Production

**Scenario:** User reports extension crashes on ChatGPT

**Response Steps:**
```bash
# 1. Reproduce issue locally
# - Load extension in Chrome
# - Navigate to ChatGPT
# - Check console for errors

# 2. Create hotfix branch (if needed)
git checkout -b claude/hotfix-crash-chatgpt-<session-id>

# 3. Fix the issue
# - Identify root cause
# - Apply minimal fix
# - Test thoroughly

# 4. Update version (patch)
npm run version:patch

# 5. Update CHANGELOG.md
## [2.10.5] - 2025-11-14

### 🐛 Critical Hotfix

- **Fixed:** Extension crash on ChatGPT due to null element
- **Affected:** v2.10.4 users on ChatGPT
- **Root cause:** Missing null check in findAndMonitorInputs()

# 6. Build & test
npm run build

# 7. Commit & push
git commit -m "fix(content): add null check for ChatGPT inputs"
git push -u origin <hotfix-branch>
```

### Rollback Procedure

**Scenario:** New version breaks critical functionality

```bash
# 1. Identify last working version
git log --oneline

# 2. Revert to previous version
git revert <bad-commit-hash>

# 3. Update version (patch bump for revert)
npm run version:patch

# 4. Update CHANGELOG.md
## [2.10.6] - 2025-11-14

### ⚠️ Rollback

- **Reverted:** Changes from v2.10.5 due to critical bug
- **Current state:** Restored to v2.10.4 functionality

# 5. Build & push
npm run build
git commit -m "revert: rollback to v2.10.4 functionality"
git push
```

---

## 🤝 Contributing Guidelines

### For AI Assistants

**When working on this codebase:**

1. **Always read relevant docs first**
   - Check README.md for feature context
   - Check CHANGELOG.md for recent changes
   - Check this file (CLAUDE.md) for conventions

2. **Follow the version workflow**
   - Use `npm run version:*` for version bumps
   - Update CHANGELOG.md manually with detailed changes
   - Build before committing (`npm run build`)

3. **Test thoroughly**
   - Manual testing on all three platforms
   - Check console for errors
   - Test edge cases and false positives

4. **Commit atomically**
   - One logical change per commit
   - Use conventional commit messages
   - Reference issues if applicable

5. **Document your changes**
   - Update README.md for user-facing features
   - Update CLAUDE.md for architecture changes
   - Add inline comments for complex logic

6. **Respect privacy principles**
   - No external API calls for user data
   - No data collection/telemetry
   - Keep processing 100% local

### For Human Contributors

**Same as above, plus:**

1. **Open an issue first** for major changes
2. **Follow semantic versioning** strictly
3. **Add tests** if implementing test framework
4. **Update documentation** comprehensively
5. **Code review** required before merge

---

## 🎓 Learning Path for New Contributors

### Week 1: Understanding the Basics

**Day 1-2: Project Setup**
- Clone repository
- Install dependencies (`npm install`)
- Build extension (`npm run build`)
- Load in Chrome and test basic functionality

**Day 3-4: Read Documentation**
- README.md (user perspective)
- CHANGELOG.md (history of changes)
- CLAUDE.md (this file - development guide)

**Day 5-7: Code Exploration**
- Read `extension/manifest.json` (entry point)
- Read `content.js` (UI logic)
- Read `detector.js` (detection logic)
- Read `compromise-ner.js` (NER integration)

### Week 2: Making Changes

**Day 1-3: Simple Pattern Addition**
- Add a new detection pattern (e.g., Swiss VAT numbers)
- Test manually
- Update documentation

**Day 4-5: Fix a False Positive**
- Find a false-positive case
- Debug using console logs
- Implement filter
- Test with multiple cases

**Day 6-7: Version & Release**
- Update version using npm script
- Update CHANGELOG.md
- Build & test
- Commit & push

### Week 3: Advanced Topics

**Day 1-3: NER Improvement**
- Study Compromise.js documentation
- Improve context validation
- Add stopwords/whitelists

**Day 4-5: Platform Support**
- Add support for a new AI platform
- Update manifest.json
- Test thoroughly

**Day 6-7: Architecture Refactoring**
- Propose improvement to architecture
- Discuss with maintainers
- Implement with tests

---

## 📞 Contact & Support

**For AI Assistants:**
- All information should be in this file and related docs
- If unclear, ask the user for clarification
- Check git history for context on specific code

**For Human Contributors:**
- GitHub Issues: https://github.com/chrisbeyeler/aicc-claude/issues
- Website: https://beyonder.ch

---

## 📝 Changelog for This File

**Version 1.0.0** (2025-11-14)
- Initial creation of CLAUDE.md
- Comprehensive documentation of architecture, workflows, conventions
- Based on v2.10.4 codebase state
- Authored by: Claude (Anthropic AI Assistant)

---

**Made with ❤️ for Privacy & Compliance by BEYONDER**

**AI Compliance Checker v2.10.4** - Powered by Compromise.js
