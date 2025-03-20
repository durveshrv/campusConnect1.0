import { useState, useEffect } from "react";
import { Bike, Search, Plus, MapPin, X } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";

const BikeBuddy = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [bikers, setBikers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    bikeno: "",
    phoneno: "",
    licensecheck: false,
    helmetcheck: false,
    location: "",
    department: "",
    year: "",
    image: null,
  });
  const navigate = useNavigate();

  // Fetch bikers from backend and their names
  useEffect(() => {
    const fetchBikers = async () => {
      try {
        const response = await fetch("https://campusconnect-1.onrender.com/getallbikers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bikers");
        }

        const data = await response.json();
        // Fetch user names for each biker using phoneno
        const bikersWithNames = await Promise.all(
          data.map(async (biker) => {
            try {
              const userResponse = await fetch(
                `https://campusconnect-1.onrender.com/api/users?phoneno=${biker.phoneno}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
                  },
                }
              );
              if (!userResponse.ok) {
                throw new Error("Failed to fetch user data");
              }
              const userData = await userResponse.json();
              return { ...biker, name: userData.name || "Unknown Biker" };
            } catch (err) {
              console.error("Error fetching user data:", err);
              return { ...biker, name: "Unknown Biker" };
            }
          })
        );
        setBikers(bikersWithNames);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBikers();
  }, []);

  // Search bikers by location
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchLocation) {
      // Reset to all bikers if search is cleared
      const fetchBikers = async () => {
        try {
          const response = await fetch("https://campusconnect-1.onrender.com/getallbikers", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch bikers");
          }

          const data = await response.json();
          const bikersWithNames = await Promise.all(
            data.map(async (biker) => {
              try {
                const userResponse = await fetch(
                  `https://campusconnect-1.onrender.com/api/users?phoneno=${biker.phoneno}`,
                  {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
                    },
                  }
                );
                if (!userResponse.ok) {
                  throw new Error("Failed to fetch user data");
                }
                const userData = await userResponse.json();
                return { ...biker, name: userData.name || "Unknown Biker" };
              } catch (err) {
                console.error("Error fetching user data:", err);
                return { ...biker, name: "Unknown Biker" };
              }
            })
          );
          setBikers(bikersWithNames);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchBikers();
      return;
    }

    try {
      const response = await fetch("https://campusconnect-1.onrender.com/bike_partner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ location: searchLocation }),
      });

      if (!response.ok) {
        throw new Error("Failed to search bikers");
      }

      const data = await response.json();
      const bikersWithNames = await Promise.all(
        data.map(async (biker) => {
          try {
            const userResponse = await fetch(
              `https://campusconnect-1.onrender.com/api/users?phoneno=${biker.phoneno}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
                },
              }
            );
            if (!userResponse.ok) {
              throw new Error("Failed to fetch user data");
            }
            const userData = await userResponse.json();
            return { ...biker, name: userData.name || "Unknown Biker" };
          } catch (err) {
            console.error("Error fetching user data:", err);
            return { ...biker, name: "Unknown Biker" };
          }
        })
      );
      setBikers(bikersWithNames);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle form input changes for creating a biker
  const handleCreateInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setCreateForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setCreateForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setCreateForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle create biker submission
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("bikeno", createForm.bikeno);
    formData.append("phoneno", createForm.phoneno);
    formData.append("licensecheck", createForm.licensecheck.toString());
    formData.append("helmetcheck", createForm.helmetcheck.toString());
    formData.append("location", createForm.location);
    formData.append("department", createForm.department);
    formData.append("year", createForm.year);
    if (createForm.image) {
      formData.append("image", createForm.image);
    }

    try {
      const response = await fetch("https://campusconnect-1.onrender.com/biker", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create biker");
      }

      const newBiker = await response.json();
      // Fetch user name for the new biker using phoneno
      const userResponse = await fetch(
        `https://campusconnect-1.onrender.com/api/users?phoneno=${newBiker.phoneno}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
      const userData = userResponse.ok ? await userResponse.json() : { name: "Unknown Biker" };
      setBikers((prev) => [...prev, { ...newBiker, name: userData.name || "Unknown Biker" }]);
      setIsCreateModalOpen(false);
      toast.success("Biker listing created successfully!");
      // Reset form
      setCreateForm({
        bikeno: "",
        phoneno: "",
        licensecheck: false,
        helmetcheck: false,
        location: "",
        department: "",
        year: "",
        image: null,
      });
    } catch (err) {
      toast.error(err.message || "Failed to create biker");
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
          <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-6">
            <Bike className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Bike Buddy</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with students who own bikes or need rides around campus. Share rides, save time, and reduce carbon footprint.
          </p>
        </motion.div>
        
        <div className="mb-10 relative">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-center bg-card p-6 rounded-xl shadow-sm">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search by location" 
                className="pl-10 w-full"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
            <Button type="submit" className="whitespace-nowrap w-full md:w-auto">
              Search
            </Button>
            <Button 
              type="button" 
              className="whitespace-nowrap gap-2 w-full md:w-auto" 
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Create Listing
            </Button>
          </form>
        </div>
        
        {loading && <p className="text-center text-muted-foreground">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {bikers.map((biker, index) => (
              <motion.div
                key={biker._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>{biker.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2 text-sm">
                      <p><span className="font-semibold">Vehicle No:</span> {biker.bikeno}</p>
                      <p><span className="font-semibold">Contact:</span> {biker.phoneno}</p>
                      <p><span className="font-semibold">License:</span> {biker.licensecheck ? "Yes" : "No"}</p>
                      <p><span className="font-semibold">Helmet:</span> {biker.helmetcheck ? "Yes" : "No"}</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{biker.location}</span>
                      </div>
                      <p><span className="font-semibold">Department:</span> {biker.department}</p>
                      <p><span className="font-semibold">Year:</span> {biker.year}</p>
                    </div>
                    {biker.image && (
                      <div className="flex-shrink-0">
                        <img
                          src={`https://campusconnect-1.onrender.com/uploads/${biker.image}`}
                          alt={`${biker.bikeno} image`}
                          className="w-32 h-32 object-cover rounded-full"
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/150";
                          }}
                        />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <a
                      href={`https://wa.me/${biker.phoneno}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Contact Buddy
                    </a>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Create Biker Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Biker Listing</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bikeno">Bike Number</Label>
              <Input
                id="bikeno"
                name="bikeno"
                value={createForm.bikeno}
                onChange={handleCreateInputChange}
                placeholder="Enter bike number"
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
            <div className="space-y-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="licensecheck"
                name="licensecheck"
                checked={createForm.licensecheck}
                onChange={handleCreateInputChange}
              />
              <Label htmlFor="licensecheck">Has License</Label>
            </div>
            <div className="space-y-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="helmetcheck"
                name="helmetcheck"
                checked={createForm.helmetcheck}
                onChange={handleCreateInputChange}
              />
              <Label htmlFor="helmetcheck">Has Helmet</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={createForm.location}
                onChange={handleCreateInputChange}
                placeholder="Enter location"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                value={createForm.department}
                onChange={handleCreateInputChange}
                placeholder="Enter department"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                name="year"
                value={createForm.year}
                onChange={handleCreateInputChange}
                placeholder="Enter year (e.g., 3rd)"
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
              Create Listing
            </Button>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BikeBuddy;