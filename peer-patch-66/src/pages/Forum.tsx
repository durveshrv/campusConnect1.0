import { useState, useEffect } from "react";
import http from "../services/httpService.js"; // Your custom http service
import { createpost } from "../services/postCreateService.js"; // Your post creation service
import { api } from "../services/config.js"; // Your API config
import {
  MessageSquare,
  Search,
  Plus,
  Calendar,
  ThumbsUp,
  MessageCircle,
  Tag,
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
import { Checkbox } from "@/components/ui/checkbox";
import { ToastContainer, toast } from "react-toastify"; // Use react-toastify
import "react-toastify/dist/ReactToastify.css";

const Forum = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState({ _id: "1", name: "All" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    tags: [],
  });
  const [expandedPost, setExpandedPost] = useState(null);
  const [replies, setReplies] = useState({});
  const navigate = useNavigate();

  // Fetch posts and tags on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: postsData } = await http.get(api.postsEndPoint);
        const { data: tagsData } = await http.get(api.tagsEndPoint);
        setPosts(postsData);
        setTags([{ _id: "1", name: "All" }, ...tagsData]);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
        toast.error("Failed to load posts or tags");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle tag filter
  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
    setExpandedPost(null);
  };

  // Filter posts by selected tag
  const filteredPosts =
    selectedTag._id === "1"
      ? posts
      : posts.filter((post) =>
          post.tags.some((t) => t.name === selectedTag.name)
        );

  // Handle form input changes
  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle tag checkbox changes
  const handleTagChange = (tagId) => {
    const newTags = createForm.tags.includes(tagId)
      ? createForm.tags.filter((id) => id !== tagId)
      : [...createForm.tags, tagId];
    setCreateForm((prev) => ({ ...prev, tags: newTags }));
  };

  // Handle post creation (adapted from your old app)
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (createForm.title.length < 10 || createForm.description.length < 5) {
      toast.error(
        "Title must be at least 10 characters and description at least 5 characters"
      );
      return;
    }
    try {
      const postBody = {
        title: createForm.title,
        description: createForm.description,
        tags: createForm.tags,
      };
      const { response } = await createpost(postBody); // Use your service function
      console.log("Post response:", response); // Debug response
      const newPost = {
        _id: Date.now(), // Temporary ID (adjust if backend returns _id)
        title: createForm.title,
        description: createForm.description,
        tags: tags.filter((t) => createForm.tags.includes(t._id)),
        author: { name: "You" }, // Adjust based on actual user data
        upvotes: [],
        views: 1,
        time: new Date(),
      };
      setPosts((prev) => [newPost, ...prev]);
      setIsCreateModalOpen(false);
      setCreateForm({ title: "", description: "", tags: [] });
      toast.success("Post created successfully");
      navigate("/forum"); // Match your old app's redirect to dashboard
    } catch (err) {
      console.error("Error creating post:", err.response?.data || err);
      toast.error(err.response?.data || "Failed to create post");
    }
  };

  // Fetch replies for a post
  const fetchReplies = async (postId) => {
    try {
      const { data } = await http.get(`${api.repliesEndPoint}${postId}`);
      setReplies((prev) => ({ ...prev, [postId]: data }));
    } catch (err) {
      console.error("Error fetching replies:", err);
      toast.error("Failed to load replies");
    }
  };

  // Toggle replies visibility
  const toggleReplies = (postId) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
    } else {
      setExpandedPost(postId);
      if (!replies[postId]) {
        fetchReplies(postId);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onLoginClick={() => setIsAuthModalOpen(true)} />
      <ToastContainer /> {/* Add ToastContainer */}
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-red-50 rounded-full mb-6">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Campus Forum</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with campus events and participate in community
            discussions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 order-2 md:order-1">
            <div className="sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1 px-6 pb-6">
                    {tags.map((tag) => (
                      <button
                        key={tag._id}
                        onClick={() => handleTagSelect(tag)}
                        className={`w-full text-left py-2 px-3 rounded-md text-sm flex justify-between items-center hover:bg-accent ${
                          selectedTag._id === tag._id ? "bg-accent" : ""
                        }`}
                      >
                        <span>{tag.name}</span>
                        <Badge variant="outline" className="ml-2 rounded-full">
                          {tag._id === "1"
                            ? posts.length
                            : posts.filter((p) =>
                                p.tags.some((t) => t.name === tag.name)
                              ).length}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t">
                  <Button
                    className="w-full gap-2"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                    New Post
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="md:col-span-3 order-1 md:order-2">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search forum posts"
                  className="pl-10 w-full"
                />
              </div>
            </div>

            {loading && (
              <p className="text-center text-muted-foreground">Loading...</p>
            )}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && (
              <div className="space-y-6">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex flex-wrap justify-between items-start gap-3">
                          <div>
                            <CardTitle
                              className="text-xl cursor-pointer hover:underline"
                              onClick={() => navigate(`/post/${post._id}`)}
                            >
                              {post.title}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <span>{post.author.name}</span>
                              <span className="text-xs">•</span>
                              <span>
                                {new Date(post.time).toLocaleDateString()}
                              </span>
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="bg-primary/10">
                            {post.tags[0]?.name || "Uncategorized"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="flex flex-row gap-4">
                        <div className="flex-1">
                          <p className="text-muted-foreground">
                            {post.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {post.tags.map((tag) => (
                              <Badge key={tag._id} variant="secondary">
                                {tag.name}
                              </Badge>
                            ))}
                          </div>
                          {expandedPost === post._id && replies[post._id] && (
                            <div className="mt-4 space-y-2">
                              <h4 className="text-sm font-semibold">
                                Replies:
                              </h4>
                              {replies[post._id].map((reply) => (
                                <div
                                  key={reply._id}
                                  className="border-l-2 pl-2 text-sm"
                                >
                                  <p>{reply.comment}</p>
                                  <p className="text-xs text-muted-foreground">
                                    - {reply.author.name} •{" "}
                                    {new Date(reply.time).toLocaleDateString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="border-t flex justify-between flex-wrap gap-2">
                        <div className="flex space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground gap-2"
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span>{post.upvotes.length}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground gap-2"
                            onClick={() => navigate(`/post/${post._id}/reply`)}
                          >
                            <MessageCircle className="h-4 w-4" />
                            Reply
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground gap-2"
                            onClick={() => toggleReplies(post._id)}
                          >
                            <MessageCircle className="h-4 w-4" />
                            {expandedPost === post._id
                              ? "Hide Replies"
                              : `Show Replies (${
                                  replies[post._id]?.length || 0
                                })`}
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/post/${post._id}`)}
                        >
                          View Post
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      {/* Create Post Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={createForm.title}
                onChange={handleCreateInputChange}
                placeholder="Enter post title (min 10 chars)"
                required
                minLength={10}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={createForm.description}
                onChange={handleCreateInputChange}
                placeholder="Enter post description (min 5 chars)"
                required
                minLength={5}
              />
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-4">
                {tags
                  .filter((tag) => tag._id !== "1")
                  .map((tag) => (
                    <div key={tag._id} className="flex items-center gap-2">
                      <Checkbox
                        id={tag._id}
                        checked={createForm.tags.includes(tag._id)}
                        onCheckedChange={() => handleTagChange(tag._id)}
                      />
                      <Label htmlFor={tag._id}>{tag.name}</Label>
                    </div>
                  ))}
              </div>
            </div>
            <Button type="submit" className="w-full mt-6">
              Submit
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

export default Forum;
