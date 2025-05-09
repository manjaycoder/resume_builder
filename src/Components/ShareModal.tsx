import { useEffect, useRef, useState } from 'react';
import { FiCopy, FiX, FiFacebook, FiTwitter, FiLinkedin, FiLink } from 'react-icons/fi';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
}

export default function ShareModal({ isOpen, onClose, url, title = 'Share Profile' }: ShareModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => alert('Failed to copy URL'));
  };

  const shareOnSocial = (platform: string) => {
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div 
        ref={modalRef} 
        className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md transform transition-all ${isClosing ? 'scale-95' : 'scale-100'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 id="share-modal-title" className="text-lg font-bold dark:text-white">
            {title}
          </h3>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label="Close share modal"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="mb-6">
          <label htmlFor="share-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Share this link
          </label>
          <div className="flex gap-2">
            <input
              id="share-url"
              type="text"
              value={url}
              readOnly
              className="input input-bordered w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button
              onClick={handleCopy}
              className={`btn ${isCopied ? 'btn-success' : 'btn-primary'} flex items-center gap-2`}
              aria-label={isCopied ? 'Copied!' : 'Copy to clipboard'}
            >
              {isCopied ? 'Copied!' : <><FiCopy /> Copy</>}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Share via
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => shareOnSocial('twitter')}
              className="btn btn-circle btn-outline text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
              aria-label="Share on Twitter"
            >
              <FiTwitter size={18} />
            </button>
            <button
              onClick={() => shareOnSocial('facebook')}
              className="btn btn-circle btn-outline text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
              aria-label="Share on Facebook"
            >
              <FiFacebook size={18} />
            </button>
            <button
              onClick={() => shareOnSocial('linkedin')}
              className="btn btn-circle btn-outline text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30"
              aria-label="Share on LinkedIn"
            >
              <FiLinkedin size={18} />
            </button>
            <button
              onClick={() => navigator.share?.({ url, title })}
              className="btn btn-circle btn-outline hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Share using native share dialog"
              disabled={!navigator.share}
            >
              <FiLink size={18} />
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="btn btn-ghost dark:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}