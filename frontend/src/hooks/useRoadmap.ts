"use client"

import { useState, useEffect, useCallback } from "react"
import type { UserRoadmap, RoadmapStats, RoadmapSetupInput } from "@/types/roadmap"
import {
  getStoredRoadmap,
  saveRoadmap as saveRoadmapUtil,
  clearRoadmap as clearRoadmapUtil,
  computeRoadmapStats,
  generateRoadmapMilestones,
} from "@/utils/roadmapStorage"

export function useRoadmap() {
  const [roadmap, setRoadmap] = useState<UserRoadmap | null>(null)
  const [stats, setStats] = useState<RoadmapStats | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const refreshStats = useCallback(async (currentRoadmap?: UserRoadmap | null) => {
    try {
      const activeRoadmap = currentRoadmap !== undefined ? currentRoadmap : getStoredRoadmap()
      const calculatedStats = await computeRoadmapStats(activeRoadmap)
      setStats(calculatedStats)
    } catch (err) {
      console.error("Error refreshing roadmap stats:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // 1. Initial load
    const stored = getStoredRoadmap()
    setRoadmap(stored)
    refreshStats(stored)

    // 2. Lắng nghe các sự kiện cập nhật
    const handleRoadmapChange = (e: Event) => {
      const customEvent = e as CustomEvent<UserRoadmap | null>
      setRoadmap(customEvent.detail)
      refreshStats(customEvent.detail)
    }

    const handleLessonProgressChange = () => {
      refreshStats()
    }

    window.addEventListener("roadmap-updated", handleRoadmapChange)
    window.addEventListener("lesson-progress-updated", handleLessonProgressChange)

    return () => {
      window.removeEventListener("roadmap-updated", handleRoadmapChange)
      window.removeEventListener("lesson-progress-updated", handleLessonProgressChange)
    }
  }, [refreshStats])

  const createOrUpdateRoadmap = useCallback((input: RoadmapSetupInput) => {
    const milestones = generateRoadmapMilestones(input)
    const newRoadmap: UserRoadmap = {
      ...input,
      id: `roadmap_${Date.now()}`,
      createdAt: roadmap?.createdAt || Date.now(),
      updatedAt: Date.now(),
      milestones,
    }

    saveRoadmapUtil(newRoadmap)
    setRoadmap(newRoadmap)
    refreshStats(newRoadmap)
    return newRoadmap
  }, [roadmap, refreshStats])

  const deleteRoadmap = useCallback(() => {
    clearRoadmapUtil()
    setRoadmap(null)
    refreshStats(null)
  }, [refreshStats])

  return {
    roadmap,
    stats,
    loading,
    createOrUpdateRoadmap,
    deleteRoadmap,
    refreshStats,
  }
}
