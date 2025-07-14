
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { PhoneFrame } from './components/PhoneFrame';
import { MessageBubble } from './components/MessageBubble';
import { GenerateButton } from './components/GenerateButton';
import { generateElaboratedQuote } from './services/geminiService';
import type { Message } from './types';
import { SparklesIcon, BookOpenIcon, Cog6ToothIcon, TwitterIcon, GithubIcon, LinkedinIcon, CheckIcon, MapIcon, ArchiveBoxIcon, ChatBubbleBottomCenterTextIcon } from './components/icons';

const THEMES = ["Inspirational", "Gratitude", "Biblical", "Motivational", "Stoicism", "Mindfulness"];
const PERSONALITIES = ["Energetic Coach", "Stoic", "Friendly", "Poetic"];
const LENGTHS = ["Short", "Medium", "Long"];

const PhoneDemo: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: Date.now(), text: "Welcome to Quoti! Select your preferences below and tap 'Generate Quote'.", type: 'intro' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [selectedPersonality, setSelectedPersonality] = useState(PERSONALITIES[0]);
  const [selectedLength, setSelectedLength] = useState(LENGTHS[1]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleGenerateQuote = useCallback(async () => {
    setIsLoading(true);
    const thinkingMessageId = Date.now();
    setMessages(prev => [...prev, { id: thinkingMessageId, text: '...', type: 'thinking' }]);

    try {
      const quoteData = await generateElaboratedQuote(selectedTheme, selectedLength, selectedPersonality);
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== thinkingMessageId);
        return [...filtered, { id: Date.now(), text: quoteData, type: 'sent' }];
      });
    } catch (error) {
      console.error("Failed to generate quote:", error);
      const errorMessage = error instanceof Error ? error.message : "Sorry, I couldn't generate a quote right now.";
      setMessages(prev => {
         const filtered = prev.filter(msg => msg.id !== thinkingMessageId);
         return [...filtered, { id: Date.now(), text: errorMessage, type: 'error' }];
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedTheme, selectedLength, selectedPersonality]);

  return (
    <PhoneFrame>
        <div className="flex flex-col h-full bg-slate-900 text-white">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-slate-700 bg-slate-800 space-y-4">
                 <div>
                    <label className="text-xs font-medium text-slate-400 block mb-2 text-center">Length</label>
                    <div className="flex flex-wrap justify-center gap-2">
                        {LENGTHS.map(length => (
                            <button
                                key={length}
                                onClick={() => setSelectedLength(length)}
                                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${selectedLength === length ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                            >
                                {length}
                            </button>
                        ))}
                    </div>
                </div>
                 <div>
                    <label className="text-xs font-medium text-slate-400 block mb-2 text-center">Theme</label>
                    <div className="flex flex-wrap justify-center gap-2">
                        {THEMES.map(theme => (
                             <button
                                key={theme}
                                onClick={() => setSelectedTheme(theme)}
                                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${selectedTheme === theme ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                            >
                                {theme}
                            </button>
                        ))}
                    </div>
                </div>
                 <div>
                    <label className="text-xs font-medium text-slate-400 block mb-2 text-center">Personality</label>
                     <div className="flex flex-wrap justify-center gap-2">
                        {PERSONALITIES.map(p => (
                            <button
                                key={p}
                                onClick={() => setSelectedPersonality(p)}
                                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${selectedPersonality === p ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
                <GenerateButton onClick={handleGenerateQuote} isLoading={isLoading} />
            </div>
        </div>
    </PhoneFrame>
  );
};


const FadeInSection = ({ children }: { children: React.ReactNode }) => {
  const domRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setVisible] = React.useState(false);
  
  React.useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setVisible(true);
        if(domRef.current) {
            observer.unobserve(domRef.current);
        }
      }
    });
    
    if(domRef.current) {
        observer.observe(domRef.current);
    }
    
    return () => {
        if(domRef.current){
             observer.unobserve(domRef.current);
        }
    };
  }, []);

  return (
    <div ref={domRef} className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}>
      {children}
    </div>
  );
};

const FeatureHighlight = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-slate-800 p-6 rounded-xl text-center flex flex-col items-center ring-1 ring-slate-700 h-full">
        <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-slate-800 rounded-xl mb-4 ring-1 ring-slate-600">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="mt-2 text-slate-400 text-sm flex-grow">{description}</p>
    </div>
);


const PricingCard = ({ plan, price, pricePeriod, description, features, isFeatured }: { plan: string, price: string, pricePeriod?: string, description: string, features: string[], isFeatured: boolean }) => (
    <div className={`relative p-8 rounded-2xl w-full max-w-sm flex flex-col ${isFeatured ? 'bg-slate-800 ring-2 ring-purple-500' : 'bg-slate-800/50 ring-1 ring-slate-700'}`}>
        {isFeatured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>}
        <div className="flex-grow">
            <h3 className="text-lg font-semibold uppercase tracking-wider text-purple-400">{plan}</h3>
            <p className="mt-4 text-white">
                <span className="text-4xl font-extrabold tracking-tight">{price}</span>
                {pricePeriod && <span className="text-lg font-medium text-slate-400">{pricePeriod}</span>}
            </p>
            <p className="mt-2 text-sm text-slate-300">{description}</p>
            <ul className="mt-8 space-y-3 text-sm text-slate-200">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                        <CheckIcon className="w-5 h-5 flex-shrink-0 text-purple-400" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
        <button className={`w-full mt-8 py-3 font-semibold rounded-lg transition-all duration-300 group ${isFeatured ? 'bg-purple-600 text-white hover:bg-purple-500' : 'bg-slate-200 text-slate-900 hover:bg-white'}`}>
            <span className="group-hover:scale-105 inline-block transition-transform">Choose Plan</span>
        </button>
    </div>
);


const App: React.FC = () => {
  return (
    <div className="bg-slate-900 text-slate-300 font-sans">
      <header className="relative py-24 sm:py-32 overflow-hidden animated-gradient">
        <div className="absolute inset-0 bg-slate-900/30"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight">
            Glow and Grow with Quoti
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-purple-200">
            Receive personalized, AI-elaborated quotes to find meaning and motivation. Your daily partner in personal growth.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <a href="#demo" className="bg-white text-slate-900 font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-slate-200 transition-all transform hover:scale-105 duration-300">
              Try the Demo
            </a>
          </div>
        </div>
      </header>

      <section id="how-it-works" className="py-20 sm:py-24">
        <div className="container mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">How It Works</h2>
              <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">Get your dose of wisdom in three simple steps.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto bg-slate-800 rounded-xl mb-4 ring-1 ring-slate-700">
                        <Cog6ToothIcon className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">1. Customize</h3>
                    <p className="mt-2 text-slate-400">Select a theme, tone, and length to match your mood and needs.</p>
                </div>
                <div className="text-center">
                     <div className="flex items-center justify-center w-16 h-16 mx-auto bg-slate-800 rounded-xl mb-4 ring-1 ring-slate-700">
                        <SparklesIcon className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">2. Generate</h3>
                    <p className="mt-2 text-slate-400">Our AI finds the perfect quote and provides a deep, insightful elaboration.</p>
                </div>
                <div className="text-center">
                     <div className="flex items-center justify-center w-16 h-16 mx-auto bg-slate-800 rounded-xl mb-4 ring-1 ring-slate-700">
                        <BookOpenIcon className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">3. Grow</h3>
                    <p className="mt-2 text-slate-400">Apply the wisdom, share with friends, and save your favorite insights.</p>
                </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      <section id="demo" className="py-20 sm:py-24">
        <div className="container mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Experience Quoti Live</h2>
              <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">Interact with the demo below to see the magic happen in real-time.</p>
            </div>
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 via-fuchsia-700 to-indigo-800 rounded-3xl blur-2xl opacity-30"></div>
                <div className="relative bg-white/5 backdrop-blur-xl p-4 rounded-3xl ring-1 ring-white/10">
                    <PhoneDemo />
                </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      <section id="premium-features" className="py-20 sm:py-24 bg-slate-900/50">
        <div className="container mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">The Quoti+ Experience</h2>
              <p className="mt-4 text-lg text-slate-400 max-w-3xl mx-auto">Go beyond simple quotes. Quoti+ is a personalized wellness partner that grows with you.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              <FeatureHighlight
                icon={<MapIcon className="w-8 h-8 text-purple-400" />}
                title="Guided Pathways"
                description="Choose a goal like 'Resilience' or 'Gratitude' and receive a curated journey of content to support your growth."
              />
              <FeatureHighlight
                icon={<ChatBubbleBottomCenterTextIcon className="w-8 h-8 text-purple-400" />}
                title="Interactive AI Coaching"
                description="Our AI periodically checks in on your mood and tailors its messages to be more uplifting, calming, or motivational."
              />
              <FeatureHighlight
                icon={<ArchiveBoxIcon className="w-8 h-8 text-purple-400" />}
                title="Your Personal Library"
                description="Access a private hub with your full message history, saved favorites, and exclusive subscriber-only content."
              />
              <FeatureHighlight
                icon={<Cog6ToothIcon className="w-8 h-8 text-purple-400" />}
                title="Total Personalization"
                description="Set custom delivery times and choose your preferred mix of content—from quotes to affirmations and mini-meditations."
              />
            </div>
          </FadeInSection>
        </div>
      </section>

      <section id="pricing" className="py-20 sm:py-24">
        <div className="container mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Choose Your Plan</h2>
              <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">Start for free and upgrade when you're ready to unlock your full potential.</p>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-8 max-w-4xl mx-auto">
              <PricingCard
                plan="Free"
                price="$0"
                description="For a daily spark of inspiration."
                features={['3 quotes per day', 'Access to standard themes', 'Standard elaborations']}
                isFeatured={false}
              />
              <PricingCard
                plan="Quoti+"
                price="$5"
                pricePeriod="/ month"
                description="Your complete wellness partner."
                features={[
                  'Guided Wellness Pathways',
                  'Interactive Mood Check-ins',
                  'Personal Content Library',
                  'Custom Scheduling & Frequency',
                  'Access All Themes & Tones',
                  'Unlimited Generations',
                ]}
                isFeatured={true}
              />
            </div>
          </FadeInSection>
        </div>
      </section>
      
      <footer className="bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                <div>
                    <p className="font-bold text-xl text-white">Quoti</p>
                    <p className="mt-2 text-sm text-slate-400">&copy; {new Date().getFullYear()} Quoti. All rights reserved.</p>
                </div>
                <div className="flex justify-center gap-6 mt-6 md:mt-0">
                    <a href="#" className="text-slate-500 hover:text-white transition-colors"><TwitterIcon className="w-6 h-6" /></a>
                    <a href="#" className="text-slate-500 hover:text-white transition-colors"><GithubIcon className="w-6 h-6" /></a>
                    <a href="#" className="text-slate-500 hover:text-white transition-colors"><LinkedinIcon className="w-6 h-6" /></a>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
