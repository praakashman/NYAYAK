"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, MessageSquare, ThumbsUp, HelpCircle, Trophy, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Id } from '../../../convex/_generated/dataModel';

export default function ForumPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('Conversations');
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Build your case');

  const posts = useQuery(api.forum.listPosts, {}) || [];
  const topCreators = useQuery(api.forum.getTopCreators, {}) || [];
  const createPost = useMutation(api.forum.createPost);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTitle || !newContent) return;
    await createPost({
      title: newTitle,
      content: newContent,
      category: newCategory,
      clerkId: user.id,
    });
    setIsCreating(false);
    setNewTitle('');
    setNewContent('');
  };

  return (
    <main className="min-h-[calc(100vh-5.5rem)] bg-[#F3EEE6] py-10 relative overflow-hidden flex flex-col items-center font-sans">
      <div className="relative z-10 w-full max-w-7xl px-4 md:px-6 border border-gray-200 min-h-[calc(100vh-14rem)] rounded-3xl bg-[#fbfbfb]/80 backdrop-blur-[2px] py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* LEFT COLUMN: Main Feed */}
        <div className="flex-1">
          {/* Header & Tabs */}
          <div className="flex items-center gap-6 border-b border-gray-200 mb-6">
            {['Conversations', 'Help others', 'Categories'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 text-sm font-semibold transition-colors relative ${
                  activeTab === tab ? 'text-black' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                )}
              </button>
            ))}
          </div>

          {/* Posts Feed */}
          {activeTab === 'Conversations' && (
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="text-gray-500 text-center py-10">No discussions yet. Start one!</div>
              ) : (
                posts.map(post => (
                  <PostCard key={post._id} post={post} />
                ))
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Sidebar */}
        <div className="w-full md:w-80 space-y-6">
          
          {/* Create Post Widget */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-2">Hey! What's your legal query?</h3>
            <p className="text-gray-500 text-sm mb-4">Start a discussion with the community ✨</p>
            <button 
              onClick={() => setIsCreating(!isCreating)}
              className="w-full bg-[#111] text-white py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-black transition-colors"
            >
              <Plus size={18} /> Tell us what's new
            </button>
          </div>

          {/* Modal / Inline Create Form */}
          {isCreating && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-in fade-in zoom-in-95 duration-200">
              <form onSubmit={handleCreatePost} className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Post Title" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black placeholder:font-light"
                  required
                />
                <textarea 
                  placeholder="Elaborate on your query..." 
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full border border-gray-200 py-2 px-3 rounded-lg focus:outline-none focus:border-black text-sm min-h-25"
                  required
                />
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm text-gray-700 focus:outline-none"
                >
                  <option value="Property Law">Property Law</option>
                  <option value="Family Law">Family Law</option>
                  <option value="Criminal Law">Criminal Law</option>
                  <option value="Corporate Law">Corporate Law</option>
                  <option value="General Advice">General Advice</option>
                </select>
                <div className="flex gap-2 justify-end pt-2">
                  <button type="button" onClick={() => setIsCreating(false)} className="text-sm px-3 py-1.5 text-gray-500 hover:text-black">Cancel</button>
                  <button type="submit" className="text-sm px-4 py-1.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700">Post</button>
                </div>
              </form>
            </div>
          )}

          {/* Top Creators / PageRank Leaderboard */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
              <Trophy size={18} className="text-amber-500" />
              Top contributors
            </h3>
            <div className="space-y-4">
              {topCreators.map((creator, index) => (
                <div key={creator._id} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400 w-4 text-center">{index + 1}</span>
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0">
                    {creator.image ? (
                      <img src={creator.image} alt={creator.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">
                        {creator.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{creator.name}</p>
                    <p className="text-xs text-gray-500">{creator.points} points</p>
                  </div>
                </div>
              ))}
              {topCreators.length === 0 && (
                <p className="text-sm text-gray-500">Leaderboard is empty.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  </main>
);
}

// Sub-component for individual Post layout with expanding comments
function PostCard({ post }: { post: any }) {
  const { user } = useUser();
  const [expanded, setExpanded] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyParent, setReplyParent] = useState<string | null>(null);

  const comments = useQuery(api.forum.getCommentsAndTraverse, expanded ? { postId: post._id } : "skip") || [];
  const addComment = useMutation(api.forum.addComment);
  const toggleUpvote = useMutation(api.forum.toggleUpvote);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !replyContent) return;
    await addComment({
      postId: post._id,
      content: replyContent,
      parentId: replyParent ? (replyParent as Id<"forum_comments">) : undefined,
      clerkId: user.id
    });
    setReplyContent("");
    setReplyParent(null);
  };

  const handleUpvote = async (id: string, type: "post" | "comment") => {
    if (!user) return alert("Sign in to upvote");
    const parsedId = id as Extract<Id<"forum_posts"> | Id<"forum_comments">, string>;
    await toggleUpvote({ itemId: parsedId as any, itemType: type, clerkId: user.id });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Author Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center shrink-0">
          {post.authorImage ? (
            <img src={post.authorImage} alt={post.authorName} className="w-full h-full object-cover" />
          ) : (
            <span className="font-bold text-orange-600 text-sm">{post.authorName.charAt(0)}</span>
          )}
        </div>

        {/* Post Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <span className="font-bold text-gray-900">{post.authorName}</span>
            <span>•</span>
            <span>Asked in <span className="font-medium text-gray-700">{post.category || 'General'}</span></span>
            {post.authorRole === 'lawyer' && <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold ml-2">VERIFIED LAWYER</span>}
          </div>

          <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
            {post.title}
            <HelpCircle size={16} className="text-amber-400 fill-amber-50" />
          </h2>

          <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
            {post.content}
          </p>

          {/* Action Bar */}
          <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
            <button 
              onClick={() => handleUpvote(post._id, "post")}
              className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
            >
              <ThumbsUp size={16} /> 
              {post.upvotes}
            </button>
            <button 
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
            >
              <MessageSquare size={16} />
              {post.commentCount} {expanded ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
            </button>
            <span className="text-gray-400 text-xs ml-auto">
              {formatDistanceToNow(post._creationTime, { addSuffix: true })}
            </span>
          </div>

          {/* Expanded Comments Thread - The BFS/DFS Traversed Graph */}
          {expanded && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <form onSubmit={handleReply} className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={replyParent ? "Linking reply..." : "Write a reply..."}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
                />
                <button type="submit" className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800">
                  Reply
                </button>
                {replyParent && (
                  <button type="button" onClick={() => setReplyParent(null)} className="text-xs text-red-500 ml-2">Cancel Link</button>
                )}
              </form>

              <div className="space-y-4">
                {comments.length === 0 && <p className="text-xs text-gray-500 italic">No replies yet.</p>}
                
                {comments.map((comment: any) => (
                  <div 
                    key={comment._id} 
                    className="flex gap-3 relative"
                    style={{ marginLeft: `${comment.depth * 28}px` }}
                  >
                    {/* Thread Line matching parent hierarchy */}
                    {comment.depth > 0 && (
                       <div className="absolute -left-5 top-0 -bottom-4 w-0.5 bg-gray-100" />
                    )}
                    
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 shrink-0">
                      {comment.authorImage ? (
                        <img src={comment.authorImage} alt={comment.authorName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-500">
                          {comment.authorName?.charAt(0)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-gray-900">{comment.authorName}</span>
                        {comment.authorRole === 'lawyer' && <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full font-bold ml-2">LAWYER</span>}
                        <span className="text-[10px] text-gray-400">{formatDistanceToNow(comment._creationTime)}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                      
                      <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                        <button onClick={() => handleUpvote(comment._id, "comment")} className="flex items-center gap-1 hover:text-blue-600">
                          <ThumbsUp size={12} /> {comment.upvotes}
                        </button>
                        <button onClick={() => setReplyParent(comment._id)} className="hover:text-blue-600">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}