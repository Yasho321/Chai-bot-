import { useState, useEffect, useRef } from 'react';
import { useChatStore } from '../stores/chatStore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import { Send, Coffee, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

const ChatInterface = () => {
  const [inputMessage, setInputMessage] = useState('');
  const { messages, sendMessage, isLoading, isTyping, fetchChats } = useChatStore();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage.trim();
    setInputMessage('');
    await sendMessage(message);
  };

  const MessageBubble = ({ message, isUser }) => (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-glow rounded-full blur-sm opacity-30"></div>
            <div className="relative bg-primary  p-2 rounded-full">
              <Coffee className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
        </div>
      )}
      
      <div className={`max-w-[70%] ${isUser ? 'order-1' : ''}`}>
        <Card className={`p-4 ${
          isUser 
            ? 'bg-chat-user text-chat-user-foreground ml-auto' 
            : 'bg-chat-assistant text-chat-assistant-foreground'
        }`}>
          {isUser ? (
            <p className="text-sm">{message.content}</p>
          ) : (
            <div className="text-sm prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  code: ({node, inline, className, children, ...props}) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <pre className="bg-muted border border-border p-4 rounded-lg overflow-x-auto my-3 text-sm" {...props}>
                        <code className={`${className} text-foreground`} {...props}>
                          {children}
                        </code>
                      </pre>
                    ) : (
                      <code className="bg-muted text-foreground px-2 py-1 rounded-md text-xs font-mono border border-border" {...props}>
                        {children}
                      </code>
                    );
                  },
                  p: ({children}) => <p className="mb-3 last:mb-0 text-foreground leading-relaxed">{children}</p>,
                  ul: ({children}) => <ul className="mb-3 pl-4 space-y-1 list-disc">{children}</ul>,
                  ol: ({children}) => <ol className="mb-3 pl-4 space-y-1 list-decimal">{children}</ol>,
                  li: ({children}) => <li className="text-sm text-foreground">{children}</li>,
                  h1: ({children}) => <h1 className="font-bold mb-3 text-lg text-foreground">{children}</h1>,
                  h2: ({children}) => <h2 className="font-bold mb-3 text-base text-foreground">{children}</h2>,
                  h3: ({children}) => <h3 className="font-semibold mb-2 text-base text-foreground">{children}</h3>,
                  h4: ({children}) => <h4 className="font-semibold mb-2 text-sm text-foreground">{children}</h4>,
                  strong: ({children}) => <strong className="font-semibold text-foreground">{children}</strong>,
                  em: ({children}) => <em className="italic text-foreground">{children}</em>,
                  blockquote: ({children}) => (
                    <blockquote className="border-l-4 border-primary pl-4 italic my-3 text-muted-foreground">
                      {children}
                    </blockquote>
                  ),
                  a: ({children, href}) => (
                    <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </Card>
        <div className={`text-xs text-muted-foreground mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {isUser ? 'You' : 'VTT Buddy'}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0">
          <div className="bg-secondary p-2 rounded-full">
            <User className="h-4 w-4 text-secondary-foreground" />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-glow rounded-full blur-sm opacity-30"></div>
            <div className="relative bg-primary  p-2 rounded-full">
              <Coffee className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h2 className="font-semibold">Chai Bot</h2>
            <p className="text-sm text-muted-foreground">
              Ask me anything about your courses of Chai aur Code
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-glow rounded-2xl blur-lg opacity-20"></div>
                <div className="relative bg-primary  p-6 rounded-2xl">
                  <Coffee className="h-12 w-12 text-primary-foreground mx-auto" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-2">Welcome to VTT Buddy!</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                I'm your AI learning assistant & guide. I will help you guide through Courses of Chai aur Code
              </p>
              <div className="mt-6 text-sm text-muted-foreground">
                <p>Try asking:</p>
                <ul className="mt-2 space-y-1">
                  <li>"What is Node.js?"</li>
                  <li>"Explain semantic versioning"</li>
                  <li>"How do I create an Express server?"</li>
                </ul>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <MessageBubble
                key={index}
                message={message}
                isUser={message.role === 'user'}
              />
            ))
          )}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-glow rounded-full blur-sm opacity-30"></div>
                  <div className="relative bg-gradient-to-r from-primary to-primary-glow p-2 rounded-full">
                    <Coffee className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>
              </div>
              <Card className="p-4 bg-chat-assistant text-chat-assistant-foreground">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Chai Bot is thinking...</span>
                </div>
              </Card>
            </div>
          )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything about your courses..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="bg-primary hover:shadow-glow transition-shadow"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;