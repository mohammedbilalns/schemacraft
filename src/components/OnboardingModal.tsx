import React, { useState } from 'react';
import { UserCheck, Sparkles, X, GitBranch, Mail, User } from 'lucide-react';
import { GitUserConfig } from '../types/erd';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialConfig: GitUserConfig;
  onSaveConfig: (config: GitUserConfig) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  initialConfig,
  onSaveConfig,
}) => {
  const [name, setName] = useState(initialConfig.name);
  const [email, setEmail] = useState(initialConfig.email);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      name: name.trim() || 'Local Developer',
      email: email.trim() || 'dev@localhost',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="w-[460px] max-w-full bg-[#18191f] border border-[#2e303d] rounded-2xl shadow-2xl overflow-hidden text-gray-200">
        <div className="p-6 border-b border-[#2e303d] bg-gradient-to-br from-blue-950/40 via-transparent to-transparent flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Welcome to SchemaCraft</h2>
              <p className="text-xs text-gray-400">Confirm your local Git credentials for author tracking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-blue-950/30 border border-blue-900/50 rounded-xl text-xs text-blue-200 leading-relaxed flex items-start gap-2.5">
            <GitBranch size={16} className="text-blue-400 shrink-0 mt-0.5" />
            <span>
              Your Git author details are detected automatically and used to sign commits and verify ownership when adding diagram notes.
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
              <User size={13} className="text-gray-400" />
              <span>Git Author Name</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-3 py-2 bg-[#121317] border border-[#343644] focus:border-blue-500 rounded-lg text-xs text-white outline-none font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
              <Mail size={13} className="text-gray-400" />
              <span>Git Author Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john@example.com"
              className="w-full px-3 py-2 bg-[#121317] border border-[#343644] focus:border-blue-500 rounded-lg text-xs text-white outline-none font-mono"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg cursor-pointer transition-all"
            >
              <UserCheck size={14} />
              <span>Continue to Workspace</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
