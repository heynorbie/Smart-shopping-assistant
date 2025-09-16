import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Mic, MicOff, Bot, User } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  products?: any[];
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isTyping: boolean;
}

export const ChatInterface = ({ messages, onSendMessage, isTyping }: ChatInterfaceProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        toast({
          title: "Voice Input Active",
          description: "Start speaking your shopping request...",
        });
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice Input Error",
          description: "Could not recognize speech. Try typing instead.",
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.start();
    } else {
      toast({
        title: "Voice Not Supported",
        description: "Your browser doesn't support voice input.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  return (
    <Card className="flex flex-col h-full bg-gradient-card shadow-medium border-product-card-border">
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-gradient-primary">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-card shadow-soft">
            <AvatarImage src="/api/placeholder/40/40" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold text-white">Shopping Assistant</h3>
            <p className="text-sm text-white/80">Your personal shopping companion</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-3">
              {/* Message Bubble */}
              <div className={`flex items-start gap-3 ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}>
                {message.type === 'bot' && (
                  <Avatar className="h-8 w-8 bg-primary shadow-soft">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-soft ${
                  message.type === 'user'
                    ? 'bg-chat-user text-chat-user-foreground'
                    : 'bg-chat-bot text-chat-bot-foreground border border-product-card-border'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {message.type === 'user' && (
                  <Avatar className="h-8 w-8 bg-secondary shadow-soft">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>

              {/* Product Recommendations */}
              {message.products && message.products.length > 0 && (
                <div className="ml-11 space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    Here are some recommendations:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {message.products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 bg-primary shadow-soft">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-chat-bot border border-product-card-border rounded-2xl px-4 py-3 shadow-soft">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about products, deals, or shopping advice..."
              className="pr-12 bg-background border-product-card-border shadow-soft"
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
              onClick={isListening ? stopListening : startListening}
            >
              {isListening ? (
                <MicOff className="h-4 w-4 text-destructive animate-pulse" />
              ) : (
                <Mic className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft px-4"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};