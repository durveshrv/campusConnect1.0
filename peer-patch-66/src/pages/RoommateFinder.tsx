import { useState, useEffect } from "react";
import axios from "axios";
import { Users, Search, Plus, Home, Calendar, MapPin } from "lucide-react";
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

const RoommateFinder = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [roommateListings, setRoommateListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    hostel_name: "",
    address: "",
    phoneno: "",
    department: "",
    year: "",
    room_type: "",
    image: null,
  });
  const navigate = useNavigate();

  // Fetch rooms from /getroom
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://campusconnect-1.onrender.com/getroom",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        );
        setRoommateListings(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch rooms");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Handle form input changes
  const handleCreateInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setCreateForm((prev) => ({ ...prev, image: files ? files[0] : null }));
    } else {
      setCreateForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle create room submission
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("hostel_name", createForm.hostel_name);
    formData.append("address", createForm.address);
    formData.append("phoneno", createForm.phoneno);
    formData.append("department", createForm.department);
    formData.append("year", createForm.year);
    formData.append("room_type", createForm.room_type);
    if (createForm.image) {
      formData.append("image", createForm.image); // Match multer field name
    }

    try {
      const response = await axios.post(
        "https://campusconnect-1.onrender.com/room",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
      setRoommateListings((prev) => [...prev, response.data]);
      setIsCreateModalOpen(false);
      setCreateForm({
        hostel_name: "",
        address: "",
        phoneno: "",
        department: "",
        year: "",
        room_type: "",
        image: null,
      });
    } catch (err) {
      console.error("Error creating room:", err);
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
          <div className="inline-flex items-center justify-center p-3 bg-purple-50 rounded-full mb-6">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Roommate Finder</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find compatible roommates based on lifestyle preferences and housing
            needs. Connect with other students looking for housing.
          </p>
        </motion.div>

        <div className="mb-10 relative">
          <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-6 rounded-xl shadow-sm">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by location, preferences, or price range"
                className="pl-10 w-full"
              />
            </div>
            <Button
              className="whitespace-nowrap gap-2 w-full md:w-auto"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Create Listing
            </Button>
          </div>
        </div>

        {loading && (
          <p className="text-center text-muted-foreground">Loading...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 mt-8">
            {roommateListings.map((listing, index) => (
              <motion.div
                key={listing._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start flex-wrap gap-4">
                      <div>
                        <CardTitle>{listing.hostel_name}</CardTitle>
                        <CardDescription>{listing.phoneno}</CardDescription>
                      </div>
                      <Badge className="bg-primary text-primary-foreground">
                        {listing.room_type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-row gap-4">
                    <div className="flex-1">
                      <p className="mb-4 text-muted-foreground">
                        {listing.department}
                      </p>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{listing.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Move-in: {listing.year}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-muted-foreground" />
                          <span>Type: {listing.room_type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-32 h-32 flex-shrink-0">
                      <img
                        src={`https://campusconnect-1.onrender.com/uploads/${listing.image}`}
                        alt={listing.hostel_name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        (window.location.href = `https://wa.me/${listing.phoneno}`)
                      }
                    >
                      Contact
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Create Room Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Room Listing</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="hostel_name">Hostel Name</Label>
              <Input
                id="hostel_name"
                name="hostel_name"
                value={createForm.hostel_name}
                onChange={handleCreateInputChange}
                placeholder="Enter hostel name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={createForm.address}
                onChange={handleCreateInputChange}
                placeholder="Enter address"
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
              <Label htmlFor="year">Move-in Year</Label>
              <Input
                id="year"
                name="year"
                value={createForm.year}
                onChange={handleCreateInputChange}
                placeholder="Enter move-in year"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="room_type">Room Type</Label>
              <Input
                id="room_type"
                name="room_type"
                value={createForm.room_type}
                onChange={handleCreateInputChange}
                placeholder="Enter room type"
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

export default RoommateFinder;
