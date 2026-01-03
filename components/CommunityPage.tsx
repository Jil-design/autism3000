import React from 'react';
import { COMMUNITY_POSTS } from '../constants';
import { ThumbsUp, MessageCircle, Search, PenSquare, Filter } from 'lucide-react';
import { UserRole } from '../types';

interface CommunityPageProps {
  userRole: UserRole;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({ userRole }) => {
  return (
    <div className="max-w-md md:max-w-2xl mx-auto p-4 pb-24 space-y-6">
      
      {/* Header Area */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Community Forum</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Connect with other {userRole}s and educators.</p>
      </div>

      {/* Search & Actions */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search topics..." 
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-rose-500 outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
        </div>
        <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-slate-600 dark:text-slate-300">
           <Filter size={20} />
        </button>
      </div>

      {/* Create Post Teaser */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
         <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
            <UserRoleAvatar role={userRole} />
         </div>
         <div className="flex-1 text-slate-400 text-sm font-medium">Share your experience...</div>
         <PenSquare size={20} className="text-rose-500" />
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {COMMUNITY_POSTS.map(post => (
          <div key={post.id} className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
                      post.role === 'Educator' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                      post.role === 'Parent' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 
                      'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
                  }`}>
                      {post.author.charAt(0)}
                  </div>
                  <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{post.author}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">{post.role} • {post.time}</div>
                  </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed font-medium">
                  {post.content}
              </p>
              <div className="flex items-center gap-6 border-t border-slate-50 dark:border-slate-700 pt-3">
                  <button className="flex items-center gap-2 text-slate-400 hover:text-rose-500 text-xs font-semibold transition-colors">
                      <ThumbsUp size={16} /> {post.likes} Likes
                  </button>
                  <button className="flex items-center gap-2 text-slate-400 hover:text-blue-500 text-xs font-semibold transition-colors">
                      <MessageCircle size={16} /> Reply
                  </button>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UserRoleAvatar = ({role}: {role: UserRole}) => {
  return (
    <span className="font-bold text-xs">{role.charAt(0)}</span>
  )
}