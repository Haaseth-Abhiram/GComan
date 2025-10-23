import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/global-chemicals-logo.png';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [
    { label: 'HOME', path: '/' },
    { label: 'ABOUT', path: '/about' },
    { label: 'PRODUCTS', path: '/products' },
    { label: 'INDUSTRIES', path: '/industries' },
    { label: 'RESOURCES', path: '/resources' },
    { label: 'CONTACT', path: '/contact' },
  ];

  const utilityLinks = [
    { label: 'Customers', path: '/customers' },
    { label: 'Career', path: '/career' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      {/* Utility Bar */}
      <div className="hidden lg:block border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-end items-center h-10 gap-6">
            {utilityLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {user.email}
                </span>
                <button
                  onClick={signOut}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

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
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-semibold tracking-wide transition-colors relative group ${
                  isActive(item.path)
                    ? 'text-primary'
                    : 'text-foreground/70 hover:text-primary'
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-2 left-0 w-full h-0.5 bg-primary transition-transform origin-left ${
                    isActive(item.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            ))}
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
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-in">
          <div className="container mx-auto px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block text-base font-semibold py-2 transition-colors ${
                  isActive(item.path)
                    ? 'text-primary'
                    : 'text-foreground/70 hover:text-primary'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border/50 space-y-2">
              {utilityLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <div className="text-sm text-muted-foreground py-1 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {user.email}
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
