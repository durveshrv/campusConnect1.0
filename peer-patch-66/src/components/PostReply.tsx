import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const PostReply = () => {
  const { id } = useParams();
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment || comment.length < 5) {
      toast.error("Comment must be at least 5 characters");
      return;
    }
    try {
      await axios.post(
        `https://campusconnect-1.onrender.com/reply/create/${id}`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
      toast.success("Reply posted successfully");
      navigate(`/forum`);
    } catch (err) {
      console.error("Error posting reply:", err);
      toast.error(err.response?.data || "Failed to post reply");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Post Reply</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="comment">Reply</Label>
          <Input
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your reply (min 5 chars)"
            required
            minLength={5}
          />
        </div>
        <Button type="submit">Post Reply</Button>
      </form>
    </div>
  );
};

export default PostReply;
