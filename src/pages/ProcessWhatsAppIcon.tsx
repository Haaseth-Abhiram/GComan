import { useState } from 'react';
import { removeBackground, loadImage } from '@/utils/removeBackground';
import whatsappIcon from '@/assets/whatsapp-icon.png';
import { Button } from '@/components/ui/button';

const ProcessWhatsAppIcon = () => {
  const [processing, setProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const handleRemoveBackground = async () => {
    setProcessing(true);
    try {
      // Fetch the image as a blob
      const response = await fetch(whatsappIcon);
      const blob = await response.blob();
      
      // Load the image
      const img = await loadImage(blob);
      
      // Remove background
      const processedBlob = await removeBackground(img);
      
      // Create URL for the processed image
      const url = URL.createObjectURL(processedBlob);
      setProcessedImage(url);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = 'whatsapp-icon-transparent.png';
      a.click();
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Process WhatsApp Icon</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl mb-2">Original Icon:</h2>
          <img src={whatsappIcon} alt="Original WhatsApp" className="w-32 h-32" />
        </div>
        
        <Button 
          onClick={handleRemoveBackground}
          disabled={processing}
        >
          {processing ? 'Processing...' : 'Remove Background'}
        </Button>
        
        {processedImage && (
          <div>
            <h2 className="text-xl mb-2">Processed Icon (Background Removed):</h2>
            <div className="bg-gray-200 p-4 inline-block">
              <img src={processedImage} alt="Processed WhatsApp" className="w-32 h-32" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessWhatsAppIcon;
