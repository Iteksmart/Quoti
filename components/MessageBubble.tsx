import React, { useState } from 'react';
import type { Message } from '../types';
import { ThinkingDotsIcon, ClipboardIcon, CheckIcon } from './icons';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { type } = message;
  const [isCopied, setIsCopied] = useState(false);

  const baseClasses = 'max-w-xs md:max-w-sm rounded-2xl p-3 text-sm md:text-base shadow-md break-words w-full';
  
  const typeClasses = {
    sent: 'bg-purple-600 text-white ml-auto rounded-br-lg',
    thinking: 'bg-slate-700 text-slate-300 mr-auto rounded-bl-lg flex items-center justify-center',
    intro: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white mr-auto rounded-bl-lg',
    error: 'bg-red-500 text-white mr-auto rounded-bl-lg',
  };

  const wrapperClasses = {
    sent: 'flex justify-end',
    thinking: 'flex justify-start',
    intro: 'flex justify-start',
    error: 'flex justify-start',
  }

  const renderContent = () => {
    switch (message.type) {
      case 'sent':
        const { text } = message;
        const handleCopy = () => {
          const fullQuoteText = `"${text.quote}"\n- ${text.author}\n\n${text.elaboration}`;
          navigator.clipboard.writeText(fullQuoteText).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
          }).catch(err => console.error('Failed to copy: ', err));
        };

        return (
          <>
            <div className="space-y-3">
                <blockquote className="border-l-4 border-purple-300 pl-3 italic">
                    <p>"{text.quote}"</p>
                    <footer className="text-right not-italic font-semibold mt-1">- {text.author}</footer>
                </blockquote>
                <p className="text-purple-100">{text.elaboration}</p>
                <p className="font-bold text-center text-white text-sm pt-2 border-t border-purple-400 mt-3">Glow and Grow with Quoti</p>
            </div>
            <div className="mt-3 pt-2 border-t border-purple-400/30 flex justify-end">
              <button
                onClick={handleCopy}
                disabled={isCopied}
                className="flex items-center gap-1.5 text-xs font-semibold text-purple-200 hover:text-white disabled:text-white transition-colors focus:outline-none"
                aria-label={isCopied ? 'Content copied to clipboard' : 'Copy quote and elaboration'}
              >
                {isCopied ? (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <ClipboardIcon className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </>
        );
      case 'thinking':
        return <ThinkingDotsIcon />;
      case 'intro':
      case 'error':
        // And here, it knows `message.text` is a string
        return message.text;
    }
  }

  return (
    <div className={wrapperClasses[type]}>
      <div className={`${baseClasses} ${typeClasses[type]}`}>
        {renderContent()}
      </div>
    </div>
  );
};