import { useState, useEffect } from "react";
import axios from "axios";
import {
  ShoppingCart,
  Search,
  Plus,
  Tag,
  Calendar,
  Bookmark,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Declare Razorpay types
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }

  interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description?: string;
    image?: string;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    handler?: (response: {
      razorpay_payment_id: string;
      razorpay_order_id?: string;
      razorpay_signature?: string;
    }) => void;
    modal?: {
      ondismiss?: () => void;
    };
  }

  interface RazorpayInstance {
    open: () => void;
  }
}

interface Product {
  _id: string;
  name: string;
  username: string;
  phoneno: string;
  email: string;
  category: string;
  price: number;
  description: string;
  image: any; // Adjust based on how image is returned (e.g., { filename: string })
}

const Marketplace = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchCategory, setSearchCategory] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    username: "",
    phoneno: "",
    email: "",
    category: "",
    price: "",
    description: "",
    image: null as File | null,
  });
  const navigate = useNavigate();

  // Fetch products with axios
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://campusconnect-1.onrender.com/getProduct?search=${searchCategory}&category=${searchCategory}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        );

        if (response.data.err) {
          throw new Error(response.data.message || "Failed to fetch products");
        }

        setProducts(response.data.products);
        console.log("Products fetched:", response.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch products");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchCategory]);

  // Handle form input changes for creating a product
  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setCreateForm((prev) => ({ ...prev, image: files ? files[0] : null }));
    } else {
      setCreateForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle create product submission
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", createForm.name);
    formData.append("username", createForm.username);
    formData.append("phoneno", createForm.phoneno);
    formData.append("email", createForm.email);
    formData.append("category", createForm.category);
    formData.append("price", createForm.price);
    formData.append("description", createForm.description);
    if (createForm.image) {
      formData.append("file", createForm.image); // Match multer field name 'file'
    }

    try {
      const response = await axios.post(
        "https://campusconnect-1.onrender.com/addProduct",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );

      if (response.data.err) {
        throw new Error(response.data.error || "Failed to create product");
      }

      setProducts((prev) => [...prev, response.data.result]);
      setIsCreateModalOpen(false);
      toast.success("Product listed successfully!");
      setCreateForm({
        name: "",
        username: "",
        phoneno: "",
        email: "",
        category: "",
        price: "",
        description: "",
        image: null,
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to create product");
    }
  };

  // Handle Razorpay payment
  const handleBuyNow = async (product: Product) => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          resolve(true);
          return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        toast.error("Failed to load Razorpay SDK. Please try again.");
        return;
      }

      let userData = {
        name: "Buyer",
        email: "buyer@example.com",
        contact: "1234567890",
      };
      try {
        const userResponse = await axios.get(
          "https://campusconnect-1.onrender.com/about",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        );
        userData = {
          name: userResponse.data.name,
          email: userResponse.data.email,
          contact: userResponse.data.phoneno,
        };
      } catch (err) {
        console.error("Error fetching user data:", err);
      }

      const options: RazorpayOptions = {
        key: "YOUR_RAZORPAY_KEY_ID", // Replace with your Razorpay Key ID
        amount: product.price * 100,
        currency: "INR",
        name: "Campus Marketplace",
        description: `Payment for ${product.name}`,
        image: "https://your-logo-url.com/logo.png",
        prefill: {
          name: userData.name,
          email: userData.email,
          contact: userData.contact,
        },
        handler: function (response) {
          toast.success(
            `Payment successful! Payment ID: ${response.razorpay_payment_id}`
          );
        },
        modal: {
          ondismiss: function () {
            toast.info("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("An error occurred while initiating payment");
      console.error("Razorpay Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onLoginClick={() => setIsAuthModalOpen(true)} />

      <main className="container mx-auto px-4 pt-24 pb-16 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-amber-50 rounded-full mb-6">
            <ShoppingCart className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Marketplace</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Buy and sell items within the campus community. Find textbooks,
            furniture, electronics, and more.
          </p>
        </motion.div>

        <div className="mb-10 relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearchCategory(searchCategory);
            }}
            className="flex flex-col md:flex-row gap-4 items-center bg-card p-6 rounded-xl shadow-sm"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or category"
                className="pl-10 w-full"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="whitespace-nowrap w-full md:w-auto"
            >
              Search
            </Button>
            <Button
              type="button"
              className="whitespace-nowrap gap-2 w-full md:w-auto"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              List Item
            </Button>
          </form>
        </div>

        {loading && (
          <p className="text-center text-muted-foreground">Loading...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {products.map((product, index) => (
              <motion.div
                key={product._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle
                          className="cursor-pointer hover:underline"
                          onClick={() => navigate(`/product/${product._id}`)}
                        >
                          {product.name}
                        </CardTitle>
                        <CardDescription>{product.username}</CardDescription>
                      </div>
                      <Badge className="bg-primary text-primary-foreground">
                        ${product.price}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-row gap-4">
                    <div className="flex-1">
                      <p className="mb-4 text-muted-foreground">
                        {product.description}
                      </p>
                      <div className="flex flex-col space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          <span>{product.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Posted Today</span>{" "}
                          {/* Replace with actual date logic if added */}
                        </div>
                      </div>
                    </div>
                    <div className="w-32 h-32 flex-shrink-0">
                      <img
                        src={`https://campusconnect-1.onrender.com/upload_img/${product.image.filename}`} // Adjust path as needed
                        alt={product.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between gap-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        (window.location.href = `https://wa.me/${product.phoneno}`)
                      }
                    >
                      Contact Seller
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => handleBuyNow(product)}
                    >
                      Buy Now
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Create Product Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>List New Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                name="name"
                value={createForm.name}
                onChange={handleCreateInputChange}
                placeholder="Enter item name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Your Name</Label>
              <Input
                id="username"
                name="username"
                value={createForm.username}
                onChange={handleCreateInputChange}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneno">Phone Number</Label>
              <Input
                id="phoneno"
                name="phoneno"
                value={createForm.phoneno}
                onChange={handleCreateInputChange}
                placeholder="Enter phone number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={createForm.email}
                onChange={handleCreateInputChange}
                placeholder="Enter email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={createForm.category}
                onChange={handleCreateInputChange}
                placeholder="Enter category (e.g., Textbooks)"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={createForm.price}
                onChange={handleCreateInputChange}
                placeholder="Enter price"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={createForm.description}
                onChange={handleCreateInputChange}
                placeholder="Enter description"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                name="image"
                type="file"
                onChange={handleCreateInputChange}
                accept="image/*"
                required
              />
            </div>
            <Button type="submit" className="w-full mt-6">
              List Item
            </Button>
          </form>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Marketplace;
