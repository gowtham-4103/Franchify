import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, ChevronDown, ChevronUp, Search, Heart, Plus,
  Star, Share2, Play, User, Upload, CheckCircle,
  Instagram, Youtube, Linkedin, Twitter,
  Eye, ShoppingCart, Copy, Check, Minus, Plus as PlusIcon,
  Package, CreditCard, MapPin, Calendar, Download,
  Filter, Clock, CheckCircle2, Truck, Home,
  Phone, Mail, MessageCircle,  ArrowLeft,
  HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Products data
const productsData = [
  {
    id: 1,
    name: 'Classic Formal Shirt',
    brandName: 'Engineers',
    price: 1299,
    credits: '12.99', // Credits calculated as price ÷ 100
    discountedPrice: 1299,
    offer: '10% off on first purchase',
    category: 'Clothing',
    subCategory: 'Formal Shirts',
    stockQuantity: 50,
    sku: 'FS-001',
    hsnCode: '62063000',
    fitType: 'Slim Fit',
    type: 'Formal',
    colors: 'White, Blue, Black',
    sizes: 'S, M, L, XL',
    material: '100% Cotton',
    pattern: 'Solid',
    neckType: 'Collar',
    sleeveType: 'Full Sleeve',
    occasion: 'Office, Business Meetings',
    length: 'Regular',
    closureType: 'Button',
    stretchability: 'Low',
    shortDescription: 'A classic formal shirt perfect for office wear and business meetings.',
    fullDescription: 'This premium formal shirt is crafted from high-quality cotton fabric, ensuring comfort throughout day. The slim fit design offers a modern silhouette while maintaining professional appearance. Perfect for business meetings, office wear, and formal occasions.',
    keyFeatures: 'Premium cotton fabric, Slim fit design, Comfortable collar, Wrinkle-resistant, Breathable material',
    washMethod: 'Machine wash cold',
    ironingDetails: 'Iron on medium heat',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=400&h=500&fit=crop'
    ],
    videoLink: 'https://www.instagram.com/p/CQ8XJ2vJ_5d/',
    instagramLink: 'https://www.instagram.com/p/CQ8XJ2vJ_5d/',
    packageDimensions: '30x20x5 cm',
    weight: '300g',
    deliveryAvailability: 'Pan India',
    codOption: 'Available',
    sellerAddress: 'Engineers Fashion, 123 Fashion Street, Mumbai, Maharashtra, 400001',
    returnPolicy: '7 days return policy. Product must be unused with all tags intact.',
    // Removed gstPercentage as it will be calculated dynamically
    manufacturerDetails: 'Engineers Fashion Pvt. Ltd., 123 Fashion Street, Mumbai, Maharashtra, 400001',
    countryOfOrigin: 'India'
  },
  {
    id: 2,
    name: 'Casual Denim Jeans',
    brandName: 'Engineers',
    price: 1999,
    credits: '19.99', // Credits calculated as price ÷ 100
    discountedPrice: 1999,
    offer: 'Buy 2 get 1 free',
    category: 'Clothing',
    subCategory: 'Jeans',
    stockQuantity: 40,
    sku: 'DJ-002',
    hsnCode: '62034200',
    fitType: 'Regular Fit',
    type: 'Casual',
    colors: 'Blue, Black, Grey',
    sizes: '28, 30, 32, 34, 36',
    material: '98% Cotton, 2% Elastane',
    pattern: 'Solid',
    neckType: 'N/A',
    sleeveType: 'N/A',
    occasion: 'Casual, Everyday Wear',
    length: 'Regular',
    closureType: 'Button, Zipper',
    stretchability: 'Medium',
    shortDescription: 'Comfortable denim jeans for everyday wear.',
    fullDescription: 'These comfortable denim jeans are designed for everyday wear with a perfect blend of style and comfort. The regular fit provides ample room without looking baggy, while premium denim fabric ensures durability and long-lasting wear.',
    keyFeatures: 'Premium denim fabric, Regular fit, Comfortable waistband, Durable stitching, Fade-resistant color',
    washMethod: 'Machine wash cold',
    ironingDetails: 'Iron on low heat',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1516252635089-856262a5a6b4?w=400&h=500&fit=crop'
    ],
    videoLink: 'https://www.instagram.com/p/CQ8XJ2vJ_5d/',
    instagramLink: 'https://www.instagram.com/p/CQ8XJ2vJ_5d/',
    packageDimensions: '35x25x8 cm',
    weight: '500g',
    deliveryAvailability: 'Pan India',
    codOption: 'Available',
    sellerAddress: 'Engineers Fashion, 123 Fashion Street, Mumbai, Maharashtra, 400001',
    returnPolicy: '7 days return policy. Product must be unused with all tags intact.',
    // Removed gstPercentage as it will be calculated dynamically
    manufacturerDetails: 'Engineers Fashion Pvt. Ltd., 123 Fashion Street, Mumbai, Maharashtra, 400001',
    countryOfOrigin: 'India'
  },
  {
    id: 3,
    name: 'Elegant Evening Dress',
    brandName: 'Engineers',
    price: 2999,
    credits: '29.99', // Credits calculated as price ÷ 100
    discountedPrice: 2999,
    offer: '15% off on first purchase',
    category: 'Clothing',
    subCategory: 'Dresses',
    stockQuantity: 30,
    sku: 'ED-003',
    hsnCode: '62044300',
    fitType: 'Body Fit',
    type: 'Party Wear',
    colors: 'Red, Black, Navy',
    sizes: 'XS, S, M, L',
    material: 'Polyester Blend',
    pattern: 'Solid',
    neckType: 'V-Neck',
    sleeveType: 'Sleeveless',
    occasion: 'Party, Evening Events',
    length: 'Knee Length',
    closureType: 'Zipper',
    stretchability: 'Low',
    shortDescription: 'Stunning evening dress for special occasions.',
    fullDescription: 'This stunning evening dress is designed to make you stand out at any special occasion. The body fit silhouette accentuates your curves while premium polyester blend fabric ensures comfort and elegance throughout the event.',
    keyFeatures: 'Elegant design, Premium fabric, Body fit silhouette, Comfortable to wear, Easy to maintain',
    washMethod: 'Dry clean only',
    ironingDetails: 'Iron on low heat',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1574342397350-337b2831e6e2?w=400&h=500&fit=crop'
    ],
    videoLink: 'https://www.instagram.com/p/CQ8XJ2vJ_5d/',
    instagramLink: 'https://www.instagram.com/p/CQ8XJ2vJ_5d/',
    packageDimensions: '30x25x5 cm',
    weight: '400g',
    deliveryAvailability: 'Pan India',
    codOption: 'Available',
    sellerAddress: 'Engineers Fashion, 123 Fashion Street, Mumbai, Maharashtra, 400001',
    returnPolicy: '7 days return policy. Product must be unused with all tags intact.',
    // Removed gstPercentage as it will be calculated dynamically
    manufacturerDetails: 'Engineers Fashion Pvt. Ltd., 123 Fashion Street, Mumbai, Maharashtra, 400001',
    countryOfOrigin: 'India'
  },
  {
    id: 4,
    name: 'Sporty Track Pants',
    brandName: 'Engineers',
    price: 999,
    credits: '9.99', // Credits calculated as price ÷ 100
    discountedPrice: 999,
    offer: '20% off on sports collection',
    category: 'Clothing',
    subCategory: 'Sports Wear',
    stockQuantity: 60,
    sku: 'SP-004',
    hsnCode: '62034200',
    fitType: 'Regular Fit',
    type: 'Sports',
    colors: 'Black, Grey, Navy',
    sizes: 'S, M, L, XL, XXL',
    material: 'Polyester',
    pattern: 'Solid',
    neckType: 'N/A',
    sleeveType: 'N/A',
    occasion: 'Sports, Casual Wear',
    length: 'Regular',
    closureType: 'Elastic Waistband',
    stretchability: 'High',
    shortDescription: 'Comfortable track pants for workouts and casual wear.',
    fullDescription: 'These comfortable track pants are perfect for workouts and casual wear. Made from high-quality polyester fabric, they offer excellent breathability and flexibility. The regular fit design ensures comfort without compromising on style.',
    keyFeatures: 'Lightweight fabric, Quick-drying, Elastic waistband, Side pockets, Comfortable fit',
    washMethod: 'Machine wash cold',
    ironingDetails: 'Iron on low heat',
    images: [
      'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop'
    ],
    videoLink: 'https://www.instagram.com/p/CQ8XJ2vJ_5d/',
    instagramLink: 'https://www.instagram.com/p/CQ8XJ2vJ_5d/',
    packageDimensions: '30x20x5 cm',
    weight: '350g',
    deliveryAvailability: 'Pan India',
    codOption: 'Available',
    sellerAddress: 'Engineers Fashion, 123 Fashion Street, Mumbai, Maharashtra, 400001',
    returnPolicy: '7 days return policy. Product must be unused with all tags intact.',
    // Removed gstPercentage as it will be calculated dynamically
    manufacturerDetails: 'Engineers Fashion Pvt. Ltd., 123 Fashion Street, Mumbai, Maharashtra, 400001',
    countryOfOrigin: 'India'
  },
  {
    id: 5,
    name: 'Classic Leather Jacket',
    brandName: 'Engineers',
    price: 4999,
    credits: '49.99', // Credits calculated as price ÷ 100
    discountedPrice: 4999,
    offer: 'Limited time offer',
    category: 'Clothing',
    subCategory: 'Jackets',
    stockQuantity: 20,
    sku: 'LJ-005',
    hsnCode: '62033300',
    fitType: 'Regular Fit',
    type: 'Casual',
    colors: 'Black, Brown',
    sizes: 'S, M, L, XL',
    material: 'Genuine Leather',
    pattern: 'Solid',
    neckType: 'Collar',
    sleeveType: 'Full Sleeve',
    occasion: 'Casual, Party',
    length: 'Regular',
    closureType: 'Zipper',
    stretchability: 'Low',
    shortDescription: 'Premium leather jacket for a stylish look.',
    fullDescription: 'This premium leather jacket is crafted from genuine leather, offering both style and durability. The regular fit design ensures comfort while classic design makes it a versatile addition to any wardrobe.',
    keyFeatures: 'Genuine leather, Premium quality, Stylish design, Comfortable fit, Durable',
    washMethod: 'Professional clean only',
    ironingDetails: 'Professional clean only',
    images: [
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1574342397350-337b2831e6e2?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop'
    ],
    videoLink: 'https://www.instagram.com/p/CQ8XJ2vJ_5d/',
    instagramLink: 'https://www.instagram.com/p/CQ8XJ2vJ_5d/',
    packageDimensions: '40x30x10 cm',
    weight: '800g',
    deliveryAvailability: 'Pan India',
    codOption: 'Available',
    sellerAddress: 'Engineers Fashion, 123 Fashion Street, Mumbai, Maharashtra, 400001',
    returnPolicy: '7 days return policy. Product must be unused with all tags intact.',
    // Removed gstPercentage as it will be calculated dynamically
    manufacturerDetails: 'Engineers Fashion Pvt. Ltd., 123 Fashion Street, Mumbai, Maharashtra, 400001',
    countryOfOrigin: 'India'
  },
  {
    id: 6,
    name: 'Summer Floral Dress',
    brandName: 'Engineers',
    price: 1799,
    credits: '17.99', // Credits calculated as price ÷ 100
    discountedPrice: 1799,
    offer: 'Buy 2 get 10% off',
    category: 'Clothing',
    subCategory: 'Dresses',
    stockQuantity: 45,
    sku: 'FD-006',
    hsnCode: '62044300',
    fitType: 'A-line',
    type: 'Casual',
    colors: 'Floral, Yellow, Pink',
    sizes: 'XS, S, M, L, XL',
    material: 'Cotton Blend',
    pattern: 'Floral',
    neckType: 'Round Neck',
    sleeveType: 'Short Sleeve',
    occasion: 'Casual, Summer Wear',
    length: 'Knee Length',
    closureType: 'Button',
    stretchability: 'Medium',
    shortDescription: 'Light and comfortable floral dress for summer.',
    fullDescription: 'This light and comfortable floral dress is perfect for summer. Made from a soft cotton blend, it offers excellent breathability and comfort. The A-line design flatters all body types while floral pattern adds a touch of femininity.',
    keyFeatures: 'Lightweight fabric, Floral pattern, A-line design, Comfortable fit, Easy to maintain',
    washMethod: 'Machine wash cold',
    ironingDetails: 'Iron on medium heat',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1572804013427-37d909342567?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1578681920702-a10c3186346c?w=400&h=500&fit=crop'
    ],
    videoLink: 'https://www.instagram.com/p/CQ8XJ2vJ_5d/',
    instagramLink: 'https://www.instagram.com/p/CQ8XJ2vJ_5d/',
    packageDimensions: '30x25x5 cm',
    weight: '350g',
    deliveryAvailability: 'Pan India',
    codOption: 'Available',
    sellerAddress: 'Engineers Fashion, 123 Fashion Street, Mumbai, Maharashtra, 400001',
    returnPolicy: '7 days return policy. Product must be unused with all tags intact.',
    // Removed gstPercentage as it will be calculated dynamically
    manufacturerDetails: 'Engineers Fashion Pvt. Ltd., 123 Fashion Street, Mumbai, Maharashtra, 400001',
    countryOfOrigin: 'India'
  },
  {
    id: 7,
    name: 'Designer Handbag',
    brandName: 'Engineers',
    price: 2499,
    credits: '24.99', // Credits calculated as price ÷ 100
    discountedPrice: 2499,
    offer: '15% off on first purchase',
    category: 'Accessories',
    subCategory: 'Handbags',
    stockQuantity: 25,
    sku: 'HB-007',
    hsnCode: '42022100',
    fitType: 'One Size',
    type: 'Accessories',
    colors: 'Black, Brown, Tan',
    sizes: 'One Size',
    material: 'Genuine Leather',
    pattern: 'Solid',
    neckType: 'N/A',
    sleeveType: 'N/A',
    occasion: 'Formal, Casual',
    length: 'N/A',
    closureType: 'Zipper',
    stretchability: 'N/A',
    shortDescription: 'Elegant designer handbag for special occasions.',
    fullDescription: 'This elegant designer handbag is crafted from genuine leather, offering both style and durability. The spacious interior provides ample room for all your essentials while sleek design adds a touch of sophistication to any outfit.',
    keyFeatures: 'Genuine leather, Spacious interior, Multiple compartments, Stylish design, Durable',
    washMethod: 'Professional clean only',
    ironingDetails: 'N/A',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-8a5f06e68d7a?w=400&h=500&fit=crop'
    ],
    videoLink: 'https://www.instagram.com/p/CQ8XJ2vJ_5d/',
    instagramLink: 'https://www.instagram.com/p/CQ8XJ2vJ_5d/',
    packageDimensions: '30x20x15 cm',
    weight: '600g',
    deliveryAvailability: 'Pan India',
    codOption: 'Available',
    sellerAddress: 'Engineers Fashion, 123 Fashion Street, Mumbai, Maharashtra, 400001',
    returnPolicy: '7 days return policy. Product must be unused with all tags intact.',
    // Removed gstPercentage as it will be calculated dynamically
    manufacturerDetails: 'Engineers Fashion Pvt. Ltd., 123 Fashion Street, Mumbai, Maharashtra, 400001',
    countryOfOrigin: 'India'
  },
  {
    id: 8,
    name: 'Luxury Watch',
    brandName: 'Engineers',
    price: 5999,
    credits: '59.99', // Credits calculated as price ÷ 100
    discountedPrice: 5999,
    offer: 'Limited time offer',
    category: 'Accessories',
    subCategory: 'Watches',
    stockQuantity: 15,
    sku: 'LW-008',
    hsnCode: '91021100',
    fitType: 'One Size',
    type: 'Accessories',
    colors: 'Silver, Gold, Rose Gold',
    sizes: 'One Size',
    material: 'Stainless Steel, Leather',
    pattern: 'Solid',
    neckType: 'N/A',
    sleeveType: 'N/A',
    occasion: 'Formal, Casual',
    length: 'N/A',
    closureType: 'Buckle',
    stretchability: 'N/A',
    shortDescription: 'Premium luxury watch with leather strap.',
    fullDescription: 'This premium luxury watch features a stainless steel case with a genuine leather strap. The elegant design makes it suitable for both formal and casual occasions, while precise movement ensures accurate timekeeping.',
    keyFeatures: 'Premium quality, Precise movement, Water resistant, Elegant design, Comfortable leather strap',
    washMethod: 'Wipe with damp cloth',
    ironingDetails: 'N/A',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1542496658-e33a6d0d5046?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop'
    ],
    videoLink: 'https://www.instagram.com/p/CQ8XJ2vJ_5d/',
    instagramLink: 'https://www.instagram.com/p/CQ8XJ2vJ_5d/',
    packageDimensions: '15x10x8 cm',
    weight: '200g',
    deliveryAvailability: 'Pan India',
    codOption: 'Available',
    sellerAddress: 'Engineers Fashion, 123 Fashion Street, Mumbai, Maharashtra, 400001',
    returnPolicy: '7 days return policy. Product must be unused with all tags intact.',
    // Removed gstPercentage as it will be calculated dynamically
    manufacturerDetails: 'Engineers Fashion Pvt. Ltd., 123 Fashion Street, Mumbai, Maharashtra, 400001',
    countryOfOrigin: 'India'
  }
];

// Cart Context
const CartContext = React.createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Function to calculate GST rate based on product price and category
  const getGSTRate = (price, category) => {
    // For clothing items
    if (category === 'Clothing') {
      // Clothes up to ₹2,500 per piece → 5% GST
      if (price <= 2500) {
        return 0.05; // 5%
      }
      // Clothes above ₹2,500 per piece → 18% GST
      else {
        return 0.18; // 18%
      }
    }
    // For accessories and other items
    else {
      // For accessories like watches and handbags, using 18% GST
      // This can be adjusted based on specific GST rules for accessories
      return 0.18; // 18%
    }
  };
  
  const addToCart = (product, selectedSize, selectedColor) => {
    const existingItem = cartItems.find(
      item => item.id === product.id && 
      item.selectedSize === selectedSize && 
      item.selectedColor === selectedColor
    );
    
    if (existingItem) {
      setCartItems(
        cartItems.map(item =>
          item.id === product.id && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          ...product,
          quantity: 1,
          selectedSize,
          selectedColor
        }
      ]);
    }
  };
  
  const removeFromCart = (productId, selectedSize, selectedColor) => {
    setCartItems(
      cartItems.filter(
        item => !(item.id === productId && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor)
      )
    );
  };
  
  const updateQuantity = (productId, selectedSize, selectedColor, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor);
    } else {
      setCartItems(
        cartItems.map(item =>
          item.id === productId && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
            ? { ...item, quantity }
            : item
        )
      );
    }
  };
  
  const moveToWishlist = (productId, selectedSize, selectedColor) => {
    const item = cartItems.find(
      item => item.id === productId && 
      item.selectedSize === selectedSize && 
      item.selectedColor === selectedColor
    );
    
    if (item) {
      removeFromCart(productId, selectedSize, selectedColor);
      
      const existingWishlistItem = wishlistItems.find(
        wItem => wItem.id === productId && 
        wItem.selectedSize === selectedSize && 
        wItem.selectedColor === selectedColor
      );
      
      if (!existingWishlistItem) {
        setWishlistItems([...wishlistItems, item]);
      }
    }
  };
  
  const addToWishlist = (product, selectedSize, selectedColor) => {
    const existingWishlistItem = wishlistItems.find(
      item => item.id === product.id && 
      item.selectedSize === selectedSize && 
      item.selectedColor === selectedColor
    );
    
    if (!existingWishlistItem) {
      setWishlistItems([
        ...wishlistItems,
        {
          ...product,
          quantity: 1,
          selectedSize,
          selectedColor
        }
      ]);
    }
  };
  
  const removeFromWishlist = (productId, selectedSize, selectedColor) => {
    setWishlistItems(
      wishlistItems.filter(
        item => !(item.id === productId && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor)
      )
    );
  };
  
  const moveToCart = (productId, selectedSize, selectedColor) => {
    const item = wishlistItems.find(
      item => item.id === productId && 
      item.selectedSize === selectedSize && 
      item.selectedColor === selectedColor
    );
    
    if (item) {
      removeFromWishlist(productId, selectedSize, selectedColor);
      
      const existingCartItem = cartItems.find(
        cItem => cItem.id === productId && 
        cItem.selectedSize === selectedSize && 
        cItem.selectedColor === selectedColor
      );
      
      if (!existingCartItem) {
        setCartItems([...cartItems, item]);
      }
    }
  };
  
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };
  
  const calculateOriginalTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.originalPrice || item.price) * item.quantity,
      0
    );
  };
  
  const calculateDiscount = () => {
    return calculateOriginalTotal() - calculateTotal();
  };
  
  // Updated GST calculation to apply different rates based on product price and category
  const calculateGST = () => {
    return cartItems.reduce(
      (totalGST, item) => {
        const gstRate = getGSTRate(item.price, item.category);
        return totalGST + Math.round(item.price * item.quantity * gstRate);
      },
      0
    );
  };
  
  const calculateFinalTotal = () => {
    return calculateTotal() + calculateGST();
  };
  
  const placeOrder = (deliveryDetails, paymentMethod) => {
    const newOrder = {
      id: `ORD${Date.now()}`,
      date: new Date().toISOString(),
      status: 'Processing',
      items: [...cartItems],
      deliveryDetails,
      paymentMethod,
      subtotal: calculateTotal(),
      discount: calculateDiscount(),
      gst: calculateGST(),
      total: calculateFinalTotal(),
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    };
    
    setOrders([...orders, newOrder]);
    setCartItems([]);
    
    return newOrder;
  };
  
  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        moveToWishlist,
        addToWishlist,
        removeFromWishlist,
        moveToCart,
        calculateTotal,
        calculateOriginalTotal,
        calculateDiscount,
        calculateGST,
        calculateFinalTotal,
        placeOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Share Product Modal Component
const ShareProductModal = ({ product, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  
  useEffect(() => {
    if (product && isOpen) {
      // Generate shareable URL with product ID
      const baseUrl = window.location.origin;
      const productUrl = `${baseUrl}/product/${product.id}`;
      setShareUrl(productUrl);
    }
  }, [product, isOpen]);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  const handleShare = async (platform) => {
    const shareText = `Check out this ${product.name} from ${product.brand} - Only ₹${product.price}!`;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    
    let shareLink = '';
    
    switch(platform) {
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent(`Check out ${product.name}`)}&body=${encodedText}%20${encodedUrl}`;
        break;
      default:
        // Native share API for mobile
        if (navigator.share) {
          try {
            await navigator.share({
              title: product.name,
              text: shareText,
              url: shareUrl
            });
            return;
          } catch (err) {
            console.log('Error sharing:', err);
          }
        }
        return;
    }
    
    window.open(shareLink, '_blank', 'width=600,height=400');
  };
  
  if (!isOpen || !product) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Share Product</h3>
          <button onClick={onClose} className="p-1">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-16 h-16 object-cover rounded"
          />
          <div>
            <h4 className="font-semibold">{product.name}</h4>
            <p className="text-sm text-gray-500">{product.brand}</p>
            <p className="font-bold">₹{product.price}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Share Link</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
            />
            <button 
              onClick={handleCopyLink}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 mb-2">Share via</p>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => handleShare('whatsapp')}
              className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="w-5 h-5 bg-green-500 rounded-full"></div>
              <span className="text-sm">WhatsApp</span>
            </button>
            <button 
              onClick={() => handleShare('facebook')}
              className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
              <span className="text-sm">Facebook</span>
            </button>
            <button 
              onClick={() => handleShare('twitter')}
              className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="w-5 h-5 bg-sky-500 rounded-full"></div>
              <span className="text-sm">Twitter</span>
            </button>
            <button 
              onClick={() => handleShare('email')}
              className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">@</span>
              </div>
              <span className="text-sm">Email</span>
            </button>
          </div>
        </div>
        
        {navigator.share && (
          <button 
            onClick={() => handleShare('native')}
            className="w-full mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
          >
            More Options
          </button>
        )}
      </div>
    </div>
  );
};

// Product Filter Component
const ProductFilter = ({ 
  filters, 
  handleFilterChange, 
  clearFilters, 
  isFilterOpen, 
  setIsFilterOpen,
  applyFilters
}) => {
  // Discount options now defined within the component
  const discountOptions = [
    { id: '10', label: '10% and above' },
    { id: '20', label: '20% and above' },
    { id: '30', label: '30% and above' },
    { id: '40', label: '40% and above' },
    { id: '50', label: '50% and above' }
  ];
  
  // Extract unique categories from productsData
  const [productCategories, setProductCategories] = useState([]);
  const [productBrands, setProductBrands] = useState([]);
  const [productColors, setProductColors] = useState([]);
  const [productSizes, setProductSizes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Extract filter options from productsData
  useEffect(() => {
    // Extract unique categories and subcategories
    const categoriesMap = new Map();
    productsData.forEach(product => {
      if (product.category && product.subCategory) {
        const key = `${product.category}-${product.subCategory}`;
        if (!categoriesMap.has(key)) {
          categoriesMap.set(key, {
            id: key,
            name: product.subCategory,
            category: product.category,
            count: 0
          });
        }
        categoriesMap.get(key).count++;
      }
    });
    setProductCategories(Array.from(categoriesMap.values()));
    
    // Extract unique brands
    const brandsMap = new Map();
    productsData.forEach(product => {
      if (product.brandName) {
        if (!brandsMap.has(product.brandName)) {
          brandsMap.set(product.brandName, {
            id: product.brandName.toLowerCase(),
            name: product.brandName,
            count: 0
          });
        }
        brandsMap.get(product.brandName).count++;
      }
    });
    setProductBrands(Array.from(brandsMap.values()));
    
    // Extract unique colors
    const colorsSet = new Set();
    productsData.forEach(product => {
      if (product.colors) {
        const colorList = product.colors.split(',').map(c => c.trim());
        colorList.forEach(color => {
          if (color) {
            colorsSet.add(color);
          }
        });
      }
    });
    setProductColors(Array.from(colorsSet));
    
    // Extract unique sizes
    const sizesMap = new Map();
    productsData.forEach(product => {
      if (product.sizes) {
        const sizeList = product.sizes.split(',').map(s => s.trim());
        sizeList.forEach(size => {
          if (size) {
            if (!sizesMap.has(size)) {
              sizesMap.set(size, {
                id: size.toLowerCase(),
                name: size,
                count: 0
              });
            }
            sizesMap.get(size).count++;
          }
        });
      }
    });
    setProductSizes(Array.from(sizesMap.values()));
  }, []);
  
  // Count active filters
  const activeFilterCount = 
    filters.categories.length + 
    filters.brands.length + 
    filters.colors.length + 
    filters.sizes.length + 
    (filters.discount ? 1 : 0) + 
    (filters.minPrice ? 1 : 0) + 
    (filters.maxPrice ? 1 : 0);
  
  // Get filtered categories based on search term
  const filteredCategories = productCategories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get color hex value based on color name
  const getColorHex = (colorName) => {
    const colorMap = {
      'Black': '#000000',
      'Blue': '#1E40AF',
      'Purple': '#7C3AED',
      'Orange': '#F97316',
      'Pink': '#EC4899',
      'Yellow': '#EAB308',
      'Red': '#DC2626',
      'Green': '#16A34A',
      'White': '#FFFFFF',
      'Grey': '#6B7280',
      'Navy': '#1E3A8A',
      'Brown': '#92400E',
      'Tan': '#D97706',
      'Rose Gold': '#E11D48',
      'Silver': '#9CA3AF',
      'Gold': '#F59E0B',
      'Floral': '#EC4899'
    };
    return colorMap[colorName] || '#6B7280';
  };
  
  // Size ordering for better UX
  const getOrderedSizes = () => {
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40'];
    const ordered = [];
    const remaining = [];
    
    productSizes.forEach(size => {
      const index = sizeOrder.indexOf(size.name);
      if (index !== -1) {
        ordered[index] = size;
      } else {
        remaining.push(size);
      }
    });
    
    return [...ordered.filter(Boolean), ...remaining];
  };
  
  return (
    <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block md:w-64 flex-shrink-0`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Filters</h3>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {activeFilterCount}
              </span>
            )}
            <button 
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear All
            </button>
          </div>
        </div>
        
        {/* Search within filters */}
        <div className="mb-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search filters..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm pr-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={16} className="absolute right-2 top-2.5 text-gray-400" />
          </div>
        </div>
        
        {/* Categories */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 flex items-center justify-between">
            Categories
            <button 
              onClick={() => {
                const allCategoryIds = filteredCategories.map(c => c.id);
                if (filters.categories.length === allCategoryIds.length) {
                  handleFilterChange('categories', '');
                } else {
                  allCategoryIds.forEach(id => handleFilterChange('categories', id));
                }
              }}
              className="text-xs text-blue-600 hover:underline"
            >
              {filters.categories.length === filteredCategories.length ? 'Deselect All' : 'Select All'}
            </button>
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {filteredCategories.map((category) => (
              <label key={category.id} className="flex items-center">
                <input 
                  type="checkbox" 
                  className="mr-2"
                  checked={filters.categories.includes(category.id)}
                  onChange={() => handleFilterChange('categories', category.id)}
                />
                <span className="text-sm">{category.name}</span>
                <span className="text-xs text-gray-500 ml-auto">({category.count})</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Brands */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 flex items-center justify-between">
            Brands
            <button 
              onClick={() => {
                const allBrandIds = productBrands.map(b => b.id);
                if (filters.brands.length === allBrandIds.length) {
                  handleFilterChange('brands', '');
                } else {
                  allBrandIds.forEach(id => handleFilterChange('brands', id));
                }
              }}
              className="text-xs text-blue-600 hover:underline"
            >
              {filters.brands.length === productBrands.length ? 'Deselect All' : 'Select All'}
            </button>
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {productBrands.map((brand) => (
              <label key={brand.id} className="flex items-center">
                <input 
                  type="checkbox" 
                  className="mr-2"
                  checked={filters.brands.includes(brand.id)}
                  onChange={() => handleFilterChange('brands', brand.id)}
                />
                <span className="text-sm">{brand.name}</span>
                <span className="text-xs text-gray-500 ml-auto">({brand.count})</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Sizes */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 flex items-center justify-between">
            Sizes
            <button 
              onClick={() => {
                const allSizeIds = productSizes.map(s => s.id);
                if (filters.sizes.length === allSizeIds.length) {
                  handleFilterChange('sizes', '');
                } else {
                  allSizeIds.forEach(id => handleFilterChange('sizes', id));
                }
              }}
              className="text-xs text-blue-600 hover:underline"
            >
              {filters.sizes.length === productSizes.length ? 'Deselect All' : 'Select All'}
            </button>
          </h4>
          <div className="flex flex-wrap gap-2 mb-2">
            {getOrderedSizes().map((size) => (
              <button
                key={size.id}
                className={`px-3 py-1 border rounded text-sm transition-colors font-medium ${
                  filters.sizes.includes(size.id) 
                    ? 'border-blue-600 bg-blue-50 text-blue-600' 
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
                onClick={() => handleFilterChange('sizes', size.id)}
              >
                {size.name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {filters.sizes.map((sizeId, index) => {
              const size = productSizes.find(s => s.id === sizeId);
              return size ? (
                <span 
                  key={index} 
                  className="text-xs bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1"
                >
                  {size.name}
                  <button 
                    onClick={() => handleFilterChange('sizes', sizeId)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X size={12} />
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>
        
        {/* Colors - Updated to Checkbox Format */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 flex items-center justify-between">
            Colors
            <button 
              onClick={() => {
                const allColorIds = productColors.map(c => c); // Colors are strings, so map to themselves
                if (filters.colors.length === allColorIds.length) {
                  handleFilterChange('colors', '');
                } else {
                  allColorIds.forEach(color => handleFilterChange('colors', color));
                }
              }}
              className="text-xs text-blue-600 hover:underline"
            >
              {filters.colors.length === productColors.length ? 'Deselect All' : 'Select All'}
            </button>
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {productColors.map((color, index) => (
              <label key={index} className="flex items-center">
                <input 
                  type="checkbox" 
                  className="mr-2"
                  checked={filters.colors.includes(color)}
                  onChange={() => handleFilterChange('colors', color)}
                />
                <span 
                  className="w-4 h-4 rounded-full border border-gray-300 mr-2"
                  style={{ backgroundColor: getColorHex(color) }}
                />
                <span className="text-sm">{color}</span>
              </label>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {filters.colors.map((color, index) => (
              <span 
                key={index} 
                className="text-xs bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1"
              >
                <span 
                  className="w-3 h-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: getColorHex(color) }}
                />
                {color}
                <button 
                  onClick={() => handleFilterChange('colors', color)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
        
        {/* Discount */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Discount</h4>
          <div className="space-y-2">
            {discountOptions.map((option) => (
              <label key={option.id} className="flex items-center">
                <input 
                  type="radio" 
                  name="discount"
                  className="mr-2"
                  checked={filters.discount === option.id}
                  onChange={() => handleFilterChange('discount', option.id)}
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Price Range */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Price Range</h4>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              placeholder="Min"
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
            <span>-</span>
            <input 
              type="number" 
              placeholder="Max"
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
          </div>
        </div>
        
        {/* Apply Filters Button */}
        <div className="flex gap-2">
          <button 
            onClick={applyFilters}
            className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Apply Filters
          </button>
          <button 
            onClick={() => setIsFilterOpen(false)}
            className="md:hidden py-2 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors font-medium text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Wishlist Page Component
const WishlistPage = ({ setCurrentPage }) => {
  const { wishlistItems, removeFromWishlist, moveToCart } = React.useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const companyDropdownRef = useRef(null);
  
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
      
      <Header 
        setCurrentPage={setCurrentPage} 
        setShowAuth={() => {}} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCompanyDropdownOpen={isCompanyDropdownOpen}
        setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
        companyDropdownRef={companyDropdownRef}
        showSecondaryHeader={true}
        secondaryTitle="My Wishlist"
      />
      
      <div className="max-w-8xl mx-auto px-4 py-8">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added anything to your wishlist yet.</p>
            <button 
              onClick={() => setCurrentPage('landing')}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="relative">
                  <img 
                    src={item.images[0]} 
                    alt={item.name} 
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <button 
                    onClick={() => removeFromWishlist(item.id, item.selectedSize, item.selectedColor)}
                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                  >
                    <X size={16} className="text-gray-600" />
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{item.brand}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">Size: {item.selectedSize}</span>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">Color: {item.selectedColor}</span>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <span className="font-bold text-lg">₹{item.price}</span>
                    {item.originalPrice > item.price && (
                      <span className="text-sm text-gray-500 line-through ml-2">₹{item.originalPrice}</span>
                    )}
                    {item.originalPrice > item.price && (
                      <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded font-bold">
                        {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => moveToCart(item.id, item.selectedSize, item.selectedColor)}
                    className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

// Header Component
const Header = ({ 
  setCurrentPage, 
  setShowAuth, 
  searchQuery, 
  setSearchQuery,
  isCompanyDropdownOpen,
  setIsCompanyDropdownOpen,
  companyDropdownRef,
  user,
  onLogout,
  onProfileClick,
  showSecondaryHeader = false,
  secondaryTitle = '',
  onMenuClick,
  onNavigateToSignup  // Add this new prop
}) => {
  const { cartItems, wishlistItems } = React.useContext(CartContext);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentPage('all');
    }
  };

  return (
    <>
      <header className="sticky top-0 bg-white z-40 border-b border-gray-200 shadow-sm">
        <div className="max-w-8xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Left Section - Logo and Navigation */}
            <div className="flex items-center space-x-8">
              
              {/* Logo */}
              <div className="flex-shrink-0">
                <div className="text-2xl font-bold text-black">ENGINEERS</div>
              </div>
              
              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-6 text-sm font-bold">
                <a 
                  href="#all" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage('all');
                  }}
                  className="text-gray-800 hover:text-black uppercase tracking-wide hover:underline transition-colors"
                >
                  All
                </a>
                
                <a 
                  href="#men" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage('mens');
                  }}
                  className="text-gray-800 hover:text-black uppercase tracking-wide hover:underline transition-colors"
                >
                  Men
                </a>
                
                <a 
                  href="#women" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage('womens');
                  }}
                  className="text-gray-800 hover:text-black uppercase tracking-wide hover:underline transition-colors"
                >
                  Women
                </a>
                
                <a 
                  href="#accessories" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage('accessories');
                  }}
                  className="text-gray-800 hover:text-black uppercase tracking-wide hover:underline transition-colors"
                >
                  Accessories
                </a>
                
                <a 
                  href="#home" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage('landing');
                  }}
                  className="text-gray-800 hover:text-black uppercase tracking-wide hover:underline transition-colors"
                >
                  Home
                </a>
                
                {/* Company Dropdown */}
                <div className="relative" ref={companyDropdownRef}>
                <button 
                onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                className="text-gray-800 hover:text-black uppercase tracking-wide font-bold flex items-center space-x-1 transition-colors"
                >
               <span>Company</span>
                {isCompanyDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
               </button>
                 {isCompanyDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
              <a href="#aboutus" 
               onClick={(e) => {
               e.preventDefault();
               setCurrentPage('aboutus');
              setIsCompanyDropdownOpen(false);
               }}
               className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold">
              About Us
              </a>
              <a href="#news" 
               onClick={(e) => {
               e.preventDefault();
               setCurrentPage('news');
               setIsCompanyDropdownOpen(false);
               }}
               className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold">
               News
              </a>
              <a href="#entrepreneurs" 
              onClick={(e) => {
              e.preventDefault();
              setCurrentPage('entrepreneurs');
              setIsCompanyDropdownOpen(false);
              }}
              className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold">
              Entrepreneurs
              </a>
              <a href="#brand-owners" 
               onClick={(e) => {
               e.preventDefault();
               setCurrentPage('brandowners');
               setIsCompanyDropdownOpen(false);
            }}
             className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold">
             Brand Owners
            </a>
             <a href="#founders" 
             onClick={(e) => {
             e.preventDefault();
             setCurrentPage('founders');
             setIsCompanyDropdownOpen(false);
            }}
            className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold">
            Founders
           </a>
           <a href="#documents" 
            onClick={(e) => {
            e.preventDefault();
            setCurrentPage('documents');
            setIsCompanyDropdownOpen(false);
           }}
          className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold">
          Documents
         </a>
         <a href="#bankings" 
          onClick={(e) => {
          e.preventDefault();
          setCurrentPage('bankings');
          setIsCompanyDropdownOpen(false);
         }}
         className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold">
         Bankings
        </a>
        <a href="#legals" 
         onClick={(e) => {
         e.preventDefault();
         setCurrentPage('legals');
        setIsCompanyDropdownOpen(false);
         }}
         className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold">
         Legals
      </a>
      <a href="#services" 
          onClick={(e) => {
          e.preventDefault();
          setCurrentPage('services');
        }}
         className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold">
         Services
      </a>
      <a href="#contact" 
          onClick={(e) => {
          e.preventDefault();
          setCurrentPage('contact');
        }}
          className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold">
          Contact Us 
      </a>
    </div>
  )}
                </div>
              </div>
            </div>
            
            {/* Right Section - Search, Icons, and Auth Button */}
            <div className="flex items-center gap-4">

              {/* Notification Icon */}
              <div className="flex flex-col items-center justify-center gap-0.5 cursor-pointer">
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" class="cursor-pointer fill-[#333] inline w-5 h-5"
                    viewBox="0 0 371.263 371.263">
                    <path d="M305.402 234.794v-70.54c0-52.396-33.533-98.085-79.702-115.151.539-2.695.838-5.449.838-8.204C226.539 18.324 208.215 0 185.64 0s-40.899 18.324-40.899 40.899c0 2.695.299 5.389.778 7.964-15.868 5.629-30.539 14.551-43.054 26.647-23.593 22.755-36.587 53.354-36.587 86.169v73.115c0 2.575-2.096 4.731-4.731 4.731-22.096 0-40.959 16.647-42.995 37.845-1.138 11.797 2.755 23.533 10.719 32.276 7.904 8.683 19.222 13.713 31.018 13.713h72.217c2.994 26.887 25.869 47.905 53.534 47.905s50.54-21.018 53.534-47.905h72.217c11.797 0 23.114-5.03 31.018-13.713 7.904-8.743 11.797-20.479 10.719-32.276-2.036-21.198-20.958-37.845-42.995-37.845a4.704 4.704 0 0 1-4.731-4.731zM185.64 23.952c9.341 0 16.946 7.605 16.946 16.946 0 .778-.12 1.497-.24 2.275-4.072-.599-8.204-1.018-12.336-1.138-7.126-.24-14.132.24-21.078 1.198-.12-.778-.24-1.497-.24-2.275.002-9.401 7.607-17.006 16.948-17.006zm0 323.358c-14.431 0-26.527-10.3-29.342-23.952h58.683c-2.813 13.653-14.909 23.952-29.341 23.952zm143.655-67.665c.479 5.15-1.138 10.12-4.551 13.892-3.533 3.773-8.204 5.868-13.353 5.868H59.89c-5.15 0-9.82-2.096-13.294-5.868-3.473-3.772-5.09-8.743-4.611-13.892.838-9.042 9.282-16.168 19.162-16.168 15.809 0 28.683-12.874 28.683-28.683v-73.115c0-26.228 10.419-50.719 29.282-68.923 18.024-17.425 41.498-26.887 66.528-26.887 1.198 0 2.335 0 3.533.06 50.839 1.796 92.277 45.929 92.277 98.325v70.54c0 15.809 12.874 28.683 28.683 28.683 9.88 0 18.264 7.126 19.162 16.168z"
                    data-original="#000000" />
                  </svg>
                  <span className="absolute left-auto -ml-1 top-0 rounded-full bg-red-500 px-1 py-0 text-xs text-white">
                    0
                  </span>
                </div>
                <span className="text-[13px] font-semibold text-slate-900">Notifications</span>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="hidden md:flex items-center border border-gray-300 rounded-md px-4 py-2 gap-2 w-72">
                <Search className="w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search Products..." 
                  className="outline-none text-sm flex-1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              
              {/* Wishlist Icon */}
              <div 
                className="flex flex-col items-center justify-center gap-0.5 cursor-pointer"
                onClick={() => setCurrentPage('wishlist')}
              >
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer fill-[#333] inline w-5 h-5"
                    viewBox="0 0 64 64">
                    <path
                      d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"
                      data-original="#000000" />
                  </svg>
                  <span className="absolute left-auto -ml-1 top-0 rounded-full bg-red-500 px-1 py-0 text-xs text-white">
                    {wishlistItems.length}
                  </span>
                </div>
                <span className="text-[13px] font-semibold text-slate-900">Wishlist</span>
              </div>
              
              {/* Cart Icon */}
              <div 
                className="flex flex-col items-center justify-center gap-0.5 cursor-pointer"
                onClick={() => setCurrentPage('cart')}
              >
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" className="cursor-pointer fill-[#333] inline"
                    viewBox="0 0 512 512">
                    <path
                      d="M164.96 300.004h.024c.02 0 .04-.004.059-.004H437a15.003 15.003 0 0 0 14.422-10.879l60-210a15.003 15.003 0 0 0-2.445-13.152A15.006 15.006 0 0 0 497 60H130.367l-10.722-48.254A15.003 15.003 0 0 0 105 0H15C6.715 0 0 6.715 0 15s6.715 15 15 15h77.969c1.898 8.55 51.312 230.918 54.156 243.71C131.184 280.64 120 296.536 120 315c0 24.812 20.188 45 45 45h272c8.285 0 15-6.715 15-15s-6.715-15-15-15H165c-8.27 0-15-6.73-15-15 0-8.258 6.707-14.977 14.96-14.996zM477.114 90l-51.43 180H177.032l-40-180zM150 405c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm167 15c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm0 0"
                      data-original="#000000"></path>
                  </svg>
                  <span className="absolute left-auto -ml-1 top-0 rounded-full bg-red-500 px-1 py-0 text-xs text-white">
                    {cartItems.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                </div>
                <span className="text-[13px] font-semibold text-slate-900">Cart</span>
              </div>
              
              {/* User Icon */}
              {user ? (
                <div className="flex flex-col items-center justify-center gap-0.5 cursor-pointer" onClick={onProfileClick}>
                  <div className="relative">
                    <User className="w-5 h-5 text-gray-700" />
                    <span className="absolute -top-1 -right-1 bg-green-500 w-2 h-2 rounded-full"></span>
                  </div>
                  <span className="text-[13px] font-semibold text-slate-900">Profile</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-0.5 cursor-pointer">
                  <User className="w-5 h-5 text-gray-700" />
                  <span className="text-[13px] font-semibold text-slate-900">Account</span>
                </div>
              )}
              
              {/* Login/Sign Up Button or Logout */}
              {user ? (
                <button 
                  onClick={onLogout}
                  className="px-5 py-2 text-sm font-bold text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors uppercase tracking-wide"
                >
                  Logout
                </button>
              ) : (
                <button 
                  onClick={onNavigateToSignup}  // Use the new navigation function
                  className="px-5 py-2 text-sm font-bold text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors uppercase tracking-wide"
                >
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {showSecondaryHeader && (
          <div className="bg-gray-50 border-b border-gray-200 py-3">
            <div className="max-w-8xl mx-auto px-4 flex items-center gap-4">
            {showSecondaryHeader && (
             <button onClick={onMenuClick} className="p-1">
              <Menu size={24} />
             </button>
            )}
             <h2 className="text-xl font-bold text-gray-800">{secondaryTitle}</h2>
              <div className="flex items-center gap-2 ml-auto">
              <ShoppingCart size={20} className="text-gray-600" />
               <span className="text-sm font-semibold text-gray-600">
                 {cartItems.reduce((total, item) => total + item.quantity, 0)} Items
               </span>
             </div>
          </div>
        </div>
       )}
    </>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="py-12 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-6">About Us</h3>
            <p className="block text-gray-300 hover:text-white font-semibold">
              We are a leading fashion company dedicated to bringing you the latest trends and styles for both men and women.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Quick Links</h3>
            <div className="space-y-2">
              <a href="#banking" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Banking
              </a>
              <a href="#documents" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Documents
              </a>
              <a href="#business-affiliate" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Business Affiliate
              </a>
              <a href="#register" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Register
              </a>
              <a href="#login" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Login
              </a>
              <a href="#contact" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Contact Us
              </a>
            </div>
          </div>

          {/* Need Help */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Need Help?</h3>
            <div className="space-y-4">
              <a href="#privacy-policy" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Privacy Policy
              </a>
              <a href="#refund-policy" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Refund Policy
              </a>
              <a href="#return-refund-policy" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Return Refund Policy Goods
              </a>
              <a href="#buy-back-policy" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Buy Back Policy
              </a>
              <a href="#grievance-redressal" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Grievance Redressal
              </a>
            </div>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Policies</h3>
            <div className="space-y-4">
              <a href="#terms-policy" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Terms And Policy
              </a>
              <a href="#direct-sellers-agreement" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Direct Sellers Agreement
              </a>
              <a href="#terms-services" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Terms of Services
              </a>
              <a href="#shipping-policy" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Shipping Policy
              </a>
              <a href="#engineers-franchise" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Engineers Franchise
              </a>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h6 className="block text-gray-300 hover:text-white font-semibold">
            Stay connected with us:
          </h6>

          <ul className="flex flex-wrap justify-center gap-x-6 ga-y-3 gap-4 mt-6">
            {/* Facebook */}
            <li>
              <a href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-blue-600 w-8 h-8"
                  viewBox="0 0 49.652 49.652"
                >
                  <path d="M24.826 0C11.137 0 0 11.137 0 24.826c0 13.688 11.137 24.826 24.826 24.826 13.688 0 24.826-11.138 24.826-24.826C49.652 11.137 38.516 0 24.826 0zM31 25.7h-4.039v14.396h-5.985V25.7h-2.845v-5.088h2.845v-3.291c0-2.357 1.12-6.04 6.04-6.04l4.435.017v4.939h-3.219c-.524 0-1.269.262-1.269 1.386v2.99h4.56z" />
                </svg>
              </a>
            </li>

            {/* LinkedIn */}
            <li>
              <a href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  viewBox="0 0 112.196 112.196"
                >
                  <circle cx="56.098" cy="56.097" r="56.098" fill="#007ab9" />
                  <path
                    fill="#fff"
                    d="M89.616 60.611v23.128H76.207V62.161c0-5.418-1.936-9.118-6.791-9.118-3.705 0-5.906 2.491-6.878 4.903-.353.862-.444 2.059-.444 3.268v22.524h-13.41s.18-36.546 0-40.329h13.411v5.715c1.782-2.742 4.96-6.662 12.085-6.662 8.822 0 15.436 5.764 15.436 18.149zM34.656 23.969c-4.587 0-7.588 3.011-7.588 6.967 0 3.872 2.914 6.97 7.412 6.97h.087c4.677 0 7.585-3.098 7.585-6.97-.089-3.956-2.908-6.967-7.496-6.967zM27.865 83.739H41.27v-40.33H27.865v40.33z"
                  />
                </svg>
              </a>
            </li>

            {/* Instagram */}
            <li>
              <a href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  viewBox="0 0 152 152"
                >
                  <defs>
                    <linearGradient
                      id="a"
                      x1="22.26"
                      x2="129.74"
                      y1="22.26"
                      y2="129.74"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0" stopColor="#fae100" />
                      <stop offset=".15" stopColor="#fcb720" />
                      <stop offset=".3" stopColor="#ff7950" />
                      <stop offset=".5" stopColor="#ff1c74" />
                      <stop offset="1" stopColor="#6c1cd1" />
                    </linearGradient>
                  </defs>
                  <g data-name="Layer 2">
                    <g data-name="03.Instagram">
                      <rect
                        width="152"
                        height="152"
                        fill="url(#a)"
                        rx="76"
                      />
                      <g fill="#fff">
                        <path
                          fill="#ffffff10"
                          d="M133.2 26c-11.08 20.34-26.75 41.32-46.33 60.9S46.31 122.12 26 133.2q-1.91-1.66-3.71-3.46A76 76 0 1 1 129.74 22.26q1.8 1.8 3.46 3.74z"
                        />
                        <path d="M94 36H58a22 22 0 0 0-22 22v36a22 22 0 0 0 22 22h36a22 22 0 0 0 22-22V58a22 22 0 0 0-22-22zm15 54.84A18.16 18.16 0 0 1 90.84 109H61.16A18.16 18.16 0 0 1 43 90.84V61.16A18.16 18.16 0 0 1 61.16 43h29.68A18.16 18.16 0 0 1 109 61.16z" />
                        <path d="m90.59 61.56-.19-.19-.16-.16A20.16 20.16 0 0 0 76 55.33 20.52 20.52 0 0 0 55.62 76a20.75 20.75 0 0 0 6 14.61 20.19 20.19 0 0 0 14.42 6 20.73 20.73 0 0 0 14.55-35.05zM76 89.56A13.56 13.56 0 1 1 89.37 76 13.46 13.46 0 0 1 76 89.56zm26.43-35.18a4.88 4.88 0 0 1-4.85 4.92 4.81 4.81 0 0 1-3.42-1.43 4.93 4.93 0 0 1 3.43-8.39 4.82 4.82 0 0 1 3.09 1.12l.1.1a3.05 3.05 0 0 1 .44.44l.11.12a4.92 4.92 0 0 1 1.1 3.12z" />
                      </g>
                    </g>
                  </g>
                </svg>
              </a>
            </li>

            {/* X (Twitter/X) */}
            <li>
              <a href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  viewBox="0 0 1227 1227"
                >
                  <path d="M613.5 0C274.685 0 0 274.685 0 613.5S274.685 1227 613.5 1227 1227 952.315 1227 613.5 952.315 0 613.5 0z" />
                  <path
                    fill="#fff"
                    d="m680.617 557.98 262.632-305.288h-62.235L652.97 517.77 470.833 252.692H260.759l275.427 400.844-275.427 320.142h62.239l240.82-279.931 192.35 279.931h210.074L680.601 557.98zM345.423 299.545h95.595l440.024 629.411h-95.595z"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-400 font-medium">© 2025 Engineers Ecom Pvt Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Shopping Cart Page Component
const ShoppingCartPage = ({ setCurrentPage }) => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    moveToWishlist,
    calculateTotal,
    calculateOriginalTotal,
    calculateDiscount,
    calculateGST,
    calculateFinalTotal
  } = React.useContext(CartContext);
  
  // Function to calculate GST-inclusive price
  const calculateGSTInclusivePrice = (price, category) => {
    // Get GST rate based on price and category
    let gstRate = 0.18; // Default 18%
    if (category === 'Clothing') {
      gstRate = price <= 2500 ? 0.05 : 0.18;
    }
    
    // Calculate GST-inclusive price
    return Math.round(price * (1 + gstRate));
  };
  
  // Function to calculate GST-inclusive total for cart
  const calculateGSTInclusiveTotal = () => {
    return cartItems.reduce((total, item) => {
      const inclusivePrice = calculateGSTInclusivePrice(item.price, item.category);
      return total + (inclusivePrice * item.quantity);
    }, 0);
  };
  
  // Function to calculate GST-inclusive original total
  const calculateGSTInclusiveOriginalTotal = () => {
    return cartItems.reduce((total, item) => {
      const inclusiveOriginalPrice = calculateGSTInclusivePrice(item.originalPrice, item.category);
      return total + (inclusiveOriginalPrice * item.quantity);
    }, 0);
  };
  
  // Function to calculate GST-inclusive discount
  const calculateGSTInclusiveDiscount = () => {
    return calculateGSTInclusiveOriginalTotal() - calculateGSTInclusiveTotal();
  };
  
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const companyDropdownRef = useRef(null);
  
  const handleRemoveClick = (item) => {
    setItemToRemove(item);
    setShowRemoveModal(true);
  };
  
  const confirmRemove = (moveToWishlistOption) => {
    if (moveToWishlistOption) {
      moveToWishlist(itemToRemove.id, itemToRemove.selectedSize, itemToRemove.selectedColor);
    } else {
      removeFromCart(itemToRemove.id, itemToRemove.selectedSize, itemToRemove.selectedColor);
    }
    setShowRemoveModal(false);
    setItemToRemove(null);
  };
  
  const handleMenuClick = (option) => {
    setIsMenuOpen(false);
    if (option === 'orderSummary') {
      setCurrentPage('orderSummary');
    } else if (option === 'orderHistory') {
      setCurrentPage('orderHistory');
    } else if (option === 'orderTracking') {
      setCurrentPage('orderTracking');
    }
  };
  
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
      
      <Header 
        setCurrentPage={setCurrentPage} 
        setShowAuth={() => {}} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCompanyDropdownOpen={isCompanyDropdownOpen}
        setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
        companyDropdownRef={companyDropdownRef}
        showSecondaryHeader={true}
        secondaryTitle="Shopping Cart"
        onMenuClick={() => setIsMenuOpen(!isMenuOpen)}
      />
      
      {/* Menu Dropdown add fixed inset-0 bg-black/60 backdrop-blur-sm*/}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-opacity-50 z-50" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-white w-64 h-full shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Orders</h3>
                <button onClick={() => setIsMenuOpen(false)} className="p-1">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-2">
                <button 
                  onClick={() => handleMenuClick('orderSummary')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded font-semibold"
                >
                  Order Summary
                </button>
                <button 
                  onClick={() => handleMenuClick('orderHistory')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded font-semibold"
                >
                  Order History
                </button>
                <button 
                  onClick={() => handleMenuClick('orderTracking')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded font-semibold"
                >
                  Order Tracking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-8xl mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <button 
              onClick={() => setCurrentPage('landing')}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2">
  <h2 className="text-xl font-bold text-gray-800 mb-6">Cart Items ({cartItems.length})</h2>
  <div className="space-y-4">
    {cartItems.map((item) => {
      const inclusivePrice = calculateGSTInclusivePrice(item.price, item.category);
      const inclusiveOriginalPrice = calculateGSTInclusivePrice(item.originalPrice, item.category);
      const discountPercentage = Math.round((1 - inclusivePrice / inclusiveOriginalPrice) * 100);
      const itemCredits = (inclusivePrice / 10).toFixed(2);
      
      return (
        <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <img 
              src={item.images[0]} 
              alt={item.name} 
              className="w-full md:w-24 h-32 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.brand}</p>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Size: {item.selectedSize}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Color: {item.selectedColor}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Qty: {item.quantity}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="font-bold text-lg">₹{inclusivePrice}</span>
                  {item.originalPrice > item.price && (
                    <span className="text-sm text-gray-500 line-through ml-2">₹{inclusiveOriginalPrice}</span>
                  )}
                  {item.originalPrice > item.price && (
                    <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded font-bold">
                      {discountPercentage}% OFF
                    </span>
                  )}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-white ml-1 shadow-lg">
                    {itemCredits * item.quantity} Credits
                  </span>
                </div>
                
                <div className="flex items-center border border-gray-300 rounded">
                  <button 
                    onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                    className="px-3 py-4 hover:bg-red-100 transition-colors duration-200 flex items-center justify-center disabled:opacity-40"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 min-w-[10px] text-center font-medium">
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                    className="px-3 py-4 hover:bg-green-100 transition-colors duration-200 flex items-center justify-center disabled:opacity-40"
                  >
                    <PlusIcon size={16} />
                  </button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => handleRemoveClick(item)}
                  className="px-3 py-1 border border-red-300 text-red-600 text-sm rounded hover:bg-red-50 transition-colors font-semibold"
                >
                  Remove
                </button>
                <button 
                  onClick={() => moveToWishlist(item.id, item.selectedSize, item.selectedColor)}
                  className="px-3 py-1 border border-blue-300 text-blue-600 text-sm rounded hover:bg-blue-50 transition-colors font-semibold"
                >
                  Move to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
  
  {/* Order Summary */}
  <div className="mt-8 bg-gray-50 rounded-lg p-6">
    <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
    
    <div className="space-y-2 mb-4">
      <div className="flex justify-between">
        <span className="text-gray-600">Total MRP (Inclusive of all taxes)</span>
        <div className="flex items-center">
          <span className="font-semibold">₹{calculateGSTInclusiveTotal()}</span>
          
        </div>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Discount</span>
        <div className="flex items-center">
          <span className="font-semibold text-green-600">-₹{calculateGSTInclusiveDiscount()}</span>
         
        </div>
      </div>
      <div className="flex justify-between text-lg font-bold pt-2 border-t">
        <span>Total</span>
        <div className="flex items-center">
          <span>₹{calculateGSTInclusiveTotal()}</span>
        </div>
      </div>
    </div>
    
    <button 
      onClick={() => setCurrentPage('checkout')}
      className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
    >
      Proceed to Checkout
    </button>
  </div>
</div>
            
            {/* Right Sidebar - Could be empty or have recommendations */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">You may also like</h3>
              
              <div className="space-y-4">
                {productsData.slice(0, 3).map((product) => {
                  const inclusivePrice = calculateGSTInclusivePrice(product.price, product.category);
                  
                  return (
                    <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                      <div className="flex gap-3">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-16 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">{product.name}</h4>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-bold">₹{inclusivePrice}</span>
                              <span className="text-xs text-gray-500 ml-1">(Incl. taxes)</span>
                            </div>
                            <button className="text-blue-600 text-sm hover:underline font-semibold">
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Remove Confirmation Modal */}
      {showRemoveModal && itemToRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">Remove Item</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove "{itemToRemove.name}" from your cart?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => confirmRemove(false)}
                className="flex-1 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors font-semibold"
              >
                Remove
              </button>
              <button 
                onClick={() => confirmRemove(true)}
                className="flex-1 py-2 border border-blue-300 text-blue-600 rounded hover:bg-blue-50 transition-colors font-semibold"
              >
                Move to Wishlist
              </button>
              <button 
                onClick={() => setShowRemoveModal(false)}
                className="flex-1 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

// Checkout Page Component
const CheckoutPage = ({ setCurrentPage }) => {
  const { 
    cartItems, 
    calculateTotal,
    calculateOriginalTotal,
    calculateDiscount,
    calculateGST,
    calculateFinalTotal,
    placeOrder
  } = React.useContext(CartContext);
  
  // Function to calculate GST-inclusive price
  const calculateGSTInclusivePrice = (price, category) => {
    // Get GST rate based on price and category
    let gstRate = 0.18; // Default 18%
    if (category === 'Clothing') {
      gstRate = price <= 2500 ? 0.05 : 0.18;
    }
    
    // Calculate GST-inclusive price
    return Math.round(price * (1 + gstRate));
  };
  
  // Function to calculate GST-inclusive total for cart
  const calculateGSTInclusiveTotal = () => {
    return cartItems.reduce((total, item) => {
      const inclusivePrice = calculateGSTInclusivePrice(item.price, item.category);
      return total + (inclusivePrice * item.quantity);
    }, 0);
  };
  
  // Function to calculate GST-inclusive original total
  const calculateGSTInclusiveOriginalTotal = () => {
    return cartItems.reduce((total, item) => {
      const inclusiveOriginalPrice = calculateGSTInclusivePrice(item.originalPrice, item.category);
      return total + (inclusiveOriginalPrice * item.quantity);
    }, 0);
  };
  
  // Function to calculate GST-inclusive discount
  const calculateGSTInclusiveDiscount = () => {
    return calculateGSTInclusiveOriginalTotal() - calculateGSTInclusiveTotal();
  };
  
  const [deliveryDetails, setDeliveryDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const companyDropdownRef = useRef(null);
  
  // User's available credits (mock data - in a real app, this would come from user context or API)
  const [userCredits] = useState(50); // Example: 50 credits = ₹5000
  
  // Calculate total credits needed for order
  const calculateTotalCredits = () => {
    return Math.ceil(calculateGSTInclusiveTotal() / 100); // 1 Credit = ₹100
  };
  
  // Check if user has enough credits to pay with credits
  const canPayWithCredits = userCredits >= calculateTotalCredits();
  
  // Function to calculate GST rate based on product price and category
  const getGSTRate = (price, category) => {
    // For clothing items
    if (category === 'Clothing') {
      // Clothes up to ₹2,500 per piece → 5% GST
      if (price <= 2500) {
        return 0.05; // 5%
      }
      // Clothes above ₹2,500 per piece → 18% GST
      else {
        return 0.18; // 18%
      }
    }
    // For accessories and other items
    else {
      // For accessories like watches and handbags, using 18% GST
      // This can be adjusted based on specific GST rules for accessories
      return 0.18; // 18%
    }
  };
  
  // Calculate GST breakdown by rate
  const calculateGSTBreakdown = () => {
    const gst5 = cartItems.reduce(
      (total, item) => {
        const gstRate = getGSTRate(item.price, item.category);
        return gstRate === 0.05 ? total + Math.round(item.price * item.quantity * gstRate) : total;
      },
      0
    );
    
    const gst18 = cartItems.reduce(
      (total, item) => {
        const gstRate = getGSTRate(item.price, item.category);
        return gstRate === 0.18 ? total + Math.round(item.price * item.quantity * gstRate) : total;
      },
      0
    );
    
    return { gst5, gst18 };
  };
  
  const { gst5, gst18 } = calculateGSTBreakdown();
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };
  
  const handleCompletePurchase = () => {
    // Validate form
    if (!deliveryDetails.firstName || !deliveryDetails.lastName || 
        !deliveryDetails.email || !deliveryDetails.phone || 
        !deliveryDetails.address || !deliveryDetails.city || 
        !deliveryDetails.state || !deliveryDetails.zipCode) {
      alert('Please fill in all delivery details');
      return;
    }
    
    // Place order
    const newOrder = placeOrder(deliveryDetails, paymentMethod);
    
    // Redirect to order summary
    setCurrentPage('orderSummary');
  };
  
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
      
      {/* Main Header - unchanged but without menu and cart icons */}
      <Header 
        setCurrentPage={setCurrentPage} 
        setShowAuth={() => {}} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCompanyDropdownOpen={isCompanyDropdownOpen}
        setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
        companyDropdownRef={companyDropdownRef}
        showMenuIcon={false}
        showCartIcon={false}
      />
      
      {/* New Dedicated Checkout Secondary Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-8xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Checkout</h2>
            <button 
              onClick={() => setCurrentPage('cart')}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-semibold"
            >
              <ArrowLeft size={18} />
              Back to Cart
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-8xl mx-auto px-4 py-8">
  <div className="grid md:grid-cols-3 gap-8">
    {/* Cart Summary */}
    <div className="md:col-span-2">
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Cart Summary</h2>
        
        <div className="space-y-4 mb-6">
          {cartItems.map((item) => {
            const inclusivePrice = calculateGSTInclusivePrice(item.price, item.category);
            // Updated credit calculation: price divided by 10 instead of 100
            const itemCredits = (inclusivePrice / 10).toFixed(2);
            
            return (
              <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4 pb-4 border-b">
                <img 
                  src={item.images[0]} 
                  alt={item.name} 
                  className="w-16 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                   <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800 mt-2">
                   <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                     </svg>
                   Size: {item.selectedSize}
                   </span>
                   <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800 mt-2">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                     </svg>
                      Color: {item.selectedColor}
                      </span>
                       <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800 mt-2">
                     <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                      Qty: {item.quantity}
                    </span>
                    </div>
                  <div className="flex items-center mb-4">
                    <span className="font-semibold">₹{inclusivePrice * item.quantity}</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-white ml-1 shadow-lg">
                     {itemCredits * item.quantity} Credits
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Total MRP (Inclusive of all taxes)</span>
            <span className="font-semibold">₹{calculateGSTInclusiveTotal()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Discount</span>
            <span className="font-semibold text-green-600">-₹{calculateGSTInclusiveDiscount()}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <div className="flex items-baseline">
              <span>Total</span>
              {/* Updated total credits calculation <span className="text-sm text-gray-500 ml-1">({(calculateGSTInclusiveTotal() / 10).toFixed(2)} Credits)</span> */}  
            </div>
            <div className="flex items-baseline">
              <span>₹{calculateGSTInclusiveTotal()}</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleCompletePurchase}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Complete Purchase
        </button>
      </div>
      
      {/* Delivery Details Form */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Delivery Details</h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input 
              type="text" 
              name="firstName"
              value={deliveryDetails.firstName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input 
              type="text" 
              name="lastName"
              value={deliveryDetails.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            name="email"
            value={deliveryDetails.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input 
            type="tel" 
            name="phone"
            value={deliveryDetails.phone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea 
            name="address"
            value={deliveryDetails.address}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input 
              type="text" 
              name="city"
              value={deliveryDetails.city}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input 
              type="text" 
              name="state"
              value={deliveryDetails.state}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
            <input 
              type="text" 
              name="zipCode"
              value={deliveryDetails.zipCode}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
    
    {/* Payment Section */}
    <div>
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Payment Method</h2>
        
        <div className="space-y-3 mb-6">
          <button 
            onClick={() => handlePaymentMethodChange('card')}
            className={`w-full flex items-center gap-3 p-3 border rounded-md ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          >
            <CreditCard size={20} />
            <span className="font-medium">Card Payment</span>
          </button>
          
          <button 
            onClick={() => handlePaymentMethodChange('upi')}
            className={`w-full flex items-center gap-3 p-3 border rounded-md ${paymentMethod === 'upi' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          >
            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">U</div>
            <span className="font-medium">UPI</span>
          </button>
          
          <button 
            onClick={() => handlePaymentMethodChange('wallet')}
            className={`w-full flex items-center gap-3 p-3 border rounded-md ${paymentMethod === 'wallet' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          >
            <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">W</div>
            <span className="font-medium">Platform Wallet</span>
          </button>
          
          <button 
            onClick={() => handlePaymentMethodChange('credits')}
            className={`w-full flex items-center gap-3 p-3 border rounded-md ${paymentMethod === 'credits' ? 'border-blue-500 bg-blue-50' : canPayWithCredits ? 'border-gray-300' : 'border-gray-200 opacity-50 cursor-not-allowed'}`}
            disabled={!canPayWithCredits}
          >
            <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">C</div>
            <div className="flex-1 text-left">
              <span className="font-medium">Credits</span>
              {!canPayWithCredits && (
                <p className="text-xs text-red-500">Insufficient credits</p>
              )}
            </div>
          </button>
        </div>
        
        {paymentMethod === 'card' && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <input 
                type="text" 
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input 
                  type="text" 
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input 
                  type="text" 
                  placeholder="123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
        
        {paymentMethod === 'upi' && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
              <input 
                type="text" 
                placeholder="yourname@upi"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-semibold">
                Google Pay
              </button>
              <button className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-semibold">
                PhonePe
              </button>
              <button className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-semibold">
                Paytm
              </button>
            </div>
          </div>
        )}
        
        {paymentMethod === 'wallet' && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Wallet Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Income Wallet</option>
                <option>E-Wallet</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Available Balance</label>
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800 font-semibold">₹5,000</p>
              </div>
            </div>
          </div>
        )}
        
        {paymentMethod === 'credits' && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Credits Information</label>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Available Credits:</span>
                  <span className="font-semibold text-purple-800">{userCredits}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Credits Required:</span>
                  {/* Updated credits calculation */}
                  <span className="font-semibold text-purple-800">{(calculateGSTInclusiveTotal() / 10).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Credits Remaining:</span>
                  {/* Updated credits calculation */}
                  <span className="font-semibold text-purple-800">{(userCredits - (calculateGSTInclusiveTotal() / 10)).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex gap-3">
          <button 
            onClick={() => setCurrentPage('cart')}
            className="flex-1 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors font-semibold"
          >
            Continue Shopping
          </button>
          <button 
            onClick={handleCompletePurchase}
            className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
      
      <Footer />
    </div>
  );
};

// Order Summary Page Component
const OrderSummaryPage = ({ setCurrentPage }) => {
  const { orders } = React.useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const companyDropdownRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Get most recent order
  const latestOrder = orders.length > 0 ? orders[orders.length - 1] : null;
  
  // Function to calculate GST-inclusive price
  const calculateGSTInclusivePrice = (price, category) => {
    // Get GST rate based on price and category
    let gstRate = 0.18; // Default 18%
    if (category === 'Clothing') {
      gstRate = price <= 2500 ? 0.05 : 0.18;
    }
    
    // Calculate GST-inclusive price
    return Math.round(price * (1 + gstRate));
  };
  
  // Function to calculate GST rate based on product price and category
  const getGSTRate = (price, category) => {
    // For clothing items
    if (category === 'Clothing') {
      // Clothes up to ₹2,500 per piece → 5% GST
      if (price <= 2500) {
        return 0.05; // 5%
      }
      // Clothes above ₹2,500 per piece → 18% GST
      else {
        return 0.18; // 18%
      }
    }
    // For accessories and other items
    else {
      // For accessories like watches and handbags, using 18% GST
      // This can be adjusted based on specific GST rules for accessories
      return 0.18; // 18%
    }
  };
  
  // Calculate GST breakdown by rate for order
  const calculateGSTBreakdown = (items) => {
    const gst5 = items.reduce(
      (total, item) => {
        const gstRate = getGSTRate(item.price, item.category);
        return gstRate === 0.05 ? total + Math.round(item.price * item.quantity * gstRate) : total;
      },
      0
    );
    
    const gst18 = items.reduce(
      (total, item) => {
        const gstRate = getGSTRate(item.price, item.category);
        return gstRate === 0.18 ? total + Math.round(item.price * item.quantity * gstRate) : total;
      },
      0
    );
    
    return { gst5, gst18 };
  };
  
  // Calculate credits used if payment was made with credits
  const calculateCreditsUsed = () => {
    if (latestOrder && latestOrder.paymentMethod === 'credits') {
      return Math.ceil(latestOrder.total / 100); // 1 Credit = ₹100
    }
    return 0;
  };
  
  // Calculate overall GST rate for order
  const getOverallGSTRate = (items) => {
    const hasGST5 = items.some(item => getGSTRate(item.price, item.category) === 0.05);
    const hasGST18 = items.some(item => getGSTRate(item.price, item.category) === 0.18);
    
    if (hasGST5 && hasGST18) {
      return 'Mixed (5% & 18%)';
    } else if (hasGST5) {
      return '5%';
    } else if (hasGST18) {
      return '18%';
    }
    return '0%';
  };
  
  // Calculate GST-inclusive total for order
  const calculateGSTInclusiveOrderTotal = (items) => {
    return items.reduce((total, item) => {
      const inclusivePrice = calculateGSTInclusivePrice(item.price, item.category);
      return total + (inclusivePrice * item.quantity);
    }, 0);
  };
  
  // Calculate GST-inclusive original total for order
  const calculateGSTInclusiveOriginalTotal = (items) => {
    return items.reduce((total, item) => {
      const inclusiveOriginalPrice = calculateGSTInclusivePrice(item.originalPrice, item.category);
      return total + (inclusiveOriginalPrice * item.quantity);
    }, 0);
  };
  
  // Calculate GST-inclusive discount for order
  const calculateGSTInclusiveDiscount = (items) => {
    return calculateGSTInclusiveOriginalTotal(items) - calculateGSTInclusiveOrderTotal(items);
  };
  
  // Function to handle menu clicks
  const handleMenuClick = (option) => {
    setIsMenuOpen(false);
    if (option === 'cart') {
      setCurrentPage('cart');
    } else if (option === 'orderSummary') {
      setCurrentPage('orderSummary');
    } else if (option === 'orderHistory') {
      setCurrentPage('orderHistory');
    } else if (option === 'orderTracking') {
      setCurrentPage('orderTracking');
    }
  };
  
  const { gst5, gst18 } = latestOrder ? calculateGSTBreakdown(latestOrder.items) : { gst5: 0, gst18: 0 };
  const overallGSTRate = latestOrder ? getOverallGSTRate(latestOrder.items) : '0%';
  const inclusiveOrderTotal = latestOrder ? calculateGSTInclusiveOrderTotal(latestOrder.items) : 0;
  const inclusiveOriginalTotal = latestOrder ? calculateGSTInclusiveOriginalTotal(latestOrder.items) : 0;
  const inclusiveDiscount = latestOrder ? calculateGSTInclusiveDiscount(latestOrder.items) : 0;
  
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
      
      {/* Main Header - without menu and cart icons */}
      <Header 
        setCurrentPage={setCurrentPage} 
        setShowAuth={() => {}} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCompanyDropdownOpen={isCompanyDropdownOpen}
        setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
        companyDropdownRef={companyDropdownRef}
        showMenuIcon={false}
        showCartIcon={false}
      />
      
      {/* Secondary Header with Menu Icon but No Cart Icon */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-8xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Menu Icon - Click to Open Menu */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Menu size={20} />
              </button>
              <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
            </div>
            {/* Right side is empty - no cart icon or continue shopping button */}
          </div>
        </div>
      </div>
      
      {/* Menu Dropdown */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-opacity-50 z-50" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-white w-64 h-full shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Orders</h3>
                <button onClick={() => setIsMenuOpen(false)} className="p-1">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-2">
                <button 
                  onClick={() => handleMenuClick('cart')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded font-semibold"
                >
                  Shopping Cart
                </button>
                <button 
                  onClick={() => handleMenuClick('orderSummary')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded font-semibold"
                >
                  Order Summary
                </button>
                <button 
                  onClick={() => handleMenuClick('orderHistory')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded font-semibold"
                >
                  Order History
                </button>
                <button 
                  onClick={() => handleMenuClick('orderTracking')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded font-semibold"
                >
                  Order Tracking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-8xl mx-auto px-4 py-8">
        {latestOrder ? (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
              <p className="text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Order Details */}
              <div className="md:col-span-2">
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Order Details</h2>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Delivery Date</p>
                      <p className="font-semibold">
                        {new Date(latestOrder.deliveryDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Order ID</p>
                      <p className="font-semibold">{latestOrder.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                      <p className="font-semibold capitalize">
                        {latestOrder.paymentMethod === 'credits' ? `Credits (${calculateCreditsUsed()} credits)` : latestOrder.paymentMethod}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Delivery Address</p>
                      <p className="font-semibold">
                        {latestOrder.deliveryDetails.address}, {latestOrder.deliveryDetails.city}, {latestOrder.deliveryDetails.state} - {latestOrder.deliveryDetails.zipCode}
                      </p>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-gray-800 mb-3">Items in this Order</h3>
                  <div className="space-y-4">
  {latestOrder.items.map((item, index) => {
    const inclusivePrice = calculateGSTInclusivePrice(item.price, item.category);
    // Calculate credits based on the new formula (price/10)
    const itemCredits = (inclusivePrice / 10).toFixed(2);
    
    return (
      <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0 mb-1">
        <img 
          src={item.images[0]} 
          alt={item.name} 
          className="w-16 h-20 object-cover rounded"
        />
        <div className="flex-1">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.brand}</p>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Size: {item.selectedSize}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Color: {item.selectedColor}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Qty: {item.quantity}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="font-bold text-lg">₹{inclusivePrice}</span>
                  {item.originalPrice > item.price && (
                    <span className="text-sm text-gray-500 line-through ml-2">₹{inclusiveOriginalPrice}</span>
                  )}
                  {item.originalPrice > item.price && (
                    <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded font-bold">
                      {discountPercentage}% OFF
                    </span>
                  )}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-white ml-1 shadow-lg">
                    {itemCredits * item.quantity} Credits
                  </span>
                </div>
              </div>
            </div>
      </div>
    );
  })}
</div>
                </div>
              </div>
              
              {/* Billing Details */}
              <div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Billing Details</h2>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal (Inclusive of all taxes)</span>
                      <span className="font-semibold">₹{inclusiveOrderTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold">FREE</span>
                    </div>
                    {latestOrder.paymentMethod === 'credits' && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Credits Used</span>
                        <span className="font-semibold text-purple-600">{calculateCreditsUsed()} Credits</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total</span>
                      <span>₹{inclusiveOrderTotal}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setCurrentPage('orderTracking')}
                      className="flex-1 py-2 border border-blue-300 text-blue-600 rounded hover:bg-blue-50 transition-colors font-semibold"
                    >
                      Track Order
                    </button>
                    <button 
                      onClick={() => setCurrentPage('landing')}
                      className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Found</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <button 
              onClick={() => setCurrentPage('landing')}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

// Order History Page Component
const OrderHistoryPage = ({ setCurrentPage }) => {
  const { orders } = React.useContext(CartContext);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const companyDropdownRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Function to calculate GST-inclusive price
  const calculateGSTInclusivePrice = (price, category) => {
    // Get GST rate based on price and category
    let gstRate = 0.18; // Default 18%
    if (category === 'Clothing') {
      gstRate = price <= 2500 ? 0.05 : 0.18;
    }
    
    // Calculate GST-inclusive price
    return Math.round(price * (1 + gstRate));
  };
  
  // Calculate GST-inclusive total for an order
  const calculateGSTInclusiveOrderTotal = (items) => {
    return items.reduce((total, item) => {
      const inclusivePrice = calculateGSTInclusivePrice(item.price, item.category);
      return total + (inclusivePrice * item.quantity);
    }, 0);
  };
  
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status.toLowerCase() === filter.toLowerCase();
  });
  
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-700 bg-green-100 border border-green-200';
      case 'processing': return 'text-blue-700 bg-blue-100 border border-blue-200';
      case 'cancelled': return 'text-red-700 bg-red-100 border border-red-200';
      default: return 'text-gray-700 bg-gray-100 border border-gray-200';
    }
  };
  
  const calculateCreditsUsed = (order) => {
    if (order.paymentMethod === 'credits') {
      return Math.ceil(order.total / 100);
    }
    return 0;
  };
  
  // Function to handle menu clicks
  const handleMenuClick = (option) => {
    setIsMenuOpen(false);
    if (option === 'cart') {
      setCurrentPage('cart');
    } else if (option === 'orderSummary') {
      setCurrentPage('orderSummary');
    } else if (option === 'orderHistory') {
      setCurrentPage('orderHistory');
    } else if (option === 'orderTracking') {
      setCurrentPage('orderTracking');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        * { font-family: 'Assistant', sans-serif; }
      `}</style>
      
      {/* Main Header - without menu and cart icons */}
      <Header 
        setCurrentPage={setCurrentPage} 
        setShowAuth={() => {}} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCompanyDropdownOpen={isCompanyDropdownOpen}
        setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
        companyDropdownRef={companyDropdownRef}
        showMenuIcon={false}
        showCartIcon={false}
      />
      
      {/* Secondary Header with Menu Icon but No Cart Icon */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-8xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Menu Icon - Click to Open Menu */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Menu size={20} />
              </button>
              <h2 className="text-xl font-bold text-gray-800">Order History</h2>
            </div>
            {/* Right side is empty - no cart icon or continue shopping button */}
          </div>
        </div>
      </div>
      
      {/* Menu Dropdown */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-opacity-50 z-50" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-white w-64 h-full shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Orders</h3>
                <button onClick={() => setIsMenuOpen(false)} className="p-1">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-2">
                <button 
                  onClick={() => handleMenuClick('cart')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded font-semibold"
                >
                  Shopping Cart
                </button>
                <button 
                  onClick={() => handleMenuClick('orderSummary')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded font-semibold"
                >
                  Order Summary
                </button>
                <button 
                  onClick={() => handleMenuClick('orderHistory')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded font-semibold"
                >
                  Order History
                </button>
                <button 
                  onClick={() => handleMenuClick('orderTracking')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded font-semibold"
                >
                  Order Tracking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Full width container */}
      <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded border border-gray-200">
            
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-base font-medium text-gray-700 cursor-pointer outline-none"
            >
              <option value="all">All Orders</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Table Header for visual clarity on Desktop */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-white-100 text-xs font-bold text-gray-500 uppercase tracking-wider rounded-t-lg mb-0">
          <div className="col-span-5 text-left">Product Details</div>
          <div className="col-span-2 text-center">Order Date</div>
          <div className="col-span-3 text-center">Status</div>
          <div className="col-span-2 text-right">Total Amount</div>
        </div>
        
        {filteredOrders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-300">
            <Package size={80} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Found</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
              {filter === 'all' 
                ? "You haven't placed any orders yet. Start exploring our collection." 
                : `You don't have any ${filter} orders.`}
            </p>
            <button 
              onClick={() => setCurrentPage('landing')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg shadow-sm"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredOrders.map((order) => {
              const creditsUsed = calculateCreditsUsed(order);
              const totalCredits = order.items.reduce((sum, item) => sum + (item.credits * item.quantity), 0);
              const inclusiveOrderTotal = calculateGSTInclusiveOrderTotal(order.items);
              
              return (
                <div key={order.id} className="bg-white border-b md:border border-gray-200 hover:bg-gray-10 transition-colors group">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-4 md:px-6 py-4">
                    
                    {/* 1. Left Column: Product Details (Text Left) */}
                    <div className="md:col-span-5 flex items-center gap-4 text-left">
                      <img 
                        src={order.items[0].images[0]} 
                        alt={order.items[0].name} 
                        className="w-16 h-16 object-cover rounded border border-gray-200 bg-gray-100"
                      />
                      <div className="flex flex-col min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{order.items[0].name}</h3>
                        {/* Horizontal Text for ID */}
                        <p className="text-sm text-gray-500 font-medium">
                          Order ID: <span className="text-gray-400">{order.id}</span>
                        </p>
                        {order.items.length > 1 && (
                          <p className="text-xs text-blue-600 mt-0.5">+{order.items.length - 1} more items</p>
                        )}
                      </div>
                    </div>

                    {/* 2. Center Column 1: Date (Text Center) */}
                    <div className="md:col-span-2 flex md:block justify-between items-center text-center">
                       <p className="text-xs text-gray-400 font-bold uppercase md:hidden">Date</p>
                       <p className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                        {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    {/* 3. Center Column 2: Status (Text Center) */}
                    <div className="md:col-span-3 flex md:block justify-between items-center text-center">
                       <p className="text-xs text-gray-400 font-bold uppercase md:hidden">Status</p>
                       <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    {/* 4. Right Column: Amount (Text Right) */}
                    <div className="md:col-span-2 flex md:block justify-between items-center md:items-end text-right flex-col md:flex-row gap-2">
                       <div>
                          <p className="text-sm font-bold text-gray-900 text-lg">₹{inclusiveOrderTotal}</p>
                          {/*<p className="text-xs text-gray-500">({totalCredits} Credits)</p>*/}
                          <p className="text-xs text-gray-500">(Incl. taxes)</p>
                          {creditsUsed > 0 && (
                            <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded border border-purple-200">
                              Paid with Credits
                            </span>
                          )}
                       </div>
                       
                       <button 
                          onClick={() => setCurrentPage('orderTracking')}
                          className="md:opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold text-blue-600 hover:text-blue-700 whitespace-nowrap"
                        >
                          View Details &rarr;
                        </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

// Order Tracking Page Component
const OrderTrackingPage = ({ setCurrentPage }) => {
  const { orders } = React.useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const companyDropdownRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Get most recent order for tracking
  const latestOrder = orders.length > 0 ? orders[orders.length - 1] : null;
  
  // Function to calculate GST-inclusive price
  const calculateGSTInclusivePrice = (price, category) => {
    // Get GST rate based on price and category
    let gstRate = 0.18; // Default 18%
    if (category === 'Clothing') {
      gstRate = price <= 2500 ? 0.05 : 0.18;
    }
    
    // Calculate GST-inclusive price
    return Math.round(price * (1 + gstRate));
  };
  
  // Function to calculate GST rate based on product price and category
  const getGSTRate = (price, category) => {
    // For clothing items
    if (category === 'Clothing') {
      // Clothes up to ₹2,500 per piece → 5% GST
      if (price <= 2500) {
        return 0.05; // 5%
      }
      // Clothes above ₹2,500 per piece → 18% GST
      else {
        return 0.18; // 18%
      }
    }
    // For accessories and other items
    else {
      // For accessories like watches and handbags, using 18% GST
      // This can be adjusted based on specific GST rules for accessories
      return 0.18; // 18%
    }
  };
  
  // Calculate GST breakdown by rate for an order
  const calculateGSTBreakdown = (items) => {
    const gst5 = items.reduce(
      (total, item) => {
        const gstRate = getGSTRate(item.price, item.category);
        return gstRate === 0.05 ? total + Math.round(item.price * item.quantity * gstRate) : total;
      },
      0
    );
    
    const gst18 = items.reduce(
      (total, item) => {
        const gstRate = getGSTRate(item.price, item.category);
        return gstRate === 0.18 ? total + Math.round(item.price * item.quantity * gstRate) : total;
      },
      0
    );
    
    return { gst5, gst18 };
  };
  
  // Calculate GST-inclusive total for an order
  const calculateGSTInclusiveOrderTotal = (items) => {
    return items.reduce((total, item) => {
      const inclusivePrice = calculateGSTInclusivePrice(item.price, item.category);
      return total + (inclusivePrice * item.quantity);
    }, 0);
  };
  
  // Calculate GST-inclusive original total for an order
  const calculateGSTInclusiveOriginalTotal = (items) => {
    return items.reduce((total, item) => {
      const inclusiveOriginalPrice = calculateGSTInclusivePrice(item.originalPrice, item.category);
      return total + (inclusiveOriginalPrice * item.quantity);
    }, 0);
  };
  
  // Calculate GST-inclusive discount for an order
  const calculateGSTInclusiveDiscount = (items) => {
    return calculateGSTInclusiveOriginalTotal(items) - calculateGSTInclusiveOrderTotal(items);
  };
  
  // Calculate credits used for an order
  const calculateCreditsUsed = (order) => {
    if (order.paymentMethod === 'credits') {
      return Math.ceil(order.total / 100); // 1 Credit = ₹100
    }
    return 0;
  };
  
  // Mock tracking stages
  const trackingStages = [
    { 
      name: 'Order Placed', 
      completed: true, 
      date: new Date(latestOrder?.date || Date.now()).toLocaleDateString(),
      icon: <Package size={20} />
    },
    { 
      name: 'Arrived at Courier Warehouse', 
      completed: latestOrder?.status !== 'Processing' ? false : true, 
      date: latestOrder?.status !== 'Processing' ? '' : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      icon: <Home size={20} />
    },
    { 
      name: 'Out for Delivery', 
      completed: latestOrder?.status === 'Completed' ? true : false, 
      date: latestOrder?.status === 'Completed' ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString() : '',
      icon: <Truck size={20} />
    },
    { 
      name: 'Products Delivered', 
      completed: latestOrder?.status === 'Completed' ? true : false, 
      date: latestOrder?.status === 'Completed' ? new Date(latestOrder.deliveryDate).toLocaleDateString() : '',
      icon: <CheckCircle2 size={20} />
    }
  ];
  
  const { gst5, gst18 } = latestOrder ? calculateGSTBreakdown(latestOrder.items) : { gst5: 0, gst18: 0 };
  const creditsUsed = latestOrder ? calculateCreditsUsed(latestOrder) : 0;
  const inclusiveOrderTotal = latestOrder ? calculateGSTInclusiveOrderTotal(latestOrder.items) : 0;
  const inclusiveOriginalTotal = latestOrder ? calculateGSTInclusiveOriginalTotal(latestOrder.items) : 0;
  const inclusiveDiscount = latestOrder ? calculateGSTInclusiveDiscount(latestOrder.items) : 0;
  
  // Function to handle menu clicks
  const handleMenuClick = (option) => {
    setIsMenuOpen(false);
    if (option === 'cart') {
      setCurrentPage('cart');
    } else if (option === 'orderSummary') {
      setCurrentPage('orderSummary');
    } else if (option === 'orderHistory') {
      setCurrentPage('orderHistory');
    } else if (option === 'orderTracking') {
      setCurrentPage('orderTracking');
    }
  };
  
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
      
      {/* Main Header - without menu and cart icons */}
      <Header 
        setCurrentPage={setCurrentPage} 
        setShowAuth={() => {}} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCompanyDropdownOpen={isCompanyDropdownOpen}
        setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
        companyDropdownRef={companyDropdownRef}
        showMenuIcon={false}
        showCartIcon={false}
      />
      
      {/* Secondary Header with Menu Icon but No Cart Icon */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-8xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Menu Icon - Click to Open Menu */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Menu size={20} />
              </button>
              <h2 className="text-xl font-bold text-gray-800">Order Tracking</h2>
            </div>
            {/* Right side is empty - no cart icon or continue shopping button */}
          </div>
        </div>
      </div>
      
      {/* Menu Dropdown */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-opacity-50 z-50" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-white w-64 h-full shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Orders</h3>
                <button onClick={() => setIsMenuOpen(false)} className="p-1">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-2">
                <button 
                  onClick={() => handleMenuClick('cart')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded font-semibold"
                >
                  Shopping Cart
                </button>
                <button 
                  onClick={() => handleMenuClick('orderSummary')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded font-semibold"
                >
                  Order Summary
                </button>
                <button 
                  onClick={() => handleMenuClick('orderHistory')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded font-semibold"
                >
                  Order History
                </button>
                <button 
                  onClick={() => handleMenuClick('orderTracking')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded font-semibold"
                >
                  Order Tracking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-8xl mx-auto px-4 py-8">
        {latestOrder ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-semibold">
                <Download size={18} />
                Download Invoice
              </button>
            </div>
            
            {/* Order Information Grid */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Order Information</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Number</p>
                  <p className="font-semibold">{latestOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Placed Date</p>
                  <p className="font-semibold">
                    {new Date(latestOrder.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Delivered Date</p>
                  <p className="font-semibold">
                    {latestOrder.status === 'Completed' 
                      ? new Date(latestOrder.deliveryDate).toLocaleDateString()
                      : 'Expected in 7 days'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Number of Items</p>
                  <p className="font-semibold">{latestOrder.items.length}</p>
                </div>
              </div>
              
              {latestOrder.paymentMethod === 'credits' && (
                <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
                    <span className="text-purple-800 font-semibold">
                      Paid with {creditsUsed} Credits
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Order Tracking Section */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Order Tracking</h2>
              
              <div className="relative">
                <div className="absolute left-5 top-8 bottom-0 w-0.5 bg-gray-300"></div>
                
                <div className="space-y-6">
                  {trackingStages.map((stage, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${
                        stage.completed ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {stage.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${stage.completed ? 'text-gray-800' : 'text-gray-500'}`}>
                          {stage.name}
                        </h3>
                        {stage.date && (
                          <p className="text-sm text-gray-600">{stage.date}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Items from Order */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Items from this Order</h2>
              
              <div className="space-y-4">
  {latestOrder.items.map((item, index) => {
    const inclusivePrice = calculateGSTInclusivePrice(item.price, item.category);
    // Calculate credits based on the new formula (price/10)
    const itemCredits = (inclusivePrice / 10).toFixed(2);
    
    return (
      <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
        <img 
          src={item.images[0]} 
          alt={item.name} 
          className="w-16 h-20 object-cover rounded"
        />
        <div className="flex-1">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.brand}</p>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Size: {item.selectedSize}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Color: {item.selectedColor}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Qty: {item.quantity}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="font-bold text-lg">₹{inclusivePrice}</span>
                  {item.originalPrice > item.price && (
                    <span className="text-sm text-gray-500 line-through ml-2">₹{inclusiveOriginalPrice}</span>
                  )}
                  {item.originalPrice > item.price && (
                    <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded font-bold">
                      {discountPercentage}% OFF
                    </span>
                  )}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-white ml-1 shadow-lg">
                    {itemCredits * item.quantity} Credits
                  </span>
                </div>
              </div>
            </div>
      </div>
    );
  })}
</div>
            </div>
            
            {/* Billing Details */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Billing Details</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total MRP (Inclusive of all taxes)</span>
                  <span className="font-semibold">₹{inclusiveOrderTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-semibold text-green-600">-₹{inclusiveDiscount}</span>
                </div>
                {latestOrder.paymentMethod === 'credits' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Credits Used</span>
                    <span className="font-semibold text-purple-600">{creditsUsed} Credits</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>₹{inclusiveOrderTotal}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Found</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <button 
              onClick={() => setCurrentPage('landing')}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

// Category Page Component with GST-inclusive pricing
const CategoryPage = ({ category, setCurrentPage, searchQuery, setSearchQuery }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [activeProductSlide, setActiveProductSlide] = useState(0);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    colors: [],
    sizes: [],
    discount: '',
    minPrice: '',
    maxPrice: ''
  });
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const companyDropdownRef = useRef(null);
  // Add these state variables at the top of your component
  const [deliveryPincode, setDeliveryPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  // Add this function to handle checking delivery availability
  const checkDeliveryAvailability = (pincode) => {
    if (!pincode || pincode.length < 6) {
      alert('Please enter a valid pincode');
      return;
    }
  
    // Here you would typically make an API call to check delivery availability
    // For now, I'm just showing a mock response
    setDeliveryInfo({
      estimatedDays: '3-5',
      deliveryCharge: 'FREE',
      returnAvailable: true
    });
  };
  
  const { addToCart, addToWishlist } = React.useContext(CartContext);
  
  // Function to calculate GST-inclusive price
  const calculateGSTInclusivePrice = (price, category) => {
    // Get GST rate based on price and category
    let gstRate = 0.18; // Default 18%
    if (category === 'Clothing') {
      gstRate = price <= 2500 ? 0.05 : 0.18;
    }
    
    // Calculate GST-inclusive price
    return Math.round(price * (1 + gstRate));
  };
  
  // Function to calculate credits based on price (1/100th of the price)
  const calculateCredits = (price) => {
    return (price / 100).toFixed(2);
  };
  
  // Function to calculate GST rate based on product price and category
  const getGSTRate = (price, category) => {
    // For clothing items
    if (category === 'Clothing') {
      // Clothes up to ₹2,500 per piece → 5% GST
      if (price <= 2500) {
        return 0.05; // 5%
      }
      // Clothes above ₹2,500 per piece → 18% GST
      else {
        return 0.18; // 18%
      }
    }
    // For accessories and other items
    else {
      // For accessories like watches and handbags, using 18% GST
      // This can be adjusted based on specific GST rules for accessories
      return 0.18; // 18%
    }
  };
  
  // Filter products based on category
  const getFilteredProducts = () => {
    let products = [];
    
    if (category === 'all') {
      products = productsData;
    } else if (category === 'accessories') {
      products = productsData.filter(p => p.category === 'Accessories');
    } else if (category === 'mens') {
      products = productsData.filter(p => p.category === 'Clothing' && 
        (p.subCategory?.includes('Shirt') || p.subCategory?.includes('Jeans') || 
         p.subCategory?.includes('Pants') || p.subCategory?.includes('Jacket')));
    } else if (category === 'womens') {
      products = productsData.filter(p => p.category === 'Clothing' && 
        (p.subCategory?.includes('Dress') || p.subCategory?.includes('Skirt') || 
         p.subCategory?.includes('Blouse')));
    }
    
    // Apply additional filters
    if (filters.categories.length > 0) {
      products = products.filter(p => 
        filters.categories.some(cat => p.subCategory?.toLowerCase().includes(cat.toLowerCase()))
      );
    }
    
    if (filters.brands.length > 0) {
      products = products.filter(p => 
        filters.brands.includes(p.brandName?.toLowerCase())
      );
    }
    
    if (filters.colors.length > 0) {
      products = products.filter(p => 
        p.colors && filters.colors.some(color => 
          p.colors.toLowerCase().includes(color.toLowerCase())
        )
      );
    }
    
    if (filters.sizes.length > 0) {
      products = products.filter(p => 
        p.sizes && filters.sizes.some(size => 
          p.sizes.toLowerCase().includes(size.toLowerCase())
        )
      );
    }
    
    if (filters.discount) {
      const minDiscount = parseInt(filters.discount);
      products = products.filter(p => {
        const originalPrice = p.discountedPrice || p.price * 1.2; // Fallback if no discounted price
        const discount = Math.round((1 - p.price / originalPrice) * 100);
        return discount >= minDiscount;
      });
    }
    
    if (filters.minPrice) {
      products = products.filter(p => p.price >= parseInt(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      products = products.filter(p => p.price <= parseInt(filters.maxPrice));
    }
    
    return products;
  };
  
  // Filter products based on search query
  const filteredProducts = getFilteredProducts().filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getPageTitle = () => {
    switch(category) {
      case 'all': return 'All Products';
      case 'mens': return "Men's Fashion";
      case 'womens': return "Women's Fashion";
      case 'accessories': return 'Accessories';
      default: return 'Products';
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already handled by filteredProducts
  };
  
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (filterType === 'discount' || filterType === 'minPrice' || filterType === 'maxPrice') {
        return { ...prev, [filterType]: value };
      } else {
        const updatedValues = [...prev[filterType]];
        if (updatedValues.includes(value)) {
          return { ...prev, [filterType]: updatedValues.filter(v => v !== value) };
        } else {
          return { ...prev, [filterType]: [...updatedValues, value] };
        }
      }
    });
  };
  
  const clearFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      colors: [],
      sizes: [],
      discount: '',
      minPrice: '',
      maxPrice: ''
    });
  };
  
  const handleAddToCart = (product) => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }
    
    addToCart(product, selectedSize, selectedColor);
    setProductModalOpen(false);
    alert('Product added to cart!');
  };
  
  const handleAddToWishlist = (product) => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }
    
    addToWishlist(product, selectedSize, selectedColor);
    alert('Product added to wishlist!');
  };
  
  const handleShareProduct = (product) => {
    setSelectedProduct(product);
    setShareModalOpen(true);
  };
  
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
      
      <Header 
        setCurrentPage={setCurrentPage} 
        setShowAuth={setShowAuth} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCompanyDropdownOpen={isCompanyDropdownOpen}
        setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
        companyDropdownRef={companyDropdownRef}
      />
      
      {/* Category Header */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-8xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{getPageTitle()}</h1>
          <p className="text-gray-600 text-lg">
            {category === 'all' 
              ? 'Explore our complete collection of fashion products' 
              : `Discover our latest ${category === 'mens' ? "men's" : category === 'womens' ? "women's" : ''} fashion collection`}
          </p>
        </div>
      </section>
      
      {/* Products Grid with Filter */}
      <section className="py-12">
        <div className="max-w-8xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filter Section */}
            <ProductFilter 
              filters={filters}
              handleFilterChange={handleFilterChange}
              clearFilters={clearFilters}
              isFilterOpen={isFilterOpen}
              setIsFilterOpen={setIsFilterOpen}
            />
            
            {/* Products Section -hover:shadow-xl- , rounded-lg shadow-md*/}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {filteredProducts.length} Products Found
                </h2>
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md"
                >
                  <Filter size={18} />
                  <span>Filters</span>
                </button>
              </div>
              
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                  <button 
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => {
                    const inclusivePrice = calculateGSTInclusivePrice(product.price, product.category);
                    const inclusiveDiscountedPrice = product.discountedPrice 
                      ? calculateGSTInclusivePrice(product.discountedPrice, product.category)
                      : null;
                    const credits = calculateCredits(inclusivePrice);
                    
                    return (
                      <div key={product.id} className="bg-white overflow-hidden group transition-shadow">
                        <div className="relative">
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="w-full h-64 object-cover"
                          />
                          <button 
                            onClick={() => {
                              setSelectedProduct(product);
                              setSelectedSize(product.sizes ? product.sizes.split(',')[0].trim() : '');
                              setSelectedColor(product.colors ? product.colors.split(',')[0].trim() : '');
                              setProductModalOpen(true);
                            }}
                            className="absolute inset-0 flex items-center justify-center transition-all"
                          >
                          </button>
                          {product.discountedPrice && product.price < product.discountedPrice && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold">
                              {Math.round((1 - inclusivePrice / inclusiveDiscountedPrice) * 100)}% OFF
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4">
                          <p className="text-sm text-gray-500 mb-1 font-semibold">{product.brandName}</p>
                          <h4 className="font-semibold mb-2">{product.name}</h4>
                          
                          <div className="flex items-center mb-2">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} fill={i < Math.floor(product.rating || 4) ? "currentColor" : "none"} />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 ml-1 font-semibold">({product.reviews || 100})</span>
                          </div>
                          
                          <div className="flex items-center mb-2">
                            <div className="flex items-center center mb-2">
                              <span className="font-bold text-lg">₹{inclusivePrice}</span>
                              <span className="text-xs text-gray-500 ml-1 font-semibold">({credits})</span>
                            </div>
                            {product.discountedPrice && product.price < product.discountedPrice && (
                              <span className="text-sm text-gray-500 line-through ml-1">₹{inclusiveDiscountedPrice}</span>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setSelectedProduct(product);
                                setSelectedSize(product.sizes ? product.sizes.split(',')[0].trim() : '');
                                setSelectedColor(product.colors ? product.colors.split(',')[0].trim() : '');
                                setProductModalOpen(true);
                              }}
                              className="flex-1 px-3 py-1.5 border border-blue-600 text-blue-600 text-sm rounded hover:bg-blue-50 transition-colors font-semibold"
                            >
                              View Details
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedProduct(product);
                                setSelectedSize(product.sizes ? product.sizes.split(',')[0].trim() : '');
                                setSelectedColor(product.colors ? product.colors.split(',')[0].trim() : '');
                                handleAddToWishlist(product);
                              }}
                              className="p-1.5 border border-red-600 text-red-600 rounded hover:bg-red-50 transition-colors"
                            >
                              <Heart size={16} />
                            </button>
                            <button 
                              onClick={() => handleShareProduct(product)}
                              className="p-1.5 border border-green-600 text-green-600 rounded hover:bg-green-50 transition-colors"
                            >
                              <Share2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
      
      {/* Product Details Modal Remove - /60 backdrop-blur-sm transition-opacity*/}
      {productModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
                <button onClick={() => setProductModalOpen(false)} className="p-1">
                  <X size={20} />
                </button>
              </div>
             
             <div className="grid md:grid-cols-2 gap-6">
               <div>
                 <div className="relative">
                   <img 
                     src={selectedProduct.images[activeProductSlide]} 
                     alt={selectedProduct.name} 
                     className="w-full h-80 object-cover rounded-lg"
                   />
                   <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                     {selectedProduct.images.map((_, index) => (
                       <button 
                         key={index}
                         onClick={() => setActiveProductSlide(index)}
                         className={`w-2 h-2 rounded-full ${index === activeProductSlide ? 'bg-blue-600' : 'bg-gray-300'}`}
                       />
                     ))}
                   </div>
                 </div>
                 
                 <div className="flex space-x-2 mt-4">
                   {selectedProduct.images.map((image, index) => (
                     <img 
                       key={index}
                       src={image} 
                       alt={`${selectedProduct.name} ${index + 1}`}
                       className={`w-20 h-20 object-cover rounded cursor-pointer ${index === activeProductSlide ? 'ring-2 ring-blue-600' : ''}`}
                       onClick={() => setActiveProductSlide(index)}
                     />
                   ))}
                 </div>

                 {selectedProduct.videoLink && (
                         <div className="mt-4">
                           <h4 className="font-bold mb-2">Product Video</h4>
                           <div className="relative">
                             <div className="bg-gray-200 rounded-lg overflow-hidden h-50 flex items-center justify-center">
                               <div className="text-center">
                                 <div className="bg-gradient-to-r from-pink-500 to-orange-400 bg-opacity-80 rounded-full p-3 inline-block mb-2">
                                   <Instagram size={24} className="text-white" />
                                 </div>
                                 <p className="text-white font-semibold">View on Instagram</p>
                               </div>
                             </div>
                             <a 
                               href={selectedProduct.videoLink} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="absolute inset-0 flex items-center justify-center"
                             >
                             </a>
                           </div>
                         </div>
                       )}  
               </div>
               
               <div>
                 <p className="text-sm text-gray-500 mb-2 font-semibold">{selectedProduct.brandName}</p>
                 <h4 className="text-xl font-bold mb-4">{selectedProduct.name}</h4>
                 
                 <div className="flex items-center mb-4">
                   <div className="flex text-yellow-400">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} size={16} fill={i < Math.floor(selectedProduct.rating || 4) ? "currentColor" : "none"} />
                     ))}
                   </div>
                   <span className="text-sm text-gray-500 ml-2 font-semibold">({selectedProduct.reviews || 100} reviews)</span>
                 </div>
                 
                 <div className="flex items-center mb-2">
                   {(() => {
                     const inclusivePrice = calculateGSTInclusivePrice(selectedProduct.price, selectedProduct.category);
                     const inclusiveDiscountedPrice = selectedProduct.discountedPrice 
                       ? calculateGSTInclusivePrice(selectedProduct.discountedPrice, selectedProduct.category)
                       : null;
                     const credits = calculateCredits(inclusivePrice);
                     
                     return (
                       <>
                         <div className="flex items-center mb-4">
                           <span className="text-2xl font-bold">₹{inclusivePrice}</span>
                           <span className="text-sm text-gray-500 ml-2 font-semibold">({credits})</span>
                           <span className="text-sm text-gray-500 ml-2">(Inclusive of all taxes)</span>
                         </div>
                         {selectedProduct.discountedPrice && selectedProduct.price < selectedProduct.discountedPrice && (
                           <span className="text-lg text-gray-500 line-through ml-3">₹{inclusiveDiscountedPrice}</span>
                         )}
                         {selectedProduct.discountedPrice && selectedProduct.price < selectedProduct.discountedPrice && (
                           <span className="ml-3 bg-red-100 text-red-600 text-sm px-2 py-1 rounded font-bold">
                             {Math.round((1 - inclusivePrice / inclusiveDiscountedPrice) * 100)}% OFF
                           </span>
                         )}
                       </>
                     );
                   })()}
                 </div>
                 
                 <div className="mb-4">
                   <p className="text-sm font-bold mb-2">Fit</p>
                   <p className="text-sm text-gray-600 font-semibold">{selectedProduct.fitType}</p>
                 </div>
                 
                 <div className="mb-4">
                   <p className="text-sm font-bold mb-2">Type</p>
                   <p className="text-sm text-gray-600 font-semibold">{selectedProduct.type}</p>
                 </div>
                 
                 <div className="mb-4">
                   <p className="text-sm font-bold mb-2">Available Colors</p>
                   <div className="flex flex-wrap gap-2">
                     {selectedProduct.colors && selectedProduct.colors.split(',').map((color, index) => (
                       <button 
                         key={index}
                         onClick={() => setSelectedColor(color.trim())}
                         className={`px-3 py-1 border rounded text-sm transition-colors font-semibold ${
                           selectedColor === color.trim() 
                             ? 'border-blue-600 bg-blue-50 text-blue-600' 
                             : 'border-gray-300 hover:bg-gray-100'
                         }`}
                       >
                         {color.trim()}
                       </button>
                     ))}
                   </div>
                 </div>

                 <div className="mb-4">
                   <p className="text-sm font-bold mb-2">Select Size</p>
                   <div className="flex flex-wrap gap-2">
                     {selectedProduct.sizes && selectedProduct.sizes.split(',').map((size, index) => (
                       <button 
                         key={index}
                         onClick={() => setSelectedSize(size.trim())}
                         className={`px-3 py-1 border rounded text-sm transition-colors font-semibold ${
                           selectedSize === size.trim() 
                             ? 'border-blue-600 bg-blue-50 text-blue-600' 
                             : 'border-gray-300 hover:bg-gray-100'
                         }`}
                       >
                         {size.trim()}
                       </button>
                     ))}
                   </div>
                 </div>
                 
                 <div className="mb-4">
                   <p className="text-sm font-bold mb-2">Offers</p>
                   <p className="text-sm text-green-600 font-semibold">{selectedProduct.offer}</p>
                 </div>
                 
                 <div className="flex space-x-3 mt-3">
                   <button 
                     onClick={() => handleAddToWishlist(selectedProduct)}
                     className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center justify-center"
                   >
                     <Heart size={18} className="mr-2" />
                     <span className="text-sm font-bold">Wishlist</span>
                   </button>
                   <button 
                     onClick={() => handleShareProduct(selectedProduct)}
                     className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center justify-center"
                   >
                     <Share2 size={18} className="mr-2" />
                     <span className="text-sm font-bold">Share</span>
                   </button>
                 </div>
                 <div className="flex space-x-3 mt-3">
                         <button 
                           onClick={() => handleAddToCart(selectedProduct)}
                           className="flex-1 py-2 border border-gray-300 bg-gray-800 rounded hover:bg-transparent hover:text-slate-900 text-white text-sm font-medium cursor-pointer transition-all duration-300"
                         >
                           <span className="text-sm font-bold">Buy now</span>
                         </button>
                         <button 
                           onClick={() => handleAddToCart(selectedProduct)}
                           className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center justify-center"
                         >
                           <span className="text-sm font-bold">Add to cart</span>
                         </button>
                       </div>
                       
                       {/* Delivery Pincode Section */}
                       <div className="mt-4 p-3 border border-gray-200 rounded-lg">
                         <p className="text-sm font-bold mb-2">Delivery Pincode:</p>
                         <div className="flex items-center">
                           <input 
                             type="text" 
                             placeholder="Enter" 
                             className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                             onChange={(e) => setDeliveryPincode(e.target.value)}
                             value={deliveryPincode || ''}
                           />
                           <button 
                             className="ml-2 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                             onClick={() => checkDeliveryAvailability(deliveryPincode)}
                           >
                             Check
                           </button>
                         </div>
                         {deliveryInfo && (
                           <div className="mt-3 text-sm">
                             <p className="text-green-600 font-medium mb-1">
                               <span className="font-bold">Estimation:</span> {deliveryInfo.estimatedDays || '3-5'} business days
                             </p>
                             <p className="text-gray-600 font-medium mb-1">
                               <span className="font-bold">Delivery charge:</span> {deliveryInfo.deliveryCharge || 'FREE'}
                             </p>
                             <p className="text-gray-600 font-medium mb-2">
                               <span className="font-bold">Return and Exchange:</span> Available
                             </p>
                             <div className="bg-blue-50 p-2 rounded mt-2">
                               <p className="text-xs text-blue-800">
                                 Return a product and get the amount back as credits! Use them anytime for your next purchase and no expiry, no rush.
                               </p>
                             </div>
                           </div>
                         )}
                       </div>
               </div>
             </div>
             
             <div className="mt-8 border-t pt-6">
               <div className="grid md:grid-cols-3 gap-6">
                 <div>
                   <h5 className="font-bold mb-3">Product Details</h5>
                   <p className="text-sm text-gray-600 font-medium">{selectedProduct.shortDescription}</p>
                 </div>
                 
                 <div>
                   <h5 className="font-bold mb-3">Material & Care</h5>
                   <p className="text-sm text-gray-600 mb-2 font-medium">Material: {selectedProduct.material}</p>
                   <p className="text-sm text-gray-600 font-medium">Care: {selectedProduct.washMethod}</p>
                 </div>
                 
                 <div>
                   <h5 className="font-bold mb-3">Size & Fit</h5>
                   <p className="text-sm text-gray-600 mb-2 font-medium">Fit: {selectedProduct.fitType}</p>
                   <button className="text-sm text-blue-600 hover:underline font-bold">Size Chart</button>
                 </div>
               </div>
             </div>
             
             <div className="mt-6 border-t pt-6">
               <h5 className="font-bold mb-3">Additional Information</h5>
               <div className="grid md:grid-cols-2 gap-4 text-sm">
                 <div>
                   <span className="font-medium">Category:</span> {selectedProduct.category} / {selectedProduct.subCategory}
                 </div>
                 <div>
                   <span className="font-medium">SKU:</span> {selectedProduct.sku}
                 </div>
                 <div>
                   <span className="font-medium">HSN Code:</span> {selectedProduct.hsnCode}
                 </div>
                 <div>
                   <span className="font-medium">Stock:</span> {selectedProduct.stockQuantity} units
                 </div>
                 <div>
                   <span className="font-medium">Package Dimensions:</span> {selectedProduct.packageDimensions}
                 </div>
                 <div>
                   <span className="font-medium">Weight:</span> {selectedProduct.weight}
                 </div>
                 <div>
                   <span className="font-medium">Delivery Availability:</span> {selectedProduct.deliveryAvailability}
                 </div>
                 <div>
                   <span className="font-medium">COD Option:</span> {selectedProduct.codOption}
                 </div>
                 <div>
                   <span className="font-medium">Country of Origin:</span> {selectedProduct.countryOfOrigin}
                 </div>
                 <div>
                   <span className="font-medium">Credits:</span> <span className="text-gray-600 font-semibold">
                     {(() => {
                       const inclusivePrice = calculateGSTInclusivePrice(selectedProduct.price, selectedProduct.category);
                       return calculateCredits(inclusivePrice);
                     })()} Credits
                   </span>
                 </div>
               </div>
             </div>
             
             <div className="mt-6 border-t pt-6">
               <h5 className="font-bold mb-3">Full Description</h5>
               <p className="text-sm text-gray-600 font-medium">{selectedProduct.fullDescription}</p>
             </div>
             
             <div className="mt-6 border-t pt-6">
               <h5 className="font-bold mb-3">Key Features</h5>
               <p className="text-sm text-gray-600 font-medium">{selectedProduct.keyFeatures}</p>
             </div>
             
             <div className="mt-6 border-t pt-6">
               <h5 className="font-bold mb-3">Return Policy</h5>
               <p className="text-sm text-gray-600 font-medium">{selectedProduct.returnPolicy}</p>
             </div>
             
             <div className="mt-6 border-t pt-6">
               <h5 className="font-bold mb-3">Customer Reviews & Ratings</h5>
               <div className="space-y-4">
                 <div className="border-b pb-4">
                   <div className="flex items-center mb-2">
                     <div className="flex text-yellow-400">
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} size={14} fill="currentColor" />
                       ))}
                     </div>
                     <span className="text-sm text-gray-500 ml-2 font-semibold">John Doe</span>
                   </div>
                   <p className="text-sm text-gray-600 font-medium">Great product! Exactly as described and fits perfectly.</p>
                 </div>
                 
                 <div className="border-b pb-4">
                   <div className="flex items-center mb-2">
                     <div className="flex text-yellow-400">
                       {[...Array(4)].map((_, i) => (
                         <Star key={i} size={14} fill="currentColor" />
                       ))}
                       <Star size={14} />
                     </div>
                     <span className="text-sm text-gray-500 ml-2 font-semibold">Jane Smith</span>
                   </div>
                   <p className="text-sm text-gray-600 font-medium">Good quality product. The material is soft and comfortable.</p>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
     )}
     
     {/* Share Product Modal */}
     <ShareProductModal 
       product={selectedProduct}
       isOpen={shareModalOpen}
       onClose={() => setShareModalOpen(false)}
     />
   </div>
 );
};

// About Us Page Component
const AboutUsPage = ({ setCurrentPage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const companyDropdownRef = useRef(null);
  
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        * { font-family: 'Assistant', sans-serif; }
      `}</style>
      
      <Header 
        setCurrentPage={setCurrentPage} 
        setShowAuth={() => {}} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCompanyDropdownOpen={isCompanyDropdownOpen}
        setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
        companyDropdownRef={companyDropdownRef}
      />
      
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">About Our Platform</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A dynamic ecosystem connecting consumers with brand owners, empowering entrepreneurs, and enabling transparent business growth
          </p>
        </div>
      </section>
      
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Platform</h2>
              <p className="text-gray-600 mb-4">
                We've created a comprehensive marketplace that bridges the gap between consumers and brand owners, 
                fostering a community where customers can evolve into entrepreneurs and brand owners can scale their presence 
                through easy product listing and transparent operations.
              </p>
              <p className="text-gray-600">
                Our platform is designed to support everyone regardless of experience, providing tools, resources, 
                and features that enable growth, connection, and opportunity in a fair and open environment.
              </p>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop" 
                alt="About Our Platform" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Equality</h3>
              <p className="text-gray-600">Creating a level playing field where everyone has equal opportunity to succeed</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Openness</h3>
              <p className="text-gray-600">Transparent operations and clear communication with all platform participants</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Opportunity</h3>
              <p className="text-gray-600">Enabling growth and success for customers, entrepreneurs, and brand owners</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Our Ecosystem</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">For Consumers</h3>
              <p className="text-gray-600 mb-4">
                Discover quality products from verified brands and connect directly with brand owners for authentic experiences.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Direct brand connections
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Opportunity to become entrepreneurs
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Rewards and exclusive offers
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">For Entrepreneurs</h3>
              <p className="text-gray-600 mb-4">
                Turn your influence into income by promoting products you love and building your business with our support.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Income on sales
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Training and resources
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Real-time analytics
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">For Brand Owners</h3>
              <p className="text-gray-600 mb-4">
                Scale your business with our comprehensive tools, analytics, and partnership opportunities.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Easy product listing
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Analytics dashboard
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Influencer partnerships
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

const NewsPage = ({ setCurrentPage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const companyDropdownRef = useRef(null);

  const allNewsItems = [
    {
      title: "Platform Analytics Dashboard Update: Real-Time Insights Now Live",
      date: "June 5, 2024",
      excerpt: "Our enhanced analytics dashboard now provides real-time insights, conversion tracking, and detailed audience demographics for all brand owners and entrepreneurs.",
      category: "Platform Enhancement",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop"
    },
    {
      title: "New Brand Integrations: Fashion Forward",
      date: "June 15, 2024",
      excerpt: "We're excited to welcome 15 new fashion brands to our platform, expanding our catalog with trendy and sustainable options.",
      category: "Brand Onboarding",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop"
    },
    {
      title: "Summer Rewards Program Enhanced",
      date: "June 12, 2024",
      excerpt: "Earn double points on all purchases this summer with our improved rewards program featuring tiered benefits and exclusive perks.",
      category: "Rewards",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop"
    },
    {
      title: "Creator Competition: Win Exclusive Partnerships",
      date: "June 10, 2024",
      excerpt: "Top-performing entrepreneurs this month will secure exclusive partnerships with premium brands and earn bonus commissions.",
      category: "Competition",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop"
    },
  ];

  const categories = ['All', 'Brand Onboarding', 'Rewards', 'Competition', 'Platform Enhancement'];

  const filteredNewsItems = selectedCategory === 'All' 
    ? allNewsItems 
    : allNewsItems.filter(item => item.category === selectedCategory);

  const featuredArticle = filteredNewsItems[0];
  const otherNewsItems = filteredNewsItems.slice(1);

  // --- Sub-Component for Category Filter ---
  const CategoryFilter = () => (
    <div className="flex flex-wrap justify-center gap-3 mb-10">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setSelectedCategory(cat)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategory === cat
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );

  // --- Sub-Component for the Featured Article ---
  const FeaturedArticle = ({ article }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12 flex flex-col md:flex-row">
      <div className="md:w-1/2">
        <img src={article.image} alt={article.title} className="w-full h-64 md:h-full object-cover" />
      </div>
      <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
        <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">{article.category}</span>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{article.title}</h2>
        <p className="text-gray-600 mb-6">{article.excerpt}</p>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">{article.date}</p>
          <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
            Read Full Story →
          </button>
        </div>
      </div>
    </div>
  );
  
  // --- Sub-Component for the list of other news ---
  const NewsList = ({ items }) => (
    <div className="space-y-6">
      {items.map((item, index) => (
        <article key={index} className="bg-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row gap-6 hover:shadow-lg transition-shadow">
          <img src={item.image} alt={item.title} className="w-full sm:w-48 h-48 sm:h-auto object-cover rounded-lg" />
          <div className="flex-1">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">{item.category}</span>
            <h3 className="text-xl font-bold text-gray-800 mt-1 mb-2">{item.title}</h3>
            <p className="text-gray-600 mb-4">{item.excerpt}</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{item.date}</p>
              <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                Learn More →
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        * { font-family: 'Assistant', sans-serif; }
      `}</style>
      
      <Header 
        setCurrentPage={setCurrentPage} 
        setShowAuth={() => {}} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCompanyDropdownOpen={isCompanyDropdownOpen}
        setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
        companyDropdownRef={companyDropdownRef}
      />
      
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">News & Announcements</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest platform enhancements, brand integrations, and opportunities for growth.
          </p>
        </div>
      </section>
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CategoryFilter />
        
        {featuredArticle && <FeaturedArticle article={featuredArticle} />}
        
        {otherNewsItems.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">More Updates</h2>
            <NewsList items={otherNewsItems} />
          </section>
        )}
      </main>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Announcement Templates</h2>
          <p className="text-lg text-gray-600 mb-8">
            Create professional announcements with our ready-to-use templates for brand announcements, promotional campaigns, and reward events.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-stretch gap-4">
              <div className="bg-gray-50 p-6 rounded-lg text-center flex-1">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Product Launch</h3>
                <p className="text-sm text-gray-600">Create engaging announcements for new products.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg text-center flex-1">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Promotional Campaign</h3>
                <p className="text-sm text-gray-600">Design compelling offers and discount campaigns.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg text-center flex-1">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Reward Event</h3>
                <p className="text-sm text-gray-600">Announce special rewards and loyalty updates.</p>
              </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

// Entrepreneurs Page Component
const EntrepreneursPage = ({ setCurrentPage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const companyDropdownRef = useRef(null);
  
  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };
  
  const faqs = [
    {
      question: "How do I get started as an entrepreneur on the platform?",
      answer: "Getting started is simple. First, sign up for an entrepreneur account. Then, browse our catalog of partner brands and select products you'd like to promote. Once approved, you'll receive unique referral links and can start promoting through your social channels or other methods."
    },
    {
      question: "How and when do I receive my commissions?",
      answer: "Commissions are calculated in real-time and credited to your wallet. You can track all your earnings through the analytics dashboard. Payouts are processed monthly once you reach the minimum threshold of ₹1,000. You can choose to receive payments via bank transfer or use the balance for platform purchases."
    },
    {
      question: "Are there any fees to join as an entrepreneur?",
      answer: "No, joining as an entrepreneur is completely free. There are no hidden charges or membership fees. You only earn when you make sales, so there's no financial risk in getting started."
    },
    {
      question: "What kind of support can I expect as an entrepreneur?",
      answer: "We provide comprehensive support including training materials, real-time analytics, exclusive promotional access, and a dedicated creator support team. You'll also have access to a community of fellow entrepreneurs where you can share tips and strategies."
    },
    {
      question: "Can I promote products from multiple brands?",
      answer: "Yes, you can promote products from any of our partner brands. In fact, we encourage diversifying your portfolio to maximize your earning potential. You can select products that best align with your audience's interests."
    }
  ];
  
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        * { font-family: 'Assistant', sans-serif; }
      `}</style>
      
      <Header 
        setCurrentPage={setCurrentPage} 
        setShowAuth={() => {}} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCompanyDropdownOpen={isCompanyDropdownOpen}
        setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
        companyDropdownRef={companyDropdownRef}
      />
      
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">For Entrepreneurs</h1>
          <p className="text-xl text-gray-600">Turn your influence into income with our creator platform</p>
        </div>
      </section>
      
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Start earning in three simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Sign Up</h3>
              <p className="text-gray-600">Create your entrepreneur account and complete your profile</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Choose Products</h3>
              <p className="text-gray-600">Select products from partner brands that align with your audience</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Promote & Earn</h3>
              <p className="text-gray-600">Share referral links or create content to earn commissions</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Entrepreneur Benefits</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">Trainings and suppot</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">Real-time analytics dashboard</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">Exclusive promotional access</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">Dedicated creator support team</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">Flexible income structure</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">Community of fellow entrepreneurs</span>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Success Stories</h2>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <img src="" alt="Entrepreneur" className="w-12 h-12 rounded-full mr-4" />
                    <div>
                      <h3 className="font-bold text-gray-800">Name</h3>
                      <p className="text-sm text-gray-600">Fashion Influencer</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"I've been able to turn my passion for fashion into a sustainable income stream. The platform's analytics help me understand what resonates with my audience."</p>
                  <p className="text-blue-600 font-semibold mt-2">Earned ₹45,000 last month</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <img src="" alt="Entrepreneur" className="w-12 h-12 rounded-full mr-4" />
                    <div>
                      <h3 className="font-bold text-gray-800">Name</h3>
                      <p className="text-sm text-gray-600">Entrepreneur</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"The platform has opened up new revenue streams for my content. I love how easy it is to find products that align with my tech-focused audience."</p>
                  <p className="text-blue-600 font-semibold mt-2">Earned ₹62,000 last month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="text-lg font-medium text-gray-800">{faq.question}</h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands of entrepreneurs turning their influence into income</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Join Now
            </button>
            <button className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium">
              Learn More
            </button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

// Brand Owners Page Component
const BrandOwnersPage = ({ setCurrentPage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const companyDropdownRef = useRef(null);
  
  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };
  
  const faqs = [
    {
      question: "What documents are required for brand registration?",
      answer: "You'll need to provide your business registration certificate, GST certificate, brand authorization letter, and identity proof of the authorized signatory."
    },
    {
      question: "How long does the onboarding process take?",
      answer: "Once you submit all required documents, the verification process typically takes 3-5 business days. After verification, you can immediately start uploading your catalog."
    },
    {
      question: "Can I manage my own inventory and pricing?",
      answer: "Yes, you'll have full control over your inventory, pricing, and product listings through our intuitive seller dashboard. You can update these details at any time."
    },
    {
      question: "How does the influencer partnership program work?",
      answer: "Our platform connects you with verified entrepreneurs who can promote your products. You set commission rates and approve influencer applications, giving you full control over your partnerships."
    }
  ];
  
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        * { font-family: 'Assistant', sans-serif; }
      `}</style>
      
      <Header 
        setCurrentPage={setCurrentPage} 
        setShowAuth={() => {}} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCompanyDropdownOpen={isCompanyDropdownOpen}
        setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
        companyDropdownRef={companyDropdownRef}
      />
      
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">For Brand Owners</h1>
          <p className="text-xl text-gray-600">Scale your brand with our comprehensive partnership ecosystem</p>
        </div>
      </section>
      
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Grow Your Brand with Us</h2>
            <p className="text-gray-600 mb-6">
              Partner with us to access a dynamic ecosystem where you can scale your presence through easy product listing, 
              transparent operations, and direct connections with customers and entrepreneurs.
            </p>
            <p className="text-gray-600">
              Our platform provides comprehensive tools designed to support brand growth regardless of your size or experience, 
              embodying our core values of equality, openness, and opportunity.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Catalog Tools</h3>
              <p className="text-gray-600">Easy product listing and inventory management</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">Data-driven insights for strategic growth</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Promotional Features</h3>
              <p className="text-gray-600">Tools to boost visibility and sales</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Influencer Partnerships</h3>
              <p className="text-gray-600">Connect with entrepreneurs to promote your brand</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-8 mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Onboarding Process</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                  1
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Brand Registration</h3>
                <p className="text-gray-600">Create your account and submit basic business information</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                  2
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Document Verification</h3>
                <p className="text-gray-600">Submit required documents for verification</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                  3
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Catalog Upload</h3>
                <p className="text-gray-600">Add your products with images and descriptions</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                  4
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Promotional Activation</h3>
                <p className="text-gray-600">Set up promotions and start selling</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin-Managed Services</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Logistics Management</h3>
                <p className="text-gray-600 mb-4">
                  Let our experienced team handle your logistics, from inventory management to order fulfillment 
                  and delivery, ensuring a seamless experience for your customers.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Warehouse storage
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Order processing and packaging
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Delivery coordination
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Payment Processing</h3>
                <p className="text-gray-600 mb-4">
                  Secure and timely payment processing with detailed transaction reports and automated reconciliation 
                  to ensure smooth financial operations for your business.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Secure payment gateway
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Automated settlement
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Detailed financial reports
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Partner With Us
            </button>
          </div>
        </div>
      </section>
      
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="text-lg font-medium text-gray-800">{faq.question}</h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

// Founders Page Component
const FoundersPage = ({ setCurrentPage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const companyDropdownRef = useRef(null);
  const [showFullTeam, setShowFullTeam] = useState(false);
  
  const founders = [
    {
      name: "Name",
      title: "Designation",
      bio: "Bio"
    },
    {
      name: "Name",
      title: "Designation",
      bio: "Bio"
    },
    {
      name: "Name",
      title: "Designation",
      bio: "Bio"
    }
  ];
  
  const leadershipTeam = [
    {
      name: "Name",
      title: "Designation",
      bio: ""
    },
    {
      name: "Name",
      title: "Designation",
      bio: ""
    },
    {
      name: "Name",
      title: "Designation",
      bio: ""
    },
    {
      name: "Name",
      title: "Designation",
      bio: ""
    },
    {
      name: "Name",
      title: "Designation",
      bio: ""
    },
    {
      name: "Name",
      title: "Designation",
      bio: ""
    }
  ];
  
  const displayTeam = showFullTeam ? [...founders, ...leadershipTeam] : founders;
  
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        * { font-family: 'Assistant', sans-serif; }
      `}</style>
      
      <Header 
        setCurrentPage={setCurrentPage} 
        setShowAuth={() => {}} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCompanyDropdownOpen={isCompanyDropdownOpen}
        setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
        companyDropdownRef={companyDropdownRef}
      />
      
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Founders & Leadership</h1>
          <p className="text-xl text-gray-600">Meet the team driving innovation and strategy at our platform</p>
        </div>
      </section>
      
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayTeam.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.title}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <button 
              onClick={() => setShowFullTeam(!showFullTeam)}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-4"
            >
              {showFullTeam ? 'Show Founders Only' : 'View Full Team'}
            </button>
            <button className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
              Explore Careers
            </button>
          </div>
        </div>
      </section>
      
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Join Our Team</h2>
          <p className="text-xl text-gray-600 mb-8">
            We're always looking for talented individuals who share our passion for innovation and excellence.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Meaningful Work</h3>
              <p className="text-gray-600">Make a real impact on the future of e-commerce</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Growth Opportunities</h3>
              <p className="text-gray-600">Continuous learning and professional development</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Great Culture</h3>
              <p className="text-gray-600">Collaborative environment with work-life balance</p>
            </div>
          </div>
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            View Open Positions
          </button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

// Documents Page Component
const DocumentsPage = ({ setCurrentPage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const companyDropdownRef = useRef(null);
  
  const documents = [
    { 
      name: "Certificate of Incorporation", 
      type: "PDF", 
      size: "1.2 MB", 
      category: "Legal"
    },
    { 
      name: "MCA Registration Certificate", 
      type: "PDF", 
      size: "0.8 MB", 
      category: "Legal"
    },
    { 
      name: "GST Registration Certificate", 
      type: "PDF", 
      size: "0.5 MB", 
      category: "Tax"
    }
  ];
  
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        * { font-family: 'Assistant', sans-serif; }
      `}</style>
      
      <Header 
        setCurrentPage={setCurrentPage} 
        setShowAuth={() => {}} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCompanyDropdownOpen={isCompanyDropdownOpen}
        setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
        companyDropdownRef={companyDropdownRef}
      />
      
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Legal Documentation</h1>
          <p className="text-xl text-gray-600">View our official company registration and tax certificates</p>
        </div>
      </section>
      
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Official Certificates</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {documents.map((doc, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.size}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-blue-600 hover:text-blue-900 font-medium">
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

// Banking & Wallet Top-up Page Component
const BankingsPage = ({ setCurrentPage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const companyDropdownRef = useRef(null);
  
  // State for the upload feature
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle', 'uploading', 'success', 'error'
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus('idle'); // Reset status when a new file is selected
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    setUploadStatus('uploading');

    // Simulate a secure upload process
    setTimeout(() => {
      // In a real app, you would use fetch or Axios to send the file to your server
      console.log('Uploading file:', selectedFile.name);
      
      // Simulate a successful upload
      setUploadStatus('success');
      setSelectedFile(null); // Clear the file input after successful upload
      fileInputRef.current.value = ''; // Reset the actual file input
    }, 2000); // Simulate a 2-second upload time
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };
  
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        * { font-family: 'Assistant', sans-serif; }
      `}</style>
      
      <Header 
        setCurrentPage={setCurrentPage} 
        setShowAuth={() => {}} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCompanyDropdownOpen={isCompanyDropdownOpen}
        setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
        companyDropdownRef={companyDropdownRef}
      />
      
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Banking & Wallet Top-up</h1>
          <p className="text-xl text-gray-600">Secure payment processing and wallet management</p>
        </div>
      </section>
      
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-red-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="text-lg font-medium text-red-800">Security Notice</h3>
                <p className="text-red-700 mt-1">
                  For your security, never share sensitive credentials or banking details outside of our secure in-app upload system. 
                  Our team will never ask for your password or full banking information.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Request Wallet Top-up</h2>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Verified Bank Details</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Account Name</p>
                    <p className="font-semibold">Platform Services Pvt. Ltd.</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Bank Name</p>
                    <p className="font-semibold">National Banking Corporation</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Account Number</p>
                    <p className="font-semibold">XXXX-XXXX-XX12</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">IFSC Code</p>
                    <p className="font-semibold">NBC0000123</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Top-up Process</h3>
                <ol className="space-y-4">
                  <li className="flex">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">1</span>
                    <div>
                      <p className="font-medium">Transfer funds to the verified bank account</p>
                      <p className="text-sm text-gray-600">Use your preferred banking method to transfer funds to our verified account</p>
                    </div>
                  </li>
                  <li className="flex">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">2</span>
                    <div>
                      <p className="font-medium">Upload payment proof</p>
                      <p className="text-sm text-gray-600">Take a screenshot or photo of the transaction confirmation and upload it through our secure portal</p>
                    </div>
                  </li>
                  <li className="flex">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">3</span>
                    <div>
                      <p className="font-medium">Admin verification</p>
                      <p className="text-sm text-gray-600">Our admin team will verify your payment proof within 24 hours</p>
                    </div>
                  </li>
                  <li className="flex">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">4</span>
                    <div>
                      <p className="font-medium">Balance update</p>
                      <p className="text-sm text-gray-600">Once verified, your wallet balance will be updated automatically</p>
                    </div>
                  </li>
                </ol>
              </div>
              
              {/* Secure Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                
                {uploadStatus === 'idle' && (
                  <>
                    <p className="text-lg font-medium text-gray-800 mb-2">Upload Payment Screenshot</p>
                    <p className="text-sm text-gray-600 mb-4">PNG, JPG, or PDF (MAX. 5MB)</p>
                    {selectedFile && (
                      <p className="text-sm text-blue-600 font-medium mb-4">Selected file: {selectedFile.name}</p>
                    )}
                    <button 
                      onClick={triggerFileSelect}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Select File
                    </button>
                  </>
                )}

                {uploadStatus === 'uploading' && (
                  <>
                    <p className="text-lg font-medium text-gray-800 mb-4">Uploading Securely...</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{width: '75%'}}></div>
                    </div>
                  </>
                )}

                {uploadStatus === 'success' && (
                  <>
                    <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-medium text-green-800">Upload Successful!</p>
                    <p className="text-sm text-green-600">Your payment proof has been submitted for verification.</p>
                  </>
                )}
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, application/pdf"
                style={{ display: 'none' }}
              />

              {/* Upload Button (only visible when a file is selected and not uploading) */}
              {selectedFile && uploadStatus === 'idle' && (
                 <div className="mt-6 text-center">
                    <button 
                      onClick={handleUpload}
                      className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Upload Screenshot
                    </button>
                 </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

// Legals Page Component
const LegalsPage = ({ setCurrentPage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const companyDropdownRef = useRef(null);
  
  const legalDocuments = [
    { title: "Privacy Policy", description: "How we collect, use, and protect your information" },
    { title: "Terms of Service", description: "Rules and guidelines for using our platform" },
    { title: "Return Policy", description: "Our return and refund policy for customers" },
    { title: "Shipping Policy", description: "Information about shipping and delivery" },
    { title: "Cookie Policy", description: "How we use cookies and tracking technologies" },
    { title: "Disclaimer", description: "Legal disclaimers and limitations" }
  ];
  
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        * { font-family: 'Assistant', sans-serif; }
      `}</style>
      
      <Header 
        setCurrentPage={setCurrentPage} 
        setShowAuth={() => {}} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCompanyDropdownOpen={isCompanyDropdownOpen}
        setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
        companyDropdownRef={companyDropdownRef}
      />
      
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Legal Information</h1>
          <p className="text-xl text-gray-600">Important legal documents and policies</p>
        </div>
      </section>
      
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {legalDocuments.map((doc, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{doc.title}</h3>
                <p className="text-gray-600 mb-4">{doc.description}</p>
                <button className="text-blue-600 hover:text-blue-800 font-medium">Read More →</button>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

// Services Page Component
const ServicesPage = ({ setCurrentPage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [activeServiceTab, setActiveServiceTab] = useState('customers');
  const companyDropdownRef = useRef(null);
  
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
      
      <Header 
        setCurrentPage={setCurrentPage} 
        setShowAuth={() => {}} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCompanyDropdownOpen={isCompanyDropdownOpen}
        setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
        companyDropdownRef={companyDropdownRef}
      />
      
      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-8xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the comprehensive range of services we offer to enhance your fashion experience, whether you're a customer, brand owner, or entrepreneur.
            </p>
          </div>
        </div>
      </section>
      
      {/* Service Tabs */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-8xl mx-auto">
          <div className="flex flex-wrap justify-center mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveServiceTab('customers')}
              className={`px-6 py-3 font-semibold text-lg border-b-2 transition-colors ${
                activeServiceTab === 'customers' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              For Customers
            </button>
            <button
              onClick={() => setActiveServiceTab('brandowners')}
              className={`px-6 py-3 font-semibold text-lg border-b-2 transition-colors ${
                activeServiceTab === 'brandowners' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              For Brand Owners
            </button>
            <button
              onClick={() => setActiveServiceTab('entrepreneurs')}
              className={`px-6 py-3 font-semibold text-lg border-b-2 transition-colors ${
                activeServiceTab === 'entrepreneurs' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              For Entrepreneurs
            </button>
          </div>
          
          {/* Services for Customers */}
          {activeServiceTab === 'customers' && (
            <div className="py-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Services for Our Customers</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Service 1 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Package size={24} className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Express Delivery</h3>
                  <p className="text-gray-600 mb-4">
                    Get your favorite fashion items delivered within 24-48 hours in major cities. Track your order in real-time.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Same day delivery in select cities</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Real-time order tracking</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Free delivery on orders above ₹999</span>
                    </li>
                  </ul>
                </div>
                
                {/* Service 2 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <User size={24} className="text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Personal Styling</h3>
                  <p className="text-gray-600 mb-4">
                    Get personalized fashion advice from our expert stylists. Book a virtual consultation to find your perfect look.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>One-on-one virtual consultations</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Personalized style recommendations</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Wardrobe planning assistance</span>
                    </li>
                  </ul>
                </div>
                
                {/* Service 3 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Truck size={24} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Easy Returns & Exchanges</h3>
                  <p className="text-gray-600 mb-4">
                    Hassle-free returns and exchanges within 7 days. Our simple process ensures your satisfaction with every purchase.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>7-day return policy</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Free pickup for returns</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Instant refunds to original payment method</span>
                    </li>
                  </ul>
                </div>
                
                {/* Service 4 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                    <Star size={24} className="text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Premium Membership</h3>
                  <p className="text-gray-600 mb-4">
                    Join our exclusive membership program for early access to new collections, special discounts, and VIP treatment.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Early access to sales and new arrivals</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Exclusive member-only discounts</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Free styling sessions</span>
                    </li>
                  </ul>
                </div>
                
                {/* Service 5 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Heart size={24} className="text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Gift Wrapping & Messages</h3>
                  <p className="text-gray-600 mb-4">
                    Make your gifts special with our premium gift wrapping service and personalized message cards.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Premium gift wrapping options</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Personalized message cards</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Direct shipping to recipient</span>
                    </li>
                  </ul>
                </div>
                
                {/* Service 6 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <Calendar size={24} className="text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Try Before You Buy</h3>
                  <p className="text-gray-600 mb-4">
                    Select items can be tried at home before making a purchase decision. No commitment, no pressure.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Try up to 5 items at home</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>7-day trial period</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Free pickup for returns</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* Services for Brand Owners */}
          {activeServiceTab === 'brandowners' && (
            <div className="py-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Services for Brand Owners</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Brand Service 1 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Share2 size={24} className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Marketing & Promotion</h3>
                  <p className="text-gray-600 mb-4">
                    Leverage our marketing expertise to increase brand visibility and reach millions of potential customers.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Social media campaigns</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Email marketing</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Influencer collaborations</span>
                    </li>
                  </ul>
                </div>
                
                {/* Brand Service 2 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Package size={24} className="text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Logistics & Warehousing</h3>
                  <p className="text-gray-600 mb-4">
                    Streamline your operations with our end-to-end logistics solutions, from warehousing to last-mile delivery.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Warehousing facilities</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Inventory management</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Pan India delivery network</span>
                    </li>
                  </ul>
                </div>
                
                {/* Brand Service 3 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <CreditCard size={24} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Payment Solutions</h3>
                  <p className="text-gray-600 mb-4">
                    Secure and flexible payment options for your customers with our integrated payment gateway solutions.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Multiple payment options</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Secure transactions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Quick settlement process</span>
                    </li>
                  </ul>
                </div>
                
                {/* Brand Service 4 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                    <Eye size={24} className="text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Analytics & Insights</h3>
                  <p className="text-gray-600 mb-4">
                    Make data-driven decisions with our comprehensive analytics dashboard that provides valuable customer insights.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Sales analytics</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Customer behavior insights</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Market trend analysis</span>
                    </li>
                  </ul>
                </div>
                
                {/* Brand Service 5 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Upload size={24} className="text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Product Catalog Management</h3>
                  <p className="text-gray-600 mb-4">
                    Easy-to-use tools to manage your product listings, update inventory, and showcase your collections effectively.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Bulk product upload</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Real-time inventory sync</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Product customization options</span>
                    </li>
                  </ul>
                </div>
                
                {/* Brand Service 6 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <User size={24} className="text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Customer Support</h3>
                  <p className="text-gray-600 mb-4">
                    Dedicated customer support team to handle queries, returns, and feedback for your brand.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>24/7 customer support</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Multi-channel support</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Feedback management</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* Services for Entrepreneurs */}
          {activeServiceTab === 'entrepreneurs' && (
            <div className="py-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Services for Entrepreneurs</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Entrepreneur Service 1 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Home size={24} className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Franchise Opportunities</h3>
                  <p className="text-gray-600 mb-4">
                    Partner with us to open an Engineers Fashion franchise in your area with comprehensive support and training.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Low investment requirement</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Complete training program</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Ongoing operational support</span>
                    </li>
                  </ul>
                </div>
                
                {/* Entrepreneur Service 2 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <User size={24} className="text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Business Consultation</h3>
                  <p className="text-gray-600 mb-4">
                    Expert guidance on starting and scaling your fashion business, from business planning to execution.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Business model development</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Financial planning assistance</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Growth strategy development</span>
                    </li>
                  </ul>
                </div>
                
                {/* Entrepreneur Service 3 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Upload size={24} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Supplier Network</h3>
                  <p className="text-gray-600 mb-4">
                    Connect with verified suppliers and manufacturers to source quality materials for your fashion products.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Verified supplier database</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Negotiated bulk pricing</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Quality assurance support</span>
                    </li>
                  </ul>
                </div>
                
                {/* Entrepreneur Service 4 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                    <Star size={24} className="text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Mentorship Program</h3>
                  <p className="text-gray-600 mb-4">
                    Learn from industry experts and successful entrepreneurs through our exclusive mentorship program.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>One-on-one mentorship sessions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Industry expert connections</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Regular networking events</span>
                    </li>
                  </ul>
                </div>
                
                {/* Entrepreneur Service 5 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <CreditCard size={24} className="text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Funding Assistance</h3>
                  <p className="text-gray-600 mb-4">
                    Get connected with investors and financial institutions to secure funding for your fashion startup.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Investor pitch preparation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Business plan development</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Financial modeling assistance</span>
                    </li>
                  </ul>
                </div>
                
                {/* Entrepreneur Service 6 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <MapPin size={24} className="text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Retail Space Solutions</h3>
                  <p className="text-gray-600 mb-4">
                    Find perfect retail space for your fashion business with our location scouting and lease negotiation services.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Prime location identification</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Lease negotiation support</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Store design consultation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-8xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied customers, brand owners, and entrepreneurs who are already benefiting from our services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setCurrentPage('landing')}
              className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Explore Products
            </button>
            <button 
              onClick={() => setCurrentPage('customerRegistration')}
              className="px-8 py-3 bg-transparent text-white border-2 border-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold"
            >
              Register as Customer
            </button>
            <button 
              onClick={() => setCurrentPage('brandOwnerRegistration')}
              className="px-8 py-3 bg-transparent text-white border-2 border-white rounded-lg hover:bg-white hover:text-purple-600 transition-colors font-semibold"
            >
              Register as Brand Owner
            </button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

// Contact Us Page Component
const ContactUsPage = ({ setCurrentPage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'system', text: 'Hello! How can I help you today?' }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [historyFilter, setHistoryFilter] = useState('all');
  const [userName] = useState('User'); // This would come from user context/auth state
  const companyDropdownRef = useRef(null);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'general',
        message: ''
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };
  
  const handleSendMessage = () => {
    if (currentMessage.trim() === '') return;
    
    // Add user message to chat
    const newMessage = { sender: 'user', text: currentMessage };
    setChatMessages(prev => [...prev, newMessage]);
    
    // Clear input
    setCurrentMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = { 
        sender: 'system', 
        text: 'Thank you for your message. Our team will get back to you soon. Is there anything else I can help with?' 
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };
  
  const contactMethods = [
    {
      icon: <Phone size={24} />,
      title: "Phone Support",
      details: "+91 63816 61272",
      description: "Available 24/7 for your assistance"
    },
    {
      icon: <Mail size={24} />,
      title: "Email Support",
      details: "support@engineersfashion.com",
      description: "We respond within 24 hours"
    },
    {
      icon: <MessageCircle size={24} />,
      title: "Live Chat",
      details: "Available on website",
      description: ""
    },
    {
      icon: <MapPin size={24} />,
      title: "Corporate Office",
      details: "123 Fashion Street, Coimatore",
      description: "Coimbatore 400001, India"
    }
  ];
  
  const faqs = [
    {
      question: "How to become an Entrepreneur?",
      answer: "To become an entrepreneur, click on 'Register as Entrepreneur' and complete the registration process. You'll need to provide your business details and complete verification."
    },
    {
      question: "How to become a Brand Owner?",
      answer: "Click on 'Register as Brand Owner' and complete the registration process. Our team will review and approve your application within 48 hours."
    },
    {
      question: "What is the Set Up Portal feature?",
      answer: "The Set Up Portal allows you to create a personalized promotional space for your brand. You can customize the appearance, add products, and manage your brand presence."
    },
    {
      question: "Ways to add money to the E-wallet?",
      answer: "You can add money to your e-wallet through online payments, offline deposits, or by contacting support for assistance with top-ups."
    },
    {
      question: "How can I track my order?",
      answer: "You can track your order by clicking on 'Order Tracking' in your account dashboard. Enter your order ID to get real-time updates."
    },
    {
      question: "What is your return policy?",
      answer: "We offer 7-day return policy. Products must be unused with all tags intact. Free pickup is available for returns."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach us via phone, email, or live chat. Our support team is available 24/7 for your assistance."
    }
  ];
  
  const helpCategories = [
    {
      title: "Getting Started",
      questions: [
        "How to create an account?",
        "How to complete profile verification?",
        "How to navigate the dashboard?"
      ]
    },
    {
      title: "Brand Owner/Partner",
      questions: [
        "How to register as a brand owner?",
        "What documents are needed for verification?",
        "How to list products on the platform?"
      ]
    },
    {
      title: "Portal",
      questions: [
        "How to set up my brand portal?",
        "How to customize portal appearance?",
        "How to manage portal content?"
      ]
    },
    {
      title: "Wallet & Payments",
      questions: [
        "How to add money to e-wallet?",
        "How to withdraw earnings?",
        "What payment methods are accepted?"
      ]
    }
  ];
  
  // Mock chat history data
  const chatHistory = [
    {
      id: 1,
      date: "2023-06-15",
      time: "10:30 AM",
      summary: "Wallet top-up issue",
      category: "wallet",
      messages: [
        { sender: 'user', text: 'I\'m having trouble adding money to my wallet' },
        { sender: 'system', text: 'I understand you\'re having issues with wallet top-up. Let me help you with that.' }
      ]
    },
    {
      id: 2,
      date: "2023-06-10",
      time: "2:45 PM",
      summary: "Brand owner registration",
      category: "brand_owner",
      messages: [
        { sender: 'user', text: 'How do I register as a brand owner?' },
        { sender: 'system', text: 'To register as a brand owner, click on the "Register as Brand Owner" button and follow the steps.' }
      ]
    },
    {
      id: 3,
      date: "2023-06-05",
      time: "9:15 AM",
      summary: "Portal setup assistance",
      category: "portal",
      messages: [
        { sender: 'user', text: 'I need help setting up my portal' },
        { sender: 'system', text: 'I can guide you through the portal setup process. Let\'s start with the basics.' }
      ]
    }
  ];
  
  const filteredHistory = historyFilter === 'all' 
    ? chatHistory 
    : chatHistory.filter(chat => chat.category === historyFilter);
  
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
      
      <Header 
        setCurrentPage={setCurrentPage} 
        setShowAuth={() => {}} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCompanyDropdownOpen={isCompanyDropdownOpen}
        setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
        companyDropdownRef={companyDropdownRef}
      />
      
      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-8xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're here to help! Reach out to us through any of the following channels and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>
      
      {/* Tab Navigation */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-wrap justify-start mb-8 border-b border-gray-200">
         {['home', 'chat', 'help', 'history'].map((tab) => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`px-6 py-3 font-semibold text-lg border-b-2 transition-colors ${
               activeTab === tab
                 ? 'text-blue-600 border-blue-600'
                 : 'text-gray-500 border-transparent hover:text-gray-700'
           }`}
        >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
         ))}
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <div>
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Hello, {userName} 👋</h2>
              <p className="text-lg text-gray-600 mb-6">How can we assist you today?</p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <button 
                  onClick={() => setActiveTab('chat')}
                  className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow flex items-center"
                >
                  <MessageCircle className="text-blue-600 mr-3" size={24} />
                  <span className="font-medium">Chat with Us</span>
                </button>
                
                <button className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow flex items-center">
                  <Clock className="text-blue-600 mr-3" size={24} />
                  <span className="font-medium">Recent Chats</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('help')}
                  className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow flex items-center"
                >
                  <HelpCircle className="text-blue-600 mr-3" size={24} />
                  <span className="font-medium">FAQ</span>
                </button>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {faqs.slice(0, 4).map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <h4 className="font-semibold text-gray-800 mb-2">{faq.question}</h4>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-blue-600 text-white p-4">
                <h3 className="text-lg font-semibold">AI Assistant</h3>
                <p className="text-sm opacity-90">We're here to help with onboarding, account management, and more</p>
              </div>
              
              <div className="h-96 overflow-y-auto p-4 bg-gray-50">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`mb-4 ${message.sender === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}>
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <div className="flex">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your message..."
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Send
                  </button>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Talk to Human Support
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Help Tab */}
        {activeTab === 'help' && (
          <div>
            <div className="mb-8">
              <div className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search for help..."
                />
                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {helpCategories.map((category, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">{category.title}</h3>
                  <ul className="space-y-3">
                    {category.questions.map((question, qIndex) => (
                      <li key={qIndex} className="cursor-pointer hover:text-blue-600">
                        {question}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="mt-12">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details key={index} className="bg-white rounded-lg shadow-md">
                    <summary className="p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800 pr-8">{faq.question}</h3>
                        <ChevronDown size={20} className="text-gray-500" />
                      </div>
                    </summary>
                    <div className="px-6 pb-6">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* History Tab */}
        {activeTab === 'history' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Chat History</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Filter by:</span>
                <select
                  value={historyFilter}
                  onChange={(e) => setHistoryFilter(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="entrepreneur">Entrepreneur Queries</option>
                  <option value="brand_owner">Brand Owner Support</option>
                  <option value="wallet">Wallet Issues</option>
                  <option value="portal">Portal Assistance</option>
                  <option value="general">General Support</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredHistory.map((chat) => (
                <div key={chat.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">{chat.summary}</h4>
                      <p className="text-sm text-gray-600">{chat.date} at {chat.time}</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Full Conversation
                    </button>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-700">
                      {chat.messages[0].sender === 'user' ? 'You: ' : 'Support: '}
                      {chat.messages[0].text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Contact Methods - Only show on Home tab */}
      {activeTab === 'home' && (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-8xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Get in Touch</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{method.title}</h3>
                  <p className="text-gray-900 font-medium mb-1">{method.details}</p>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Contact Form - Only show on Home tab */}
      {activeTab === 'home' && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Send us a Message</h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <X size={24} className="text-red-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800">Error</h3>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle size={24} className="text-green-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">Message Sent Successfully!</h3>
                    <p className="text-green-700">We'll get back to you within 24 hours.</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email address"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Related</option>
                  <option value="return">Return & Refund</option>
                  <option value="payment">Payment Issue</option>
                  <option value="technical">Technical Support</option>
                  <option value="partnership">Partnership</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea 
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us how we can help you..."
                  required
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </section>
      )}
      
      <Footer />
    </div>
  );
};

// Landing Page Component
const LandingPage = ({ setCurrentPage, setUserType, setIsLoggedIn, setShowAuth, onNavigateToSignup }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [activeProductSlide, setActiveProductSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  
  // Refs for dropdown handling
  const companyDropdownRef = useRef(null);
  
  const { addToCart, addToWishlist } = React.useContext(CartContext);
  
  // Auto-scroll products
  useEffect(() => {
    const productContainer = document.getElementById('product-container');
    if (productContainer) {
      const scrollAmount = 1;
      const interval = setInterval(() => {
        if (productContainer.scrollLeft >= productContainer.scrollWidth - productContainer.clientWidth) {
          productContainer.scrollLeft = 0;
        } else {
          productContainer.scrollLeft += scrollAmount;
        }
      }, 30);
      
      return () => clearInterval(interval);
    }
  }, []);
  
  const handleAddToCart = (product) => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }
    
    addToCart(product, selectedSize, selectedColor);
    setProductModalOpen(false);
    alert('Product added to cart!');
  };
  
  const handleAddToWishlist = (product) => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }
    
    addToWishlist(product, selectedSize, selectedColor);
    alert('Product added to wishlist!');
  };
  
  const handleShareProduct = (product) => {
    setSelectedProduct(product);
    setShareModalOpen(true);
  };
  
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
      
      <Header 
        setCurrentPage={setCurrentPage} 
        setShowAuth={setShowAuth} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCompanyDropdownOpen={isCompanyDropdownOpen}
        setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
        companyDropdownRef={companyDropdownRef}
        onNavigateToSignup={onNavigateToSignup}
      />
      
      {/* Hero Section with Video */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-8xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-black mb-4">Welcome to ENGINEERS Fashion</h2>
              <p className="text-gray-600 mb-6">
               Discover premium fashion. Connect customers and brand owners in a network built for the future of fashion.
              </p>
              <div className="flex space-x-4">
                <button className="px-5 py-2 text-sm font-bold text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors tracking-wide">
                  Start Now
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <div className="relative aspect-video bg-gray-200 flex items-center justify-center">
                  <img src="/api/placeholder/600/400" alt="Video" className="w-full h-full object-cover" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      <span>0:00 / 1:05</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Categories Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-8xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Top Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-6 gap-4">
            <a 
              href="#category1" 
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('category1');
              }}
              className="cursor-pointer relative"
            >
              <div className="aspect-square overflow-hidden mx-auto rounded-lg">
                <img 
                  src="" 
                  alt="category1"
                  className="h-full w-full object-cover object-top" 
                />
              </div>
              <div className="mt-4 px-2">
                <h4 className="text-slate-900 text-sm font-semibold">Up To 40% OFF</h4>
                <p className="mt-1 text-xs text-slate-600 font-medium">Engineers fashion</p>
              </div>
            </a>

            <a 
              href="#category2" 
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('category2');
              }}
              className="cursor-pointer relative"
            >
              <div className="aspect-square overflow-hidden mx-auto rounded-lg">
                <img 
                  src="" 
                  alt="category2"
                  className="h-full w-full object-cover object-top" 
                />
              </div>
              <div className="mt-4 px-2">
                <h4 className="text-slate-900 text-sm font-semibold">Fresh Looks</h4>
                <p className="mt-1 text-xs text-slate-600 font-medium">Engineers fashion</p>
              </div>
            </a>

            <a 
              href="#category3" 
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('category3');
              }}
              className="cursor-pointer relative"
            >
              <div className="aspect-square overflow-hidden mx-auto rounded-lg">
                <img 
                  src="" 
                  alt="category3"
                  className="h-full w-full object-cover object-top" 
                />
              </div>
              <div className="mt-4 px-2">
                <h4 className="text-slate-900 text-sm font-semibold">Up To 30% OFF</h4>
                <p className="mt-1 text-xs text-slate-600 font-medium">Engineers fashion</p>
              </div>
            </a>

            <a 
              href="#category4" 
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('category4');
              }}
              className="cursor-pointer relative"
            >
              <div className="aspect-square overflow-hidden mx-auto rounded-lg">
                <img 
                  src="" 
                  alt="category4"
                  className="h-full w-full object-cover object-top" 
                />
              </div>
              <div className="mt-4 px-2">
                <h4 className="text-slate-900 text-sm font-semibold">Exclusive Fashion</h4>
                <p className="mt-1 text-xs text-slate-600 font-medium">Engineers fashion</p>
              </div>
            </a>

            <a 
              href="#category5" 
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('category5');
              }}
              className="cursor-pointer relative"
            >
              <div className="aspect-square overflow-hidden mx-auto rounded-lg">
                <img 
                  src="" 
                  alt="category5"
                  className="h-full w-full object-cover object-top" 
                />
              </div>
              <div className="mt-4 px-2">
                <h4 className="text-slate-900 text-sm font-semibold">Top Picks for Less</h4>
                <p className="mt-1 text-xs text-slate-600 font-medium">Engineers fashion</p>
              </div>
            </a>
          </div>
        </div>
      </section>
       
      {/* Category Links Section transition-transform duration-700 group-hover:scale-105 */}
      <section className="py-2 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white-50 to-white-100">
      <div className="max-w-8xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a 
            href="#women" 
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage('womens');
            }}
            className="group cursor-pointer relative"
          >
            <div className="relative overflow-hidden">
              <img 
                src="" 
                alt="Fashion for Women" 
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-semibold text-black-800">Women</h3>
            </div>
          </a>
          
          <a 
            href="#men" 
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage('mens');
            }}
            className="group cursor-pointer relative"
          >
            <div className="relative overflow-hidden">
              <img 
                src="" 
                alt="Fashion for Men" 
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-semibold text-black-800">Men</h3>
            </div>
          </a>

          <a 
            href="#accessories" 
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage('accessories');
            }}
            className="group cursor-pointer relative"
          >
            <div className="relative overflow-hidden">
              <img 
                src="" 
                alt="Accessories" 
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-semibold text-black-800">Accessories</h3>
            </div>
          </a>
        </div>
      </div>
    </section>
      
      {/* Top Brands Section max-w-8xl mx-auto*/}
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Explore Brands</h2>
               <a  href="/see-all-brands" className="group inline-flex items-center text-lg font-semibold text-slate-900 hover:text-slate-600 transition-all">
                   View all
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                   </svg>
                </a>
          </div>
        <div className="mx-auto max-w-[1400px] px-6 md:px-8 lg:px-16 xl:px-24 pb-12">
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
    {/* First Column */}
    <div className="flex flex-col gap-6">
      {/* Brand Item 1 */}
      <a className="group relative block overflow-hidden rounded-[8px] transition-transform hover:scale-105 h-[230px] w-full" href="/brands/nike">
        <div className="absolute inset-0">
          <img alt="Brand" loading="lazy" decoding="async" className="object-cover" src="" style={{position: "absolute", height: "100%", width: "100%", inset: "0px"}} />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
        <div className="relative flex h-full w-full items-center justify-center p-3 pb-5">
          <h3 className="text-white text-2xl font-bold text-center drop-shadow-lg">Brand</h3>
        </div>
      </a>

      {/* Brand Item 2 */}
      <a className="group relative block overflow-hidden rounded-[8px] transition-transform hover:scale-105 h-[396px] w-full" href="/brands/adidas">
        <div className="absolute inset-0">
          <img alt="Brand" loading="lazy" decoding="async" className="object-cover" src="" style={{position: "absolute", height: "100%", width: "100%", inset: "0px"}} />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
        <div className="relative flex h-full w-full items-center justify-center p-3 pb-5">
          <h3 className="text-white text-2xl font-bold text-center drop-shadow-lg">Brand</h3>
        </div>
      </a>

      {/* Brand Item 3 */}
      <a className="group relative block overflow-hidden rounded-[8px] transition-transform hover:scale-105 h-[330px] w-full" href="/brands/puma">
        <div className="absolute inset-0">
          <img alt="Brand" loading="lazy" decoding="async" className="object-cover" src="" style={{position: "absolute", height: "100%", width: "100%", inset: "0px"}} />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
        <div className="relative flex h-full w-full items-center justify-center p-3 pb-5">
          <h3 className="text-white text-2xl font-bold text-center drop-shadow-lg">Brand</h3>
        </div>
      </a>
    </div>

    {/* Second Column */}
    <div className="flex flex-col gap-6">
      {/* Brand Item 4 */}
      <a className="group relative block overflow-hidden rounded-[8px] transition-transform hover:scale-105 h-[396px] w-full" href="/brands/reebok">
        <div className="absolute inset-0">
          <img alt="Brand" loading="lazy" decoding="async" className="object-cover" src="" style={{position: "absolute", height: "100%", width: "100%", inset: "0px"}} />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
        <div className="relative flex h-full w-full items-center justify-center p-3 pb-5">
          <h3 className="text-white text-2xl font-bold text-center drop-shadow-lg">Brand</h3>
        </div>
      </a>

      {/* Brand Item 5 */}
      <a className="group relative block overflow-hidden rounded-[8px] transition-transform hover:scale-105 h-[330px] w-full" href="/brands/new-balance">
        <div className="absolute inset-0">
          <img alt="Brand" loading="lazy" decoding="async" className="object-cover" src="" style={{position: "absolute", height: "100%", width: "100%", inset: "0px"}} />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
        <div className="relative flex h-full w-full items-center justify-center p-3 pb-5">
          <h3 className="text-white text-2xl font-bold text-center drop-shadow-lg">Brand</h3>
        </div>
      </a>

      {/* Brand Item 6 */}
      <a className="group relative block overflow-hidden rounded-[8px] transition-transform hover:scale-105 h-[230px] w-full" href="/brands/converse">
        <div className="absolute inset-0">
          <img alt="Brand" loading="lazy" decoding="async" className="object-cover" src="" style={{position: "absolute", height: "100%", width: "100%", inset: "0px"}} />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
        <div className="relative flex h-full w-full items-center justify-center p-3 pb-5">
          <h3 className="text-white text-2xl font-bold text-center drop-shadow-lg">Brand</h3>
        </div>
      </a>
    </div>

    {/* Third Column */}
    <div className="flex flex-col gap-6">
      {/* Brand Item 7 */}
      <a className="group relative block overflow-hidden rounded-[8px] transition-transform hover:scale-105 h-[330px] w-full" href="/brands/vans">
        <div className="absolute inset-0">
          <img alt="Brand" loading="lazy" decoding="async" className="object-cover" src="" style={{position: "absolute", height: "100%", width: "100%", inset: "0px"}} />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
        <div className="relative flex h-full w-full items-center justify-center p-3 pb-5">
          <h3 className="text-white text-2xl font-bold text-center drop-shadow-lg">Brand</h3>
        </div>
      </a>

      {/* Brand Item 8 */}
      <a className="group relative block overflow-hidden rounded-[8px] transition-transform hover:scale-105 h-[230px] w-full" href="/brands/fila">
        <div className="absolute inset-0">
          <img alt="Brand" loading="lazy" decoding="async" className="object-cover" src="" style={{position: "absolute", height: "100%", width: "100%", inset: "0px"}} />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
        <div className="relative flex h-full w-full items-center justify-center p-3 pb-5">
          <h3 className="text-white text-2xl font-bold text-center drop-shadow-lg">Brand</h3>
        </div>
      </a>

      {/* Brand Item 9 */}
      <a className="group relative block overflow-hidden rounded-[8px] transition-transform hover:scale-105 h-[396px] w-full" href="/brands/under-armour">
        <div className="absolute inset-0">
          <img alt="Brand" loading="lazy" decoding="async" className="object-cover" src="" style={{position: "absolute", height: "100%", width: "100%", inset: "0px"}} />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
        <div className="relative flex h-full w-full items-center justify-center p-3 pb-5">
          <h3 className="text-white text-2xl font-bold text-center drop-shadow-lg">Brand</h3>
        </div>
      </a>
    </div>
          </div>
        </div>
      </div>

      {/* Men's Popular Categories */}
      <section className="py- px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-8xl mx-auto">
          
          {/* Section Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Men's Popular Categories</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            
            {/* Category 1: Men - Shirts */}
            <a 
              href="#category1" 
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('category1');
              }}
              className="cursor-pointer group"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded mb-3 bg-slate-100">
                <img 
                  src="" 
                  alt="Men's T-Shirts"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                {/*<div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-900 rounded-sm">
                  Men
                </div>*/}
              </div>
              <div>
                <h4 className="text-slate-900 text-sm font-semibold leading-tight">T-Shirts</h4>
              </div>
            </a>

            {/* Category 2: Men - Shirts */}
            <a 
              href="#category2" 
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('category2');
              }}
              className="cursor-pointer group"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded mb-3 bg-slate-100">
                <img 
                  src="" 
                  alt="Men's Casual Shirts"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                {/*<div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-900 rounded-sm">
                  Men
                </div>*/}
              </div>
              <div>
                <h4 className="text-slate-900 text-sm font-semibold leading-tight">Casual Shirts</h4>
              </div>
            </a>

            {/* Category 3: Men - Pants */}
            <a 
              href="#category3" 
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('category3');
              }}
              className="cursor-pointer group"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded mb-3 bg-slate-100">
                <img 
                  src="" 
                  alt="Men's Formal Shirts"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div>
                <h4 className="text-slate-900 text-sm font-semibold leading-tight">Formal Shirts</h4>
              </div>
            </a>

            {/* Category 4: Men - */}
            <a 
              href="#category4" 
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('category4');
              }}
              className="cursor-pointer group"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded mb-3 bg-slate-100">
                <img 
                  src="" 
                  alt="Men's Sweatshirts"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div>
                <h4 className="text-slate-900 text-sm font-semibold leading-tight">Sweatshirts</h4>
              </div>
            </a>

            {/* Category 5: Men - Matching Sets */}
            <a 
              href="#category5" 
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('category5');
              }}
              className="cursor-pointer group"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded mb-3 bg-slate-100">
                <img 
                  src="" 
                  alt="Men's Casual Trousers"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div>
                <h4 className="text-slate-900 text-sm font-semibold leading-tight">Casual Trousers</h4>
              </div>
            </a>

            {/* Category 6: Men - Leggings */}
            <a 
              href="#category6" 
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('category6');
              }}
              className="cursor-pointer group"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded mb-3 bg-slate-100">
                <img 
                  src="" 
                  alt="Men's Formal Trousers"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div>
                <h4 className="text-slate-900 text-sm font-semibold leading-tight">Formal Trousers</h4>
              </div>
            </a>

          </div>
        </div>
      </section>
      
      {/* Women's Popular Categories */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-8xl mx-auto">
    
    {/* Section Header */}
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-bold text-slate-900">Women's Popular Categories</h2>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
      
      {/* Category 1: Women - Dresses */}
      <a 
        href="#women-category1" 
        onClick={(e) => {
          e.preventDefault();
          setCurrentPage('women-category1');
        }}
        className="cursor-pointer group"
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded mb-3 bg-slate-100">
          <img 
            src="" 
            alt="Women's Dresses"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          {/*<div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-900 rounded-sm">
            Women
          </div>*/}
        </div>
        <div>
          <h4 className="text-slate-900 text-sm font-semibold leading-tight">Dresses</h4>
        </div>
      </a>

      {/* Category 2: Women - Kurti's & Tops */}
      <a 
        href="#women-category2" 
        onClick={(e) => {
          e.preventDefault();
          setCurrentPage('women-category2');
        }}
        className="cursor-pointer group"
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded mb-3 bg-slate-100">
          <img 
            src="" 
            alt="Women's Kurti's & Tops"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        </div>
        <div>
          <h4 className="text-slate-900 text-sm font-semibold leading-tight">Kurti's & Tops</h4>
        </div>
      </a>

      {/* Category 3: Women - Kurta's & Suits */}
      <a 
        href="#women-category3" 
        onClick={(e) => {
          e.preventDefault();
          setCurrentPage('women-category3');
        }}
        className="cursor-pointer group"
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded mb-3 bg-slate-100">
          <img 
            src="" 
            alt="Women's Kurta's & Suits"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        </div>
        <div>
          <h4 className="text-slate-900 text-sm font-semibold leading-tight">Kurta's & Suits</h4>
        </div>
      </a>

      {/* Category 4: Women - Tshirts */}
      <a 
        href="#women-category4" 
        onClick={(e) => {
          e.preventDefault();
          setCurrentPage('women-category4');
        }}
        className="cursor-pointer group"
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded mb-3 bg-slate-100">
          <img 
            src="" 
            alt="Women's Tshirts"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        </div>
        <div>
          <h4 className="text-slate-900 text-sm font-semibold leading-tight">Tshirts</h4>
        </div>
      </a>

      {/* Category 5: Women - Jeans */}
      <a 
        href="#women-category5" 
        onClick={(e) => {
          e.preventDefault();
          setCurrentPage('women-category5');
        }}
        className="cursor-pointer group"
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded mb-3 bg-slate-100">
          <img 
            src="" 
            alt="Women's Jeans"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        </div>
        <div>
          <h4 className="text-slate-900 text-sm font-semibold leading-tight">Jeans</h4>
        </div>
      </a>

      {/* Category 6: Women - Trousers & Capris */}
      <a 
        href="#women-category6" 
        onClick={(e) => {
          e.preventDefault();
          setCurrentPage('women-category6');
        }}
        className="cursor-pointer group"
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded mb-3 bg-slate-100">
          <img 
            src="" 
            alt="Women's Trousers & Capris"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        </div>
        <div>
          <h4 className="text-slate-900 text-sm font-semibold leading-tight">Trousers & Capris</h4>
        </div>
      </a>

    </div>
  </div>
      </section>

      {/* Join Us Section
      <div className="bg-gradient-to-r from-gray-50 via-white to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
         <div className="max-w-8xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Join Us Today</h2>
          <p className="text-lg text-gray-600 mb-8">Experience the future of our innovative solutions. Sign up now for exclusive access.</p>
           <button 
              onClick={() => setShowAuth(true)}
              className="py-3 px-8 text-sm font-bold text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors tracking-wide"
              >
              Get Started
            </button>
           </div>
      </div> */}
      
      {/* Products Section rounded-lg shadow-md */}
      <section id="products" className="py-12 px-4 sm:px-6 lg:px-8">
  <div className="max-w-8xl mx-auto">
    <h3 className="text-2xl font-bold text-black mb-8 text-center">Featured Products</h3>
    <div className="relative">
      <style>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        #product-container::-webkit-scrollbar {
        display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        #product-container {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
        }
      `}</style>

      <div id="product-container" className="flex space-x-4 overflow-x-auto pb-4">
        {productsData.map((product) => {
          // Calculate GST-inclusive price
          const calculateGSTInclusivePrice = (price, category) => {
            // Get GST rate based on price and category
            let gstRate = 0.18; // Default 18%
            if (category === 'Clothing') {
              gstRate = price <= 2500 ? 0.05 : 0.18;
            }

            // Calculate GST-inclusive price
            return Math.round(price * (1 + gstRate));
          };

          // Calculate credits based on price (1/100th of the price)
          const calculateCredits = (price) => {
            return (price / 100).toFixed(2);
          };

          const inclusivePrice = calculateGSTInclusivePrice(product.price, product.category);
          const inclusiveDiscountedPrice = product.discountedPrice 
            ? calculateGSTInclusivePrice(product.discountedPrice, product.category)
            : null;
          const credits = calculateCredits(inclusivePrice);

          return (
            <div key={product.id} className="flex-shrink-0 w-64 bg-white overflow-hidden group">
              <div className="relative">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-48 object-cover"
                />
                <button 
                  onClick={() => {
                    setSelectedProduct(product);
                    setSelectedSize(product.sizes ? product.sizes.split(',')[0].trim() : '');
                    setSelectedColor(product.colors ? product.colors.split(',')[0].trim() : '');
                    setProductModalOpen(true);
                  }}
                  className="absolute inset-0 flex items-center justify-center transition-all"
                >
                </button>
                {product.discountedPrice && product.price < product.discountedPrice && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold">
                    {Math.round((1 - inclusivePrice / inclusiveDiscountedPrice) * 100)}% OFF
                  </div>
                )}
                {product.videoLink && (
                  <div className="absolute bottom-2 right-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white p-1 rounded-full">
                    <Instagram size={16} />
                  </div>
                )}
              </div>

              <div className="p-4">
                <p className="text-sm text-gray-500 mb-1 font-semibold">{product.brandName}</p>
                <h4 className="font-semibold mb-2">{product.name}</h4>

                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < Math.floor(product.rating || 4) ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1 font-semibold">({product.reviews || 100})</span>
                </div>

                <div className="flex items-center mb-3">
                  <span className="font-bold text-lg">₹{inclusivePrice}</span>
                  <span className="text-xs text-gray-500 ml-1 font-semibold"> ({credits})</span>
                  {product.discountedPrice && product.price < product.discountedPrice && (
                    <span className="text-sm text-gray-500 line-through ml-2">₹{inclusiveDiscountedPrice}</span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      setSelectedProduct(product);
                      setSelectedSize(product.sizes ? product.sizes.split(',')[0].trim() : '');
                      setSelectedColor(product.colors ? product.colors.split(',')[0].trim() : '');
                      setProductModalOpen(true);
                    }}
                    className="flex-1 px-3 py-1.5 border border-blue-600 text-blue-600 text-sm rounded hover:bg-blue-50 transition-colors font-semibold"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedSize(product.sizes ? product.sizes.split(',')[0].trim() : '');
                      setSelectedColor(product.colors ? product.colors.split(',')[0].trim() : '');
                      handleAddToWishlist(product);
                    }}
                    className="p-1.5 border border-red-600 text-red-600 rounded hover:bg-red-50 transition-colors"
                  >
                    <Heart size={16} />
                  </button>
                  <button 
                    onClick={() => handleShareProduct(product)}
                    className="p-1.5 border border-green-600 text-green-600 rounded hover:bg-green-50 transition-colors"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Product Details Modal Revome this - /60 backdrop-blur-sm transition-opacity */}
      {productModalOpen && selectedProduct && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
          <button onClick={() => setProductModalOpen(false)} className="p-1">
            <X size={20} />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="relative">
              <img 
                src={selectedProduct.images[activeProductSlide]} 
                alt={selectedProduct.name} 
                className="w-full h-80 object-cover rounded-lg"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {selectedProduct.images.map((_, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveProductSlide(index)}
                    className={`w-2 h-2 rounded-full ${index === activeProductSlide ? 'bg-blue-600' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              {selectedProduct.images.map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={`${selectedProduct.name} ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded cursor-pointer ${index === activeProductSlide ? 'ring-2 ring-blue-600' : ''}`}
                  onClick={() => setActiveProductSlide(index)}
                />
              ))}
            </div>

            {selectedProduct.videoLink && (
              <div className="mt-4">
                <h4 className="font-bold mb-2">Product Video</h4>
                <div className="relative">
                  <div className="bg-gray-200 rounded-lg overflow-hidden h-50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="bg-gradient-to-r from-pink-500 to-orange-400 bg-opacity-80 rounded-full p-3 inline-block mb-2">
                        <Instagram size={24} className="text-white" />
                      </div>
                      <p className="text-white font-semibold">View on Instagram</p>
                    </div>
                  </div>
                  <a 
                    href={selectedProduct.videoLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center"
                  >
                  </a>
                </div>
              </div>
            )}  
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2 font-semibold">{selectedProduct.brandName}</p>
            <h4 className="text-xl font-bold mb-4">{selectedProduct.name}</h4>

            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.floor(selectedProduct.rating || 4) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2 font-semibold">({selectedProduct.reviews || 100} reviews)</span>
            </div>

            <div className="flex items-center mb-4">
              {(() => {
                // Calculate GST-inclusive price
                const calculateGSTInclusivePrice = (price, category) => {
                  // Get GST rate based on price and category
                  let gstRate = 0.18; // Default 18%
                  if (category === 'Clothing') {
                    gstRate = price <= 2500 ? 0.05 : 0.18;
                  }

                  // Calculate GST-inclusive price
                  return Math.round(price * (1 + gstRate));
                };

                // Calculate credits based on price (1/100th of the price)
                const calculateCredits = (price) => {
                  return (price / 100).toFixed(2);
                };

                const inclusivePrice = calculateGSTInclusivePrice(selectedProduct.price, selectedProduct.category);
                const inclusiveDiscountedPrice = selectedProduct.discountedPrice 
                  ? calculateGSTInclusivePrice(selectedProduct.discountedPrice, selectedProduct.category)
                  : null;
                const credits = calculateCredits(inclusivePrice);

                return (
                  <>
                    <div className="flex items-center mb-4">
                      <span className="text-2xl font-bold">₹{inclusivePrice}</span>
                      <span className="text-sm text-gray-500 ml-2 font-semibold">({credits})</span>
                      <span className="text-sm text-gray-500 ml-2">(Inclusive of all taxes)</span>
                    </div>
                    {selectedProduct.discountedPrice && selectedProduct.price < selectedProduct.discountedPrice && (
                      <span className="text-lg text-gray-500 line-through ml-3">₹{inclusiveDiscountedPrice}</span>
                    )}
                    {selectedProduct.discountedPrice && selectedProduct.price < selectedProduct.discountedPrice && (
                      <span className="ml-3 bg-red-100 text-red-600 text-sm px-2 py-1 rounded font-bold">
                        {Math.round((1 - inclusivePrice / inclusiveDiscountedPrice) * 100)}% OFF
                      </span>
                    )}
                  </>
                );
              })()}
            </div>

            <div className="mb-4">
              <p className="text-sm font-bold mb-2">Fit</p>
              <p className="text-sm text-gray-600 font-semibold">{selectedProduct.fitType}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-bold mb-2">Type</p>
              <p className="text-sm text-gray-600 font-semibold">{selectedProduct.type}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-bold mb-2">Available Colors</p>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.colors && selectedProduct.colors.split(',').map((color, index) => (
                  <button 
                    key={index}
                    onClick={() => setSelectedColor(color.trim())}
                    className={`px-3 py-1 border rounded text-sm transition-colors font-semibold ${
                      selectedColor === color.trim() 
                        ? 'border-blue-600 bg-blue-50 text-blue-600' 
                        : 'border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {color.trim()}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-bold mb-2">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.sizes && selectedProduct.sizes.split(',').map((size, index) => (
                  <button 
                    key={index}
                    onClick={() => setSelectedSize(size.trim())}
                    className={`px-3 py-1 border rounded text-sm transition-colors font-semibold ${
                      selectedSize === size.trim() 
                        ? 'border-blue-600 bg-blue-50 text-blue-600' 
                        : 'border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {size.trim()}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-bold mb-2">Offers</p>
              <p className="text-sm text-green-600 font-semibold">{selectedProduct.offer}</p>
            </div>

            <div className="flex space-x-3 mt-3">
              <button 
                onClick={() => handleAddToWishlist(selectedProduct)}
                className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <Heart size={18} className="mr-2" />
                <span className="text-sm font-bold">Wishlist</span>
              </button>
              <button 
                onClick={() => handleShareProduct(selectedProduct)}
                className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <Share2 size={18} className="mr-2" />
                <span className="text-sm font-bold">Share</span>
              </button>
            </div>
            <div className="flex space-x-3 mt-3">
              <button 
                onClick={() => handleAddToCart(selectedProduct)}
                className="flex-1 py-2 border border-gray-300 bg-gray-800 rounded hover:bg-transparent hover:text-slate-900 text-white text-sm font-medium cursor-pointer transition-all duration-300"
              >
                <span className="text-sm font-bold">Buy now</span>
              </button>
              <button 
                onClick={() => handleAddToCart(selectedProduct)}
                className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <span className="text-sm font-bold">Add to cart</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h5 className="font-bold mb-3">Product Details</h5>
              <p className="text-sm text-gray-600 font-medium">{selectedProduct.shortDescription}</p>
            </div>

            <div>
              <h5 className="font-bold mb-3">Material & Care</h5>
              <p className="text-sm text-gray-600 mb-2 font-medium">Material: {selectedProduct.material}</p>
              <p className="text-sm text-gray-600 font-medium">Care: {selectedProduct.washMethod}</p>
            </div>

            <div>
              <h5 className="font-bold mb-3">Size & Fit</h5>
              <p className="text-sm text-gray-600 mb-2 font-medium">Fit: {selectedProduct.fitType}</p>
              <button className="text-sm text-blue-600 hover:underline font-bold">Size Chart</button>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t pt-6">
          <h5 className="font-bold mb-3">Additional Information</h5>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Category:</span> {selectedProduct.category} / {selectedProduct.subCategory}
            </div>
            <div>
              <span className="font-medium">SKU:</span> {selectedProduct.sku}
            </div>
            <div>
              <span className="font-medium">HSN Code:</span> {selectedProduct.hsnCode}
            </div>
            <div>
              <span className="font-medium">Stock:</span> {selectedProduct.stockQuantity} units
            </div>
            <div>
              <span className="font-medium">Package Dimensions:</span> {selectedProduct.packageDimensions}
            </div>
            <div>
              <span className="font-medium">Weight:</span> {selectedProduct.weight}
            </div>
            <div>
              <span className="font-medium">Delivery Availability:</span> {selectedProduct.deliveryAvailability}
            </div>
            <div>
              <span className="font-medium">COD Option:</span> {selectedProduct.codOption}
            </div>
            <div>
              <span className="font-medium">Country of Origin:</span> {selectedProduct.countryOfOrigin}
            </div>
            <div>
              <span className="font-medium">Credits:</span> <span className="text-gray-600 font-semibold">
                {(() => {
                  const calculateGSTInclusivePrice = (price, category) => {
                    let gstRate = 0.18;
                    if (category === 'Clothing') {
                      gstRate = price <= 2500 ? 0.05 : 0.18;
                    }
                    return Math.round(price * (1 + gstRate));
                  };
                  
                  const calculateCredits = (price) => {
                    return (price / 100).toFixed(2);
                  };
                  
                  const inclusivePrice = calculateGSTInclusivePrice(selectedProduct.price, selectedProduct.category);
                  return calculateCredits(inclusivePrice);
                })()} Credits
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t pt-6">
          <h5 className="font-bold mb-3">Full Description</h5>
          <p className="text-sm text-gray-600 font-medium">{selectedProduct.fullDescription}</p>
        </div>

        <div className="mt-6 border-t pt-6">
          <h5 className="font-bold mb-3">Key Features</h5>
          <p className="text-sm text-gray-600 font-medium">{selectedProduct.keyFeatures}</p>
        </div>

        <div className="mt-6 border-t pt-6">
          <h5 className="font-bold mb-3">Return Policy</h5>
          <p className="text-sm text-gray-600 font-medium">{selectedProduct.returnPolicy}</p>
        </div>

        <div className="mt-6 border-t pt-6">
          <h5 className="font-bold mb-3">Customer Reviews & Ratings</h5>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2 font-semibold">John Doe</span>
              </div>
              <p className="text-sm text-gray-600 font-medium">Great product! Exactly as described and fits perfectly.</p>
            </div>

            <div className="border-b pb-4">
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                  <Star size={14} />
                </div>
                <span className="text-sm text-gray-500 ml-2 font-semibold">Jane Smith</span>
              </div>
              <p className="text-sm text-gray-600 font-medium">Good quality product. The material is soft and comfortable.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
      
      {/* Share Product Modal */}
      <ShareProductModal 
        product={selectedProduct}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </div>
  );
};

const FashionWebApp = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [userType, setUserType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setUserType(userData.userType);
    setIsLoggedIn(true);
    setShowAuth(false);
    
    // Redirect to appropriate dashboard
    if (userData.userType === 'customer') {
      setCurrentPage('customerDashboard');
    } else if (userData.userType === 'brand_owner') {
      setCurrentPage('brandOwnerDashboard');
    } else {
      setCurrentPage('landing');
    }
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    setUserType(null);
    setIsLoggedIn(false);
    setCurrentPage('landing');
  };
  
  // Function to navigate to signup page
  const handleNavigateToSignup = () => {
    navigate('/signup');
  };
  
  const renderPage = () => {
    if (showAuth) {
      return <AuthApp onSwitchView={(view) => {
        if (view === 'home') {
          setShowAuth(false);
          setCurrentPage('landing');
        }
      }} onLoginSuccess={handleLoginSuccess} />;
    }
    
    if (currentPage === 'landing') {
      return <LandingPage 
        setCurrentPage={setCurrentPage} 
        setUserType={setUserType} 
        setIsLoggedIn={setIsLoggedIn} 
        setShowAuth={setShowAuth} 
        onNavigateToSignup={handleNavigateToSignup}
      />;
    } else if (currentPage === 'customerDashboard' && userType === 'customer') {
      return <CustomerDashboard 
        setCurrentPage={setCurrentPage} 
        user={currentUser} 
        onLogout={handleLogout} 
        onNavigateToSignup={handleNavigateToSignup}
      />;
    } else if (currentPage === 'brandOwnerDashboard' && userType === 'brand_owner') {
      return <BrandOwnerDashboard 
        setCurrentPage={setCurrentPage}
        onNavigateToSignup={handleNavigateToSignup}
      />;
    } else if (currentPage === 'cart') {
      return <ShoppingCartPage 
        setCurrentPage={setCurrentPage}
        onNavigateToSignup={handleNavigateToSignup}
      />;
    } else if (currentPage === 'checkout') {
      return <CheckoutPage 
        setCurrentPage={setCurrentPage}
        onNavigateToSignup={handleNavigateToSignup}
      />;
    } else if (currentPage === 'orderSummary') {
      return <OrderSummaryPage 
        setCurrentPage={setCurrentPage}
        onNavigateToSignup={handleNavigateToSignup}
      />;
    } else if (currentPage === 'orderHistory') {
      return <OrderHistoryPage 
        setCurrentPage={setCurrentPage}
        onNavigateToSignup={handleNavigateToSignup}
      />;
    } else if (currentPage === 'orderTracking') {
      return <OrderTrackingPage 
        setCurrentPage={setCurrentPage}
        onNavigateToSignup={handleNavigateToSignup}
      />;
    } else if (currentPage === 'wishlist') {
      return <WishlistPage 
        setCurrentPage={setCurrentPage}
        onNavigateToSignup={handleNavigateToSignup}
      />;
    } else if (currentPage === 'mens' || currentPage === 'womens' || currentPage === 'accessories' || currentPage === 'all') {
      return <CategoryPage 
        category={currentPage} 
        setCurrentPage={setCurrentPage} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNavigateToSignup={handleNavigateToSignup}
      />;
    } else if (currentPage === 'services') {
      return <ServicesPage 
        setCurrentPage={setCurrentPage}
        onNavigateToSignup={handleNavigateToSignup}
      />;
    } else if (currentPage === 'tree') {
      return <TreeVisualization 
        setCurrentPage={setCurrentPage}
        onNavigateToSignup={handleNavigateToSignup}
      />;
    } else if (currentPage === 'contact') {
      return <ContactUsPage 
        setCurrentPage={setCurrentPage}
        onNavigateToSignup={handleNavigateToSignup}
      />;
    } else if (currentPage === 'aboutus') {
      return <AboutUsPage 
        setCurrentPage={setCurrentPage}
        onNavigateToSignup={handleNavigateToSignup}
      />;
    } else if (currentPage === 'news') {
      return <NewsPage 
        setCurrentPage={setCurrentPage}
        onNavigateToSignup={handleNavigateToSignup}
      />;
    } else if (currentPage === 'entrepreneurs') {
      return <EntrepreneursPage 
        setCurrentPage={setCurrentPage}
        onNavigateToSignup={handleNavigateToSignup}
      />;
    } else if (currentPage === 'brandowners') {
      return <BrandOwnersPage 
        setCurrentPage={setCurrentPage}
        onNavigateToSignup={handleNavigateToSignup}
      />;
    } else if (currentPage === 'founders') {
      return <FoundersPage 
        setCurrentPage={setCurrentPage}
        onNavigateToSignup={handleNavigateToSignup}
      />;
    } else if (currentPage === 'documents') {
      return <DocumentsPage 
        setCurrentPage={setCurrentPage}
        onNavigateToSignup={handleNavigateToSignup}
      />;
    } else if (currentPage === 'bankings') {
      return <BankingsPage 
        setCurrentPage={setCurrentPage}
        onNavigateToSignup={handleNavigateToSignup}
      />;
    } else if (currentPage === 'legals') {
      return <LegalsPage 
        setCurrentPage={setCurrentPage}
        onNavigateToSignup={handleNavigateToSignup}
      />;
    }
    else {
      return <LandingPage 
        setCurrentPage={setCurrentPage} 
        setUserType={setUserType} 
        setIsLoggedIn={setIsLoggedIn} 
        setShowAuth={setShowAuth}
        onNavigateToSignup={handleNavigateToSignup}
      />;
    }
  };
  
  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        {renderPage()}
      </div>
    </CartProvider>
  );
};

export default FashionWebApp;