import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: any;
  image?: string;
  details?: {
    formula?: string;
    fullDescription?: string;
    applications?: string[];
  };
}

interface ProductDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export const ProductDialog = ({ product, isOpen, onClose, isMobile }: ProductDialogProps) => {
  if (!product) return null;

  const Icon = product.icon;

  const content = (
    <>
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="p-3 rounded-lg bg-primary/10">
          <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-foreground">{product.title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">{product.description}</p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {product.details?.formula && (
          <div>
            <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Chemical Formula</h4>
            <p className="text-muted-foreground font-mono text-base sm:text-lg">{product.details.formula}</p>
          </div>
        )}

        {product.details?.fullDescription && (
          <div>
            <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Description</h4>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              {product.details.fullDescription}
            </p>
          </div>
        )}

        {product.details?.applications && product.details.applications.length > 0 && (
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm sm:text-base">Applications</h4>
            <ul className="grid grid-cols-1 gap-2">
              {product.details.applications.map((app, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1 flex-shrink-0 text-lg">•</span>
                  <span className="text-muted-foreground text-xs sm:text-sm">{app}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-3 sm:pt-4 border-t border-border">
          <p className="text-xs sm:text-sm text-muted-foreground">
            For more information about this product, pricing, or technical specifications, please{' '}
            <a href="/contact" className="text-primary hover:underline font-semibold">
              contact us
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle className="sr-only">{product.title}</DrawerTitle>
            <DrawerDescription className="sr-only">{product.description}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-8 overflow-y-auto">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">{product.title}</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};
