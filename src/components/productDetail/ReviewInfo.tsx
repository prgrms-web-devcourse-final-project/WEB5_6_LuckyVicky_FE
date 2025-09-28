'use client'

import { useState } from "react";
import TextReviewCard from "./TextReviewCard";
import PhotoReviewCard from "./PhotoReviewCard";

type Mode = 'photo' | 'text';


export default function ReviewInfo() {
  const [mode, setMode] = useState<Mode>('photo');

  return (
    <section>
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

    {mode === 'photo' ? <PhotoReviewCard /> : <TextReviewCard />}

    </section>
    )
}