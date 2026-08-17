"use client"
import React, { useEffect, useState } from 'react'
import useVocab from '../../../hooks/useVocab'
import type { Word } from "../../../db/database"
import Link from 'next/link'

interface WordContainerProps {
  level: number,
  setCount: React.Dispatch<React.SetStateAction<number>>
}

const WordContainer = ({level, setCount}: WordContainerProps) => {
    const {loading,loadingAdd, getHskVocab, addToReview} = useVocab()
    const [words, setWords] = useState<Word[]>([])
    const [addedId, setAddedId] = useState<string | null>(null)

    useEffect(()=>{
    const handleGetWords = async() => {
        const res = await getHskVocab(level)
        setWords(res)
        setCount(res?.length)
      }
    handleGetWords()
    }, [level])
    
  const handleAddLearn = async (id: string) => {
    try {
      await addToReview(id)
      setAddedId(id)
      setTimeout(() => {
        setAddedId(null)
      }, 1200)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
       {loading?(<div>Loading......</div>):(
          words.length > 0 ?(
            words.map((w, idx) => (
                <Link
                key={w.id}
                href={`/vocabulary/${w.id}`}
                className="flex flex-col border p-3 rounded-xl hover:bg-gray-50"
                >                
                <div className='flex flex-row items-end gap-3'>
                    <h3 className='text-3xl md:text-6xl '>{w.hanzi}</h3>
                    <p className='text-sm md:text-xl'>{w.traditional}</p>
                    <button onClick={(e) => {e.stopPropagation(), e.preventDefault(), handleAddLearn(w.id)}} 
                            className={`text-sm p-1 bg-blue-500 text-white rounded-lg transition-all duration-700 ease-out 
                                        ${addedId === w.id ? "scale-105 bg-green-500"
                                                                  : loadingAdd === w.id
                                                                  ? "scale-90 bg-blue-400"
                                                                  : "scale-100 bg-blue-500 hover:bg-blue-600"
                                                            }`}
                    > {addedId === w.id ? "✓ Added" : loadingAdd === w.id ? "..." : "+Add"} 
                    </button>
                </div>
                <p className='text-sm'>Pinyin: {w.pinyin}</p>
                <p className='text-sm'>Classifiers: {w.classifiers}</p>
                <p className='text-sm wrap-break-word'>Meaning: {w.meanings.join(",")}</p>
                <p>Level: {w.sourceLevels.join(" ")}</p>
              </Link>
            ))
          ):(<div>'No words found'</div>)
       )}
    </div>
  )
}

export default WordContainer