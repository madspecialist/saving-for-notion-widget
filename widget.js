// widget.js
const { useState, useEffect } = React;

// Create card components to replace shadcn/ui
const Card = ({ className, children }) => (
  <div className={`rounded-lg border border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ className, children }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const DynamicWidget = () => {
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [salesEvent, setSalesEvent] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [currentColorScheme, setCurrentColorScheme] = useState(0);

  // Base color schemes for light/dark mode
  const baseColorSchemes = {
    light: { primary: 'text-gray-900', secondary: 'text-gray-700', accent: 'text-gray-600' },
    dark: { primary: 'text-gray-100', secondary: 'text-gray-300', accent: 'text-gray-200' }
  };

  // Additional color schemes for the color picker
  const colorSchemes = [
    { primary: 'text-gray-900', secondary: 'text-gray-700', accent: 'text-gray-600' },
    { primary: 'text-blue-500', secondary: 'text-blue-400', accent: 'text-blue-300' },
    { primary: 'text-purple-500', secondary: 'text-purple-400', accent: 'text-purple-300' },
    { primary: 'text-green-500', secondary: 'text-green-400', accent: 'text-green-300' },
    { primary: 'text-rose-500', secondary: 'text-rose-400', accent: 'text-rose-300' },
    { primary: 'text-amber-500', secondary: 'text-amber-400', accent: 'text-amber-300' }
  ];

  // Welcome messages based on time of day
  const welcomeMessages = {
    morning: "Good morning! Ready to achieve great things?",
    afternoon: "Good afternoon! Keep the momentum going!",
    evening: "Good evening! Let's wrap up strong!",
    night: "Working late? Don't forget to rest!"
  };

  // Extended motivational quotes
  const motivationalQuotes = [
    "Success is not final; failure is not fatal.",
    "Every sale is an opportunity to make a difference.",
    "The only way to do great work is to love what you do.",
    "Small progress is still progress.",
    "Your attitude determines your direction.",
    "Focus on the step in front of you, not the whole staircase.",
    "Don't count the days, make the days count.",
    "Excellence is not an act, but a habit.",
    "The future depends on what you do today.",
    "Believe you can and you're halfway there.",
    "The harder you work, the luckier you get.",
    "Dreams don't work unless you do.",
    "Quality is not an act, it is a habit.",
    "Success is built one day at a time.",
    "The best way to predict the future is to create it.",
    "Your time is limited, don't waste it living someone else's life.",
    "The only limit to our realization of tomorrow is our doubts of today.",
    "Act as if what you do makes a difference. It does.",
    "Success usually comes to those who are too busy to be looking for it.",
    "The road to success is always under construction."
  ];

  // Sales events data with specific dates where applicable
  const salesEvents = {
    'January': ['New Year Sale', 'Start the year with amazing deals!'],
    'February': ['Valentine\'s Special', 'Share the love with special offers!'],
    'March': ['Spring Collection Launch', 'Refresh your style this spring!'],
    'April': ['Easter Promotions', 'Hop into savings this Easter!'],
    'May': ['Mother\'s Day Sale', 'Show appreciation with perfect gifts!'],
    'June': ['Summer Clearance', 'Hot deals for the summer season!'],
    'July': ['Independence Day & Prime Day', 'Double the celebrations, double the savings!'],
    'August': ['Back to School', 'Get ready for success!'],
    'September': ['Fall Collection Launch', 'Fall into new possibilities!'],
    'October': ['Halloween Sale', 'Treats without tricks!'],
    'November': ['Black Friday Month', 'The biggest savings of the year!'],
    'December': ['Holiday Season Sale', 'Spread joy with perfect gifts!']
  };

  useEffect(() => {
    // Check system dark mode preference and set initial state
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);
    setCurrentColorScheme(0); // Always start with default color scheme

    const updateDateTime = () => {
      const now = new Date();
      const monthName = now.toLocaleString('default', { month: 'long' });
      const dayName = now.toLocaleString('default', { weekday: 'long' });
      const dateNum = now.getDate();
      
      // Format time with AM/PM
      const timeString = now.toLocaleString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
      
      setCurrentMonth(monthName);
      setCurrentDay(dayName);
      setCurrentDate(`${dayName} the ${dateNum}${getOrdinalSuffix(dateNum)}`);
      setCurrentTime(timeString);
      setSalesEvent(salesEvents[monthName]);

      // Set welcome message based on time of day
      const hour = now.getHours();
      if (hour >= 5 && hour < 12) setWelcomeMessage(welcomeMessages.morning);
      else if (hour >= 12 && hour < 17) setWelcomeMessage(welcomeMessages.afternoon);
      else if (hour >= 17 && hour < 22) setWelcomeMessage(welcomeMessages.evening);
      else setWelcomeMessage(welcomeMessages.night);

      // Set random motivational quote
      const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
      setMotivationalQuote(randomQuote);
    };

    // Update immediately
    updateDateTime();

    // Update every minute
    const interval = setInterval(updateDateTime, 60000);

    // Listen for system dark mode changes
    const darkModeListener = (e) => {
      setIsDarkMode(e.matches);
    };
    
    mediaQuery.addEventListener('change', darkModeListener);

    return () => {
      clearInterval(interval);
      mediaQuery.removeEventListener('change', darkModeListener);
    };
  }, []);

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    setCurrentColorScheme(0); // Reset to default colors when toggling dark/light mode
  };

  const cycleColorScheme = () => {
    setCurrentColorScheme((prev) => (prev + 1) % colorSchemes.length);
  };

  // Get the current text colors based on dark mode and color scheme
  const getTextColors = () => {
    if (currentColorScheme === 0) {
      // Use base color scheme when no custom colors are selected
      return isDarkMode ? baseColorSchemes.dark : baseColorSchemes.light;
    }
    // Use custom color scheme when selected
    return colorSchemes[currentColorScheme];
  };

  const currentColors = getTextColors();

  // Icons from Lucide
  const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2"/>
      <path d="M12 20v2"/>
      <path d="m4.93 4.93 1.41 1.41"/>
      <path d="m17.66 17.66 1.41 1.41"/>
      <path d="M2 12h2"/>
      <path d="M20 12h2"/>
      <path d="m6.34 17.66-1.41 1.41"/>
      <path d="m19.07 4.93-1.41 1.41"/>
    </svg>
  );

  const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
  );

  const PaletteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5"/>
      <circle cx="17.5" cy="10.5" r=".5"/>
      <circle cx="8.5" cy="7.5" r=".5"/>
      <circle cx="6.5" cy="12.5" r=".5"/>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
    </svg>
  );

  return (
    <Card className={`w-96 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg transition-colors duration-200`}>
      <CardContent className="p-6">
        {/* Header with controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <button 
              onClick={toggleDarkMode}
              className={`p-2 ${isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-800'} rounded-full transition-colors`}
              title="Toggle dark mode"
            >
              {isDarkMode ? <MoonIcon /> : <SunIcon />}
            </button>
            <button 
              onClick={cycleColorScheme}
              className={`p-2 ${isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-800'} rounded-full transition-colors`}
              title="Change color scheme"
            >
              <PaletteIcon />
            </button>
          </div>
          <div className={`text-lg font-medium ${currentColors.primary}`}>
            {currentTime}
          </div>
        </div>

        {/* Welcome Message */}
        <div className={`mb-4 font-medium ${currentColors.accent}`}>
          {welcomeMessage}
        </div>

        {/* Date Information */}
        <div className="mb-4">
          <h2 className={`text-2xl font-bold ${currentColors.primary}`}>{currentMonth}</h2>
          <p className={`text-lg ${currentColors.secondary}`}>{currentDate}</p>
        </div>

        {/* Sales Event Information */}
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'} mb-4`}>
          <h3 className={`text-lg font-semibold ${currentColors.primary}`}>
            Current Sales Event:
          </h3>
          <p className={`mt-2 ${currentColors.secondary}`}>
            {salesEvent && salesEvent[0]}
          </p>
          <p className={`mt-1 text-sm ${currentColors.accent}`}>
            {salesEvent && salesEvent[1]}
          </p>
        </div>

        {/* Motivational Quote */}
        <div className={`text-sm italic ${currentColors.accent}`}>
          "{motivationalQuote}"
        </div>
      </CardContent>
    </Card>
  );
};

// Render the widget
const rootElement = document.getElementById('root');
ReactDOM.render(<DynamicWidget />, rootElement);
