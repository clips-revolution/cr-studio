'use client'

import { useState, useEffect, useCallback } from 'react'
import { localStorageStorage } from '@/lib/clientStorage'
import type { Asset, AssetType } from '@/types'

export function useGallery(type?: AssetType) {
  const [assets, setAssets] = useState<Asset[]>([])

  const reload = useCallback(async () => {
    setAssets(await localStorageStorage.list(type))
  }, [type])

  useEffect(() => { reload() }, [reload])

  async function deleteAsset(id: string) {
    await localStorageStorage.delete(id)
    setAssets(prev => prev.filter(a => a.id !== id))
  }

  return { assets, deleteAsset, reload }
}
