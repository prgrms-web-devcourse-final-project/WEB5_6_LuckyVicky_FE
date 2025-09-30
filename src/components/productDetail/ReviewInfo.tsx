'use client'

import { useEffect, useRef, useState } from "react";
import TextReviewCard from "./TextReviewCard";
import PhotoReviewCard from "./PhotoReviewCard";

import X from "@/assets/icon/x.svg";
import Star from "@/assets/icon/star.svg";
import LineStar from "@/assets/icon/linestar.svg";

type Mode = 'photo' | 'text';
type ModalMode = 'create' | 'detail';

type Review = {
  id: number;
  type: Mode;
  content: string;
  image?: string;
  hashtags?:string[];
  rating:number;
}


export default function ReviewInfo() {
  const [mode, setMode] = useState<Mode>('photo');
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [editorValue, setEditorValue] = useState("");
  const [reviewUrl, setReviewUrl] = useState<string>('/defaultReview.svg');
  const [hashtagsInput, setHashtagsInput] = useState('');
  const [rating, setRating] = useState<number>(0);

  const [reviews, setReviews] = useState<Review[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const canSubmit = editorValue.trim().length >= 10 && rating > 0;

  const parseHashtags = (raw: string) => (
    raw
    .split(/[\s,]+/)
    .map(t => t.replace(/^#/, '').trim())
    .filter(Boolean)
    .map(t => `#${t}`)
    .slice(0,3)
  )

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedReview(null);
    setEditorValue('');
    setReviewUrl('/defaultReview.svg');
    setHashtagsInput('');
    setRating(0);
    setOpenModal(true);
  }

  const openDetailModal = (review:Review) => {
    setModalMode('detail');
    setSelectedReview(review);
    setEditorValue(review.content);
    setReviewUrl(review.image ?? '/defaultReview.svg');
    setRating(review.rating);
    setOpenModal(true);
  }

  const handleSubmit = () => {
    const isDefaultImg = reviewUrl === '/defaultReview.svg';
    const newReview: Review = {
      id: Date.now(),
      type: isDefaultImg ? 'text' : 'photo',
      content: editorValue.trim(),
      image: isDefaultImg ? undefined : reviewUrl,
      hashtags: parseHashtags(hashtagsInput),
      rating,
    };

    setReviews((prev) => [newReview, ...prev]);
    setMode(newReview.type);
    setEditorValue('');
    setReviewUrl('/defaultReview.svg');
    setHashtagsInput('');
    setRating(0);
    setOpenModal(false);
  }

    useEffect(() => {
      if (!openModal) return;
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev };
    }, [openModal]);

  return (
    <section>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h3 className="font-semibold py-12">리뷰</h3>
        <div className="flex items-center gap-5 text-gray-500 font-bold text-sm">
        
        <label className="cursor-pointer">
          <input type="radio" 
          name="reviewType"
          value="photo"
          checked={mode === 'photo'}
          onChange={()=>setMode('photo')}
          className="accent-primary mr-2 cursor-pointer"
          />
          <span>포토리뷰</span>
        </label>

        <label className="cursor-pointer">
          <input type="radio" 
          name="reviewType"
          value="text"
          checked={mode === 'text'}
          onChange={()=>setMode('text')}
          className="accent-primary mr-2 cursor-pointer"
          />
          <span>일반리뷰</span>
        </label>

        </div>
        </div>
        <div>
          <button 
          className="bg-primary rounded-lg px-4 py-2.5 text-white font-semibold border cursor-pointer transition hover:bg-white hover:border-primary hover:text-primary"
          onClick={openCreateModal}
          >
          리뷰 작성
        </button>
        </div>
      </div>

    {/* 포토리뷰 or 일반리뷰  */}
    {mode === 'photo' ? (
      <div className="grid grid-cols-4 gap-6">
        {reviews.filter(review => review.type === 'photo').map(review => (
          <PhotoReviewCard 
          key={review.id}
          image={review.image!}
          content={review.content}
          hashtags={review.hashtags}
          rating={review.rating}
          onClick={() => openDetailModal(review)}
          />
        ))}
      </div>
    ) : (
      <div>
        {reviews.filter(review => review.type === 'text').map(review => (
          <TextReviewCard 
          key={review.id}
          content={review.content}
          hashtags={review.hashtags}
          rating={review.rating}
          />
        ))}
      </div>
    )}

    {/* 리뷰작성 팝업창 */}
    {openModal && (
        <div 
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50"
          onClick={()=>setOpenModal(false)}
          >
          <div 
            className="bg-white rounded-2xl shadow-xl w-[764px] max-w-full"
            onClick={(e)=>e.stopPropagation()}
            >
            <div className="relative">
              <button
                className="absolute right-2 top-2 p-2 rounded cursor-pointer transition hover:bg-black/5"
                onClick={() => setOpenModal(false)}
              >
              <X width={18} height={18} />
              </button>
            </div>

          <div className="grid grid-cols-2">
            {/* 왼쪽 이미지 */}
            <aside
              onClick={modalMode === 'create' ? ()=>fileRef.current?.click() : undefined}
            >
              <img 
              src={reviewUrl} 
              alt="리뷰 이미지" 
              className={
              `w-full h-full object-cover rounded-bl-2xl rounded-tl-2xl
              ${modalMode === 'create' ? 'cursor-pointer' : ''}
              `} />

              {modalMode === 'create' && (
                <input
                id="review-photo"
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if(!file) return;
                  setReviewUrl(URL.createObjectURL(file));
                  e.currentTarget.value = '';
                }}
              />
              )}
            </aside>

            <section className="flex flex-col">
            {/* 내용 입력 */}
              <div className="h-3/4 rounded-2xl overflow-hidden">
                <textarea
                  value={editorValue}
                  onChange={(e) => setEditorValue(e.target.value)}
                  placeholder="리뷰를 남겨주세요 (10자 이상)"
                  readOnly={modalMode === 'detail'}
                  className="
                  w-full h-full resize-none
                  px-8 py-6 text-sm leading-6
                  focus:outline-none
                  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
                  "
                />
              </div>

              <div className="flex flex-col px-8 py-4 text-sm gap-4 text-gray-400">
                {/* 해시태그 */}
                {modalMode === 'create' ? (
                  <input 
                  type="text"
                  value={hashtagsInput}
                  placeholder="#최대 3개"
                  onChange={(e) => {
                    const raw = e.target.value;
                    const tags = raw.split(/[\s,]+/).filter(Boolean);
                    if(tags.length <= 3) {
                      setHashtagsInput(raw);
                    } else {
                      const limited = tags.slice(0,3).join(' ');
                      setHashtagsInput(limited);
                    }
                  }}
                  />
                ) : (
                  <div>
                    {(selectedReview?.hashtags ?? []).map((t, i) => (
                      <span key={i}>{t}</span>
                    ))}
                  </div>
                )}

                {/* 별점 */}
                <div className="flex">
                  {modalMode === 'create' ? (
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(n => (
                        <button
                        key={n}
                        type="button"
                        onClick={()=>setRating(n)}
                        >
                          {rating >= n ? (<Star />) : (<LineStar />)}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(n => (
                        <span key={n}>
                          {(selectedReview?.rating ?? 0) >= n ? (<Star />) : (<LineStar />)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 작성버튼 */}
            {modalMode === 'create' && (
              <div className="flex flex-col justify-center items-center gap-2 py-4">
              <button
                onClick={() => {
                  if(!canSubmit) return;
                  handleSubmit();
                }}
                disabled={!canSubmit}
                className={`px-8 py-2 rounded-lg font-semibold text-sm cursor-pointer
                ${canSubmit ? 'bg-primary text-white': 'bg-gray-200 text-gray-400 transition hover:bg-primary-20'}
                `}
              >
                작성하기
              </button>
            </div>
            )}
          </section>
          </div>
          </div>
        </div>
      )}

    </section>
    )
}