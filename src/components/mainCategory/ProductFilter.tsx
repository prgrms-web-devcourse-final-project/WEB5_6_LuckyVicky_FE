'use client'

import { useState } from "react"


export default function ProductFilter() {
    const [selected, setSelected] = useState('인기순');
    
    const options = ['인기순','최신순','낮은 가격순','높은 가격순'];


  return (
    <div>
        <div className="border-b border-gray-200 my-3"></div>

        <div>
            <div>
                <button>
                    {selected}
                </button>
            </div>
        </div>
    </div>
  )
}