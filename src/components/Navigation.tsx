import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import logo from '@/assets/gcoman-logo.png';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Solutions', path: '/products', description: 'Our chemical products & services' },
    { label: 'Industries', path: '/industries', description: 'Sector-specific solutions' },
    { label: 'Resources', path: '/resources', description: 'Technical docs & guides' },
    { label: 'About', path: '/about', description: 'Our company & values' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/98 backdrop-blur-md border-b border-border shadow-sm">
      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img 
              src={logo} 
              alt="Global Chemicals LLC Logo" 
              className="h-12 md:h-14 w-auto transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all relative group ${
                  isActive(item.path)
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
                }`}
                title={item.description}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
              className="relative"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Contact */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="relative"
            >
              <Link to="/contact" title="Contact Us">
                <Phone className="h-5 w-5" />
              </Link>
            </Button>

            {/* Account/Login */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="relative"
            >
              <Link to="/login" title="Account Login">
                <User className="h-5 w-5" />
              </Link>
            </Button>

            {/* Primary CTA */}
            <Button asChild className="ml-2">
              <Link to="/contact">Get a Quote</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="pb-4 animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products, industries, or resources..."
                  className="pl-10 pr-4"
                  autoFocus
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-in">
          <div className="container mx-auto px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg font-semibold transition-colors ${
                  isActive(item.path)
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
                }`}
              >
                <div className="font-semibold">{item.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
              </Link>
            ))}
            
            <div className="pt-4 border-t border-border/50 space-y-1">
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Contact Us
              </Link>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Account Login
              </Link>
            </div>

            {/* Mobile CTA */}
            <div className="pt-4">
              <Button asChild className="w-full">
                <Link to="/contact" onClick={() => setIsOpen(false)}>
                  Get a Quote
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
