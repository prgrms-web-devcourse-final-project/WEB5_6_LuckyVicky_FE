import React, { useState } from 'react';
import PaperClip from '@/assets/icon/paperclip.svg';

interface NewsCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string, files: File[]) => void;
}

const NewsCreateModal: React.FC<NewsCreateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setAttachedFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      onSubmit(title, content, attachedFiles);
      // Reset form
      setTitle('');
      setContent('');
      setAttachedFiles([]);
      onClose();
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setAttachedFiles([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-[1100px] max-w-[1100px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">새 소식 작성</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <p>X</p>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="새로운 업데이트를 알립니다."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Content Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="안녕하세요 작가 OO입니다. 새로운 업데이트 관련 내용을 알려드리겠습니다. 안녕하세요 작가 OO입니다. 새로운 업데이트 관련 내용을 알려드리겠습니다."
              className="w-full h-80 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* File Upload */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-gray-700">
                첨부파일
              </label>
              <PaperClip />
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
              >
                파일을 선택하세요
              </label>
            </div>

            {/* Attached Files Display */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {attachedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700 flex items-center gap-2"
                  >
                    <span>{file.name}</span>
                    <button
                      onClick={() =>
                        setAttachedFiles((prev) =>
                          prev.filter((_, i) => i !== index),
                        )
                      }
                      className="text-gray-500 hover:text-red-500"
                    >
                      <p>x</p>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            작성취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            작성하기
          </button>
        </div>
      </div>
    </div>
  );
};

// 사용 예시 컴포넌트
const NewsInputModal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleNewsSubmit = (title: string, content: string, files: File[]) => {
    console.log('새 소식 작성:', { title, content, files });
    // 여기에 실제 API 호출 로직 추가
  };

  return (
    <div className="p-8">
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        새 소식 작성하기
      </button>

      <NewsCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewsSubmit}
      />
    </div>
  );
};

export default NewsInputModal;
