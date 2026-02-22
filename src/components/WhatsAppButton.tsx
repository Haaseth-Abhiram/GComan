import { MessageCircle } from 'lucide-react';
import { trackContactClick } from '@/components/GoogleAnalytics';

const WhatsAppButton = () => {
  const handleClick = () => {
    trackContactClick('whatsapp');
    const phoneNumber = '96893754388';
    const message = 'Hello! I would like to inquire about your products.';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 sm:bottom-8 left-4 sm:left-8 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-tertiary hover:bg-tertiary/90 text-white rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center group"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 group-hover:animate-pulse" />
    </button>
  );
};

export default WhatsAppButton;
