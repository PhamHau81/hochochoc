import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  X, 
  Cpu, 
  Zap, 
  HelpCircle 
} from 'lucide-react';
import { 
  AI_MODELS, 
  getStoredApiKey, 
  setStoredApiKey, 
  getStoredModel, 
  setStoredModel 
} from '../services/gemini';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (message: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSaved }) => {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState(() => getStoredModel());
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredApiKey());
      setSelectedModel(getStoredModel());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setStoredApiKey(apiKey);
    setStoredModel(selectedModel);
    if (onSaved) {
      onSaved(apiKey ? 'Đã lưu API Key và Cấu hình Model thành công!' : 'Đã xóa API Key');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between relative">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-sm">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                Thiết Lập Model & Gemini API Key
              </h3>
              <p className="text-xs text-indigo-200">
                Kích hoạt trợ lý AI Gia Sư Toán học thông minh
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-indigo-200 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto custom-scrollbar">
          {/* Banner hướng dẫn lấy key miễn phí */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 space-y-1">
              <div className="font-extrabold text-amber-900">
                Chưa có Google Gemini API Key?
              </div>
              <p className="text-amber-800 leading-relaxed">
                Google cung cấp API Key <b>hoàn toàn miễn phí</b> với hạn ngạch dồi dào cho cá nhân học tập và giảng dạy.
              </p>
              <a
                href="https://aistudio.google.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-600 hover:text-indigo-800 underline mt-1"
              >
                <span>Nhấp vào đây để lấy API Key tại Google AI Studio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Model AI Selection Cards (theo AI_INSTRUCTIONS.md) */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <span>Chọn Model AI chính:</span>
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {AI_MODELS.map((model) => (
                <div
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedModel === model.id
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                      <span>{model.name}</span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                        {model.badge}
                      </span>
                    </span>
                    <input
                      type="radio"
                      name="model_select"
                      checked={selectedModel === model.id}
                      onChange={() => setSelectedModel(model.id)}
                      className="accent-indigo-600 w-4 h-4"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">{model.description}</p>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-slate-400 italic flex items-center gap-1 pt-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Hệ thống tự động chuyển đổi Fallback nếu model gặp lỗi quá tải (429 Quota).</span>
            </div>
          </div>

          {/* Input API Key */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Gemini API Key:</span>
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold underline"
              >
                {showKey ? 'Ẩn key' : 'Hiện key'}
              </button>
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Dán mã AIzaSy... của bạn vào đây"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 font-mono text-xs sm:text-sm text-slate-800 transition outline-none"
              />
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Key được lưu cục bộ trên trình duyệt (localStorage), không truyền đi bên thứ ba.</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={() => setApiKey('')}
            className="text-xs font-bold text-rose-600 hover:text-rose-800 px-3 py-2 transition"
          >
            Xóa Key
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-extrabold text-slate-600 hover:bg-slate-200 transition"
            >
              Đóng
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Lưu & Áp Dụng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
