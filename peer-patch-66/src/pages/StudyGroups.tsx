import { useState, useEffect } from "react";
import { BookOpen, Search, Plus, Clock, Calendar, BookMarked } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const StudyGroups = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchSubject, setSearchSubject] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    subject: "",
    phoneno: "",
    platform: "",
    department: "",
    year: "",
    meetlink1: "",
    appt: "",
  });
  const navigate = useNavigate();

  // Fetch all events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("https://campusconnect-1.onrender.com/event_join", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Search events by subject
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchSubject) {
      // Reset to all events if search is cleared
      const fetchEvents = async () => {
        try {
          const response = await fetch("https://campusconnect-1.onrender.com/event_join", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch events");
          }

          const data = await response.json();
          setEvents(data);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchEvents();
      return;
    }

    try {
      const response = await fetch("https://campusconnect-1.onrender.com/getevents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ subject: searchSubject }),
      });

      if (!response.ok) {
        throw new Error("Failed to search events");
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle form input changes for creating an event
  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle create event submission
  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    // Fetch logged-in user's name from /about
    let userName = "Unknown User";
    try {
      const userResponse = await fetch("https://campusconnect-1.onrender.com/about", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      if (userResponse.ok) {
        const userData = await userResponse.json();
        userName = userData.name || "Unknown User";
      }
    } catch (err) {
      console.error("Error fetching user data from /about:", err);
    }

    // Prepare event data with the fetched name
    const eventData = {
      ...createForm,
      name: userName, // Use the logged-in user's name
      appt: new Date(createForm.appt).toISOString(), // Ensure date is in ISO format
    };

    try {
      const response = await fetch("https://campusconnect-1.onrender.com/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      const newEvent = await response.json();
      setEvents((prev) => [...prev, newEvent]);
      setIsCreateModalOpen(false);
      toast.success("Study group created successfully!");
      // Reset form
      setCreateForm({
        name: "",
        subject: "",
        phoneno: "",
        platform: "",
        department: "",
        year: "",
        meetlink1: "",
        appt: "",
      });
      navigate("/study-groups"); // Adjust the route as per your app
    } catch (err) {
      toast.error(err.message || "Failed to create event");
    }
  };

  // Format date and time for display
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = date.toLocaleDateString("en-US", { weekday: "long" });
    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return { day, time };
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
          <div className="inline-flex items-center justify-center p-3 bg-green-50 rounded-full mb-6">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Study Groups</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find or create study groups for your courses. Collaborate with classmates and improve your academic performance.
          </p>
        </motion.div>
        
        <div className="mb-10 relative">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-center bg-card p-6 rounded-xl shadow-sm">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search by subject" 
                className="pl-10 w-full"
                value={searchSubject}
                onChange={(e) => setSearchSubject(e.target.value)}
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
              Create Study Group
            </Button>
          </form>
        </div>
        
        {loading && <p className="text-center text-muted-foreground">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {events.map((event, index) => {
              const { day, time } = formatDateTime(event.appt);
              return (
                <motion.div
                  key={event._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{event.subject} Study Group</CardTitle>
                          <CardDescription>{event.name}</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-primary/10">{event.subject}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-muted-foreground">Join us for a study session on {event.subject}!</p>
                      <div className="flex flex-col space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{day}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookMarked className="h-4 w-4 text-muted-foreground" />
                          <span>{event.platform}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <a
                        href={event.meetlink1}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Join Group
                      </a>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Create Study Group Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Study Group</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                value={createForm.subject}
                onChange={handleCreateInputChange}
                placeholder="Enter subject"
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
              <Label htmlFor="platform">Platform</Label>
              <Input
                id="platform"
                name="platform"
                value={createForm.platform}
                onChange={handleCreateInputChange}
                placeholder="Enter platform (e.g., Zoom, Library Room 3B)"
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
              <Label htmlFor="meetlink1">Meeting Link</Label>
              <Input
                id="meetlink1"
                name="meetlink1"
                value={createForm.meetlink1}
                onChange={handleCreateInputChange}
                placeholder="Enter meeting link"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appt">Appointment Date & Time</Label>
              <Input
                id="appt"
                name="appt"
                type="datetime-local"
                value={createForm.appt}
                onChange={handleCreateInputChange}
                required
              />
            </div>
            <Button type="submit" className="w-full mt-6">
              Create Study Group
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

export default StudyGroups;