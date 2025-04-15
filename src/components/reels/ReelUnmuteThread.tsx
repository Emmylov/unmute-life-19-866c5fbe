
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Mic, Video, Smile, PencilLine, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { addReelComment } from '@/services/comment-service';

interface ReelUnmuteThreadProps {
  reelId: string;
  isOpen: boolean;
  onClose: () => void;
}

// For demonstrating comments
interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  username: string;
  avatar?: string;
  type: 'text' | 'audio' | 'video';
}

const COMMENT_PROMPTS = [
  "What did this make you feel?",
  "Has this happened to you before?",
  "What would you say to this person in real life?",
  "How did this impact your perspective?"
];

const ReelUnmuteThread: React.FC<ReelUnmuteThreadProps> = ({ reelId, isOpen, onClose }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [commentType, setCommentType] = useState<'text' | 'audio' | 'video'>('text');
  const { user } = useAuth();
  const commentListRef = useRef<HTMLDivElement>(null);

  // Select a random prompt
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * COMMENT_PROMPTS.length);
    setSelectedPrompt(COMMENT_PROMPTS[randomIndex]);
  }, []);

  // Load comments when modal opens
  useEffect(() => {
    if (isOpen) {
      loadComments();
    }
  }, [isOpen, reelId]);

  // Auto-scroll to bottom when new comments are added
  useEffect(() => {
    if (isOpen && commentListRef.current) {
      commentListRef.current.scrollTop = commentListRef.current.scrollHeight;
    }
  }, [comments, isOpen]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      // Fetch comments for this reel
      const { data: commentsData, error } = await supabase
        .from('reel_comments')
        .select('*, profiles:user_id(username, avatar)')
        .eq('reel_id', reelId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Transform data to match our Comment interface
      const formattedComments: Comment[] = (commentsData || []).map((comment: any) => ({
        id: comment.id,
        user_id: comment.user_id,
        content: comment.content,
        created_at: comment.created_at,
        username: comment.profiles?.username || 'Anonymous',
        avatar: comment.profiles?.avatar,
        type: comment.content.startsWith('audio:') ? 'audio' : 
              comment.content.startsWith('video:') ? 'video' : 'text'
      }));

      setComments(formattedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user) {
      toast.error('You need to be logged in to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      // Add a brief delay to simulate thoughtful commenting
      toast.info('Processing your comment...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Format comment based on type
      let commentContent = newComment;
      if (commentType === 'audio') {
        commentContent = `audio:${newComment}`;
      } else if (commentType === 'video') {
        commentContent = `video:${newComment}`;
      }

      // Use our updated service to add the comment
      const commentData = await addReelComment(reelId, user.id, commentContent);
      
      if (!commentData) {
        throw new Error("Failed to add comment");
      }

      // Add the new comment to our list - fix the type issues here
      const newCommentObj: Comment = {
        id: commentData.id,
        user_id: commentData.user_id,
        content: commentData.content,
        created_at: commentData.created_at,
        // Use optional chaining and provide fallbacks for all properties
        username: commentData.profiles?.username || user?.email?.split('@')[0] || 'Anonymous',
        avatar: commentData.profiles?.avatar || undefined,
        type: commentType
      };

      setComments([...comments, newCommentObj]);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    }
  };

  const handleCommentTypeChange = (type: 'text' | 'audio' | 'video') => {
    if (type === 'audio') {
      toast.info('Audio replies coming soon!');
    } else if (type === 'video') {
      toast.info('Video replies coming soon!');
    }
    setCommentType(type);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 max-h-[80vh] bg-white rounded-t-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b bg-white">
              <div className="flex items-center">
                <MessageCircle className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-medium">Unmute Thread</h3>
              </div>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Comment prompt */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-3 text-center">
              <p className="text-sm text-gray-700 italic">{selectedPrompt}</p>
            </div>
            
            {/* Comments list */}
            <div 
              ref={commentListRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{ maxHeight: "50vh" }}
            >
              {isLoading ? (
                <div className="flex justify-center items-center h-24">
                  <div className="animate-pulse flex space-x-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Be the first to start this Unmute Thread!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.avatar ?? undefined} />
                      <AvatarFallback>
                        {comment.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-100 px-3 py-2 rounded-xl">
                        <p className="font-medium text-sm">{comment.username}</p>
                        <div className="flex items-center gap-1">
                          {comment.type === 'audio' && <Mic className="h-3 w-3 text-blue-500" />}
                          {comment.type === 'video' && <Video className="h-3 w-3 text-purple-500" />}
                          <p className="text-sm break-words">
                            {comment.type === 'text' 
                              ? comment.content 
                              : comment.content.substring(comment.content.indexOf(':') + 1)}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-2">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Comment input */}
            <div className="sticky bottom-0 border-t bg-white p-3 space-y-2">
              {/* Comment type selector */}
              <div className="flex justify-center space-x-4 mb-2">
                <button
                  onClick={() => handleCommentTypeChange('text')}
                  className={`flex flex-col items-center p-2 rounded-lg ${
                    commentType === 'text' ? 'bg-primary/10 text-primary' : 'text-gray-500'
                  }`}
                >
                  <PencilLine className="h-5 w-5" />
                  <span className="text-xs mt-1">Text</span>
                </button>
                <button
                  onClick={() => handleCommentTypeChange('audio')}
                  className={`flex flex-col items-center p-2 rounded-lg ${
                    commentType === 'audio' ? 'bg-primary/10 text-primary' : 'text-gray-500'
                  }`}
                >
                  <Mic className="h-5 w-5" />
                  <span className="text-xs mt-1">Audio</span>
                </button>
                <button
                  onClick={() => handleCommentTypeChange('video')}
                  className={`flex flex-col items-center p-2 rounded-lg ${
                    commentType === 'video' ? 'bg-primary/10 text-primary' : 'text-gray-500'
                  }`}
                >
                  <Video className="h-5 w-5" />
                  <span className="text-xs mt-1">Video</span>
                </button>
              </div>
              
              <div className="flex gap-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="resize-none"
                />
                <Button 
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                  size="icon" 
                  className="h-full aspect-square"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-xs text-center text-gray-500">
                Be kind and respectful. Unmute is a space for authentic connection.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReelUnmuteThread;
