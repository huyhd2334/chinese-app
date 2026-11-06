"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import type { UserRoadmap, RoadmapStats, RoadmapSetupInput } from "@/types/roadmap"
import {
  getStoredRoadmap,
  saveRoadmap as saveRoadmapUtil,
  clearRoadmap as clearRoadmapUtil,
  computeRoadmapStats,
  generateRoadmapMilestones,
} from "@/utils/roadmapStorage"
import { syncRoadmapWithCloud } from "@/utils/roadmapSync"

export function useRoadmap() {
  const { user } = useAuth()
  const uid = user?.id || "guest"

  const [roadmap, setRoadmap] = useState<UserRoadmap | null>(null)
  const [stats, setStats] = useState<RoadmapStats | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const refreshStats = useCallback(async (currentRoadmap?: UserRoadmap | null) => {
    try {
      const activeRoadmap = currentRoadmap !== undefined ? currentRoadmap : getStoredRoadmap(uid)
      const calculatedStats = await computeRoadmapStats(activeRoadmap, uid)
      setStats(calculatedStats)
    } catch (err) {
      console.error("Error refreshing roadmap stats:", err)
    } finally {
      setLoading(false)
    }
  }, [uid])

  useEffect(() => {
    // 1. Tải lộ trình của tài khoản hiện tại
    const stored = getStoredRoadmap(uid)
    setRoadmap(stored)
    refreshStats(stored)

    // 2. Nếu đã đăng nhập, tự động kéo dữ liệu lộ trình mới nhất từ Supabase Cloud
    if (uid !== "guest") {
      syncRoadmapWithCloud(uid).then((res) => {
        if (res.pulled) {
          const remoteStored = getStoredRoadmap(uid)
          setRoadmap(remoteStored)
          refreshStats(remoteStored)
        }
      }).catch(() => {})
    }

    // 3. Lắng nghe các sự kiện cập nhật
    const handleRoadmapChange = (e: Event) => {
      const customEvent = e as CustomEvent<UserRoadmap | null>
      const detail = customEvent.detail
      // Chỉ nhận event nếu nó đúng với user hiện tại hoặc là reset null
      if (detail === null || !detail.userId || detail.userId === uid) {
        setRoadmap(detail)
        refreshStats(detail)
      }
    }

    const handleLessonProgressChange = () => {
      refreshStats()
    }

    const handleCloudSyncChange = () => {
      refreshStats()
    }

    const handleAuthChange = () => {
      const freshStored = getStoredRoadmap()
      setRoadmap(freshStored)
      refreshStats(freshStored)
    }

    window.addEventListener("roadmap-updated", handleRoadmapChange)
    window.addEventListener("lesson-progress-updated", handleLessonProgressChange)
    window.addEventListener("hsk-cloud-synced", handleCloudSyncChange)
    window.addEventListener("hsk-srs-synced", handleCloudSyncChange)
    window.addEventListener("hsk-auto-seeded", handleCloudSyncChange)
    window.addEventListener("hsk-auth-changed", handleAuthChange)

    return () => {
      window.removeEventListener("roadmap-updated", handleRoadmapChange)
      window.removeEventListener("lesson-progress-updated", handleLessonProgressChange)
      window.removeEventListener("hsk-cloud-synced", handleCloudSyncChange)
      window.removeEventListener("hsk-srs-synced", handleCloudSyncChange)
      window.removeEventListener("hsk-auto-seeded", handleCloudSyncChange)
      window.removeEventListener("hsk-auth-changed", handleAuthChange)
    }
  }, [uid, refreshStats])

  const createOrUpdateRoadmap = useCallback((input: RoadmapSetupInput) => {
    const milestones = generateRoadmapMilestones(input)
    const newRoadmap: UserRoadmap = {
      ...input,
      id: `roadmap_${Date.now()}`,
      userId: uid,
      createdAt: roadmap?.createdAt || Date.now(),
      updatedAt: Date.now(),
      milestones,
    }

    saveRoadmapUtil(newRoadmap, uid)
    setRoadmap(newRoadmap)
    refreshStats(newRoadmap)
    return newRoadmap
  }, [roadmap, refreshStats, uid])

  const deleteRoadmap = useCallback(() => {
    clearRoadmapUtil(uid)
    setRoadmap(null)
    refreshStats(null)
  }, [refreshStats, uid])

  return {
    roadmap,
    stats,
    loading,
    createOrUpdateRoadmap,
    deleteRoadmap,
    refreshStats,
  }
}
